import { Component, Input, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { ItemEventData } from "ui/list-view";
import firebase = require("nativescript-plugin-firebase");
import { SecureStorage } from "nativescript-secure-storage";
/* ***********************************************************
* Keep data that is displayed in your app drawer in the MyDrawer component class.
* Add new data objects that you want to display in the drawer here in the form of properties.
*************************************************************/
@Component({
  selector: "MyDrawer",
  moduleId: module.id,
  templateUrl: "./my-drawer.component.html",
  styleUrls: ["./my-drawer.component.css"]
})
export class MyDrawerComponent implements OnInit {
  /* ***********************************************************
    * The "selectedPage" is a component input property.
    * It is used to pass the current page title from the containing page component.
    * You can check how it is used in the "isPageSelected" function below.
    *************************************************************/
  @Input() selectedPage: string;
  private _navigationItems: Array<any>;
  public user: any;
  constructor(private routerExtensions: RouterExtensions) {
    let secureStorage = new SecureStorage();
    this.user = secureStorage
      .get({
        key: "user"
      })
      .then(value => {
        console.log("Got value: " + value);
        this.user = JSON.parse(value);
      });
  }

  /* ***********************************************************
    * Use the MyDrawerComponent "onInit" event handler to initialize the properties data values.
    * The navigationItems property is initialized here and is data bound to <ListView> in the MyDrawer view file.
    * Add, remove or edit navigationItems to change what is displayed in the app drawer list.
    *************************************************************/
  ngOnInit(): void {
    this._navigationItems = [
      {
        title: "Inicio",
        name: "home",
        route: "/home",
        icon: "\uf015"
      },
      {
        title: "Productos",
        name: "products",
        route: "/products",
        icon: "\uf009"
      },
      {
        title: "Promociones",
        name: "promotions",
        route: "/promotions",
        icon: "\uf145"
      },
      {
        title: "Perfil",
        name: "profile",
        route: "/profile",
        icon: "\uf007"
      },
      {
        title: "Cerrar sesión",
        name: "settings",
        route: "/logout",
        icon: "\uf08b"
      }
    ];
  }

  get navigationItems(): Array<any> {
    return this._navigationItems;
  }

  /* ***********************************************************
    * Use the "itemTap" event handler of the <ListView> component for handling list item taps.
    * The "itemTap" event handler of the app drawer <ListView> is used to navigate the app
    * based on the tapped navigationItem's route.
    *************************************************************/
  onNavigationItemTap(args: ItemEventData): void {
    const navigationItemView = args.view;
    const navigationItemRoute = navigationItemView.bindingContext.route;
    if (navigationItemRoute != "/logout") {
      this.routerExtensions.navigate([navigationItemRoute], {
        transition: {
          name: "fade"
        }
      });
    } else {
      firebase.logout();
      this.routerExtensions.navigate(["/login"], {
        transition: {
          name: "fade"
        }
      });
    }
  }
  /* ***********************************************************
    * The "isPageSelected" function is bound to every navigation item on the <ListView>.
    * It is used to determine whether the item should have the "selected" class.
    * The "selected" class changes the styles of the item, so that you know which page you are on.
    *************************************************************/
  isPageSelected(pageTitle: string): boolean {
    return pageTitle === this.selectedPage;
  }
}
