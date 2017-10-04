import { Component, OnInit, ViewChild } from "@angular/core";
import {
  DrawerTransitionBase,
  SlideInOnTopTransition
} from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");
import { Router } from "@angular/router";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { Border } from "tns-core-modules/ui/border";
import { SecureStorage } from "nativescript-secure-storage";
import * as dialogs from "ui/dialogs";

@Component({
  selector: "Profile",
  moduleId: module.id,
  templateUrl: "./profile.component.html"
})
export class ProfileComponent implements OnInit {
  @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  private changingPassword: boolean = false;
  private stackheight: string = "30%";
  name: string = "";
  lastname: string = "";
  id: string = "";
  email: string = "";
  points: number = 0;
  currentPass: string = "";
  newPass: string = "";
  image: string = "";
  key: string = "";
  constructor(private router: Router) {}

  logout() {
    firebase.logout();
    this.router.navigateByUrl("/login");
  }

  ngOnInit(): void {
    let secureStorage = new SecureStorage();
    this._sideDrawerTransition = new SlideInOnTopTransition();
    secureStorage.get({ key: "user" }).then(value => {
      this.image = JSON.parse(value).image;
      this.key = JSON.parse(value).key;
    });
    console.log(this.image);
    firebase.getCurrentUser().then(resultPro => {
      firebase
        .query(this.onQueryEvent, "/users", {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: "email"
          },
          ranges: [
            {
              type: firebase.QueryRangeType.EQUAL_TO,
              value: resultPro.email
            }
          ]
        })
        .then(result => {
          for (var key in result.value) {
            this.name = result.value[key].name;
              this.lastname = result.value[key].lastname;
              this.email = result.value[key].email;
              this.id = result.value[key].id;
              this.points=result.value[key].points;
          }
        });
    });
  }

  saveProfile() {
    console.log("USER" + this.name);
    let path = "/users/" + this.key;
    firebase
      .update(path, {
        email: this.email,
        id: this.id,
        image: this.image,
        lastname: this.lastname,
        name: this.name
      })
      .then(result => {
        dialogs.alert({
          title: "Listo!",
          message: "El perfil ha sido guardado",
          okButtonText: "OK"
        });
      });
  }

  changePassword() {
    if (this.currentPass != "" && this.newPass != "") {
      firebase
        .changePassword({
          email: this.email,
          oldPassword: this.currentPass,
          newPassword: this.newPass
        })
        .then(
          success =>{
            dialogs.alert({
              title: "Listo!",
              message: "Cambio de contraseña exitoso",
              okButtonText: "OK"
            });
          },
          function(errorMessage) {
            console.log(errorMessage);
            dialogs.alert({
              title: "Algo anda mal!",
              message: "La contraseña no fue cambiada",
              okButtonText: "OK"
            });
          }
        );
    }
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition;
  }

  onDrawerButtonTap(): void {
    this.drawerComponent.sideDrawer.showDrawer();
  }

  onQueryEvent(result) {
    console.log(JSON.stringify(result));
    if (!result.error) {
    }
  }
}
