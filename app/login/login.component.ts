import { Component, OnInit } from "@angular/core";
import firebase = require("nativescript-plugin-firebase");
import * as elementRegistryModule from "nativescript-angular/element-registry";
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import * as EmailValidator from "email-validator";
import { Router } from "@angular/router";
import * as dialogs from "ui/dialogs";
var SecureStorage = require("nativescript-secure-storage").SecureStorage;
import { NativeScriptFormsModule } from "nativescript-angular/forms";

elementRegistryModule.registerElement(
  "CardView",
  () => require("nativescript-cardview").CardView
);

@Component({
  selector: "app-login",
  moduleId: module.id,  
  templateUrl: "./login.component.html"
})
export class LoginComponent implements OnInit {
  passRegister: string = "";
  id: any = "";
  lastnameRegister: string = "";
  nameRegister: string = "";
  emailRegister: string = "";
  email: any = "";
  pass: any = "";
  validText: any = "";
  valid: boolean = true;
  public isRegistration: boolean = true;

  constructor(private page: Page, private router: Router) {
    page.actionBarHidden = true;
    console.log(this.router.url);
    
  }

  ngOnInit() {
    //DELETE
    //this.router.navigateByUrl("/home");
  }

  resetPassword() {
    if (this.email == "") {
      dialogs
        .alert({
          title: "Algo anda mal!",
          message: "Ingresa tu dirección de correo electronico",
          okButtonText: "Ok"
        })
        .then(() => {
          console.log("Dialog closed!");
        });
    } else if (EmailValidator.validate(this.email)) {
      console.log(this.email);
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
              value: this.email
            }
          ]
        })
        .then(result => {
          for (var key in result.value) {
            firebase
              .resetPassword({
                email: this.email
              })
              .then(
                success => {
                  this.email = "";
                  dialogs
                    .alert({
                      title: "Recupera tu cuenta!",
                      message:
                        "Correo de recuperación de contraseña enviado, revisa tu bandeja de entrada y sigue los pasos",
                      okButtonText: "Ok"
                    })
                    .then(() => {
                      console.log("Dialog closed!");
                    });
                },
                function(errorMessage) {
                  console.log(errorMessage);
                }
              );
          }
        })
        .catch(error => {
          dialogs
            .alert({
              title: "Algo anda mal!",
              message: "El correo ingresado no esta registrado",
              okButtonText: "Ok"
            })
            .then(() => {
              console.log("Dialog closed!");
            });
        });
    } else {
      dialogs
        .alert({
          title: "Algo anda mal!",
          message: "La dirección de correo electronico es invalida",
          okButtonText: "Ok"
        })
        .then(() => {
          console.log("Dialog closed!");
        });
    }
  }

  seePassword() {
    let password: TextField = <TextField>this.page.getViewById("password");
    let passwordReg: TextField = <TextField>this.page.getViewById(
      "passwordReg"
    );
    password.secure = !password.secure;
    passwordReg.secure = !passwordReg.secure;
  }

  register() {
    if (
      this.emailRegister == "" ||
      this.passRegister == "" ||
      this.nameRegister == "" ||
      this.lastnameRegister == "" ||
      this.id == ""
    ) {
      this.validText = "Los campos deben estar llenos!";
      this.valid = false;
    } else if (EmailValidator.validate(this.emailRegister)) {
      firebase
        .login({
          type: firebase.LoginType.PASSWORD,
          passwordOptions: {
            email: this.emailRegister,
            password: this.passRegister
          }
        })
        .then(
          result => {
            firebase
              .push("/users", {
                email: this.emailRegister,
                id: this.id,
                lastname: this.lastnameRegister,
                name: this.nameRegister,
                points: 0,
                type: "client"
              })
              .then(result => {
                console.log("created key: " + result.key);
                var secureStorage = new SecureStorage();
                secureStorage
                  .set({
                    key: "user",
                    value: {
                      name: this.nameRegister + " " + this.lastnameRegister,
                      email: this.emailRegister
                    }
                  })
                  .then(function(success) {
                    console.log("Successfully set a value? " + success);
                  });
                this.router.navigateByUrl("/home");
              });
          },
          errorMessage => {
            console.log(errorMessage);
          }
        );
    } else {
      this.valid = false;
      this.validText = "Direccion de correo invalida!";
    }
  }

  login() {
    if (this.email == "" || this.pass == "") {
      this.validText = "Los campos deben estar llenos!";
      this.valid = false;
    } else if (EmailValidator.validate(this.email)) {
      //login
      this.valid = true;
      firebase
        .login({
          type: firebase.LoginType.PASSWORD,
          passwordOptions: {
            email: this.email,
            password: this.pass
          }
        })
        .then(
          result => {
            console.log("logged");
            var secureStorage = new SecureStorage();
            console.log("logged2");
            secureStorage.set({
              key: "user",
              value: JSON.stringify({
                name: result.name,
                email: this.email,
                image:result.profileImageURL
              })
            });
            console.log("Successfully set a value");
            this.router.navigateByUrl("/home");
          },
          errorMessage => {
            console.log("Error:" + errorMessage);
            if (
              errorMessage ==
              "There is no user record corresponding to this identifier. The user may have been deleted."
            ) {
              dialogs.alert({
                title: "Algo anda mal!",
                message: "El email ingresado es incorrecto",
                okButtonText: "OK"
              });
            } else if (
              errorMessage ==
              "The password is invalid or the user does not have a password."
            ) {
              dialogs.alert({
                title: "Algo anda mal!",
                message:
                  "La contraseña ingresada es incorrecta o el usuario no posee contraseña!",
                okButtonText: "OK"
              });
            }
          }
        );
    } else {
      this.valid = false;
      this.validText = "Direccion de correo invalida!";
    }
  }

  fbLogin() {
    console.log("fb");
    firebase
      .login({
        type: firebase.LoginType.FACEBOOK,
        // Optional
        facebookOptions: {
          // defaults to ['public_profile', 'email']
          scope: ["public_profile", "email"]
        }
      })
      .then(
        result => {
          console.log(JSON.stringify(result));
          this.router.navigateByUrl("/home");
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
  }

  fbRegister() {
    this.emailRegister = "";
    this.nameRegister = "";
    this.lastnameRegister = "";
    firebase
      .login({
        type: firebase.LoginType.FACEBOOK,
        // Optional
        facebookOptions: {
          // defaults to ['public_profile', 'email']
          scope: ["public_profile", "email"]
        }
      })
      .then(
        result => {
          console.log("JSON:" + JSON.stringify(result));
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
                  value: result.email
                }
              ]
            })
            .then(result => {
              for (var key in result.value) {
                console.log("Value: " + result.value[key].email);
                this.router.navigateByUrl("/home");
              }
            })
            .catch(error => {});
          this.emailRegister = result.email;
          let authDisplayName = result.name.split(" ");
          this.nameRegister = authDisplayName[0];
          this.lastnameRegister = authDisplayName[1];
          //this.router.navigateByUrl("/home");
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
  }

  googleLogin() {
    console.log("google");
    firebase.logout();
    firebase
      .login({
        type: firebase.LoginType.GOOGLE
        // Optional
      })
      .then(
        result => {
          JSON.stringify(result);
          console.log(result);
          this.router.navigateByUrl("/home");
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
  }

  onQueryEvent(result) {
    console.log(JSON.stringify(result));
    if (!result.error) {
    }
  }

  googleRegister() {
    this.emailRegister = "";
    this.nameRegister = "";
    this.lastnameRegister = "";
    firebase.logout();
    firebase
      .login({
        type: firebase.LoginType.GOOGLE
        // Optional
      })
      .then(
        result => {
          console.log("JSON:" + JSON.stringify(result));
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
                  value: result.email
                }
              ]
            })
            .then(result => {
              for (var key in result.value) {
                console.log("Value: " + result.value[key].email);
                this.router.navigateByUrl("/home");
              }
            })
            .catch(error => {});
          this.emailRegister = result.email;
          let authDisplayName = result.name.split(" ");
          this.nameRegister = authDisplayName[0];
          this.lastnameRegister = authDisplayName[1];
          //this.router.navigateByUrl("/home");
        },
        errorMessage => {
          console.log(errorMessage);
        }
      );
  }
}
