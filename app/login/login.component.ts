import { Component, OnInit } from "@angular/core";
import firebase = require("nativescript-plugin-firebase");
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import * as EmailValidator from "email-validator";
import { Router } from "@angular/router";
import * as dialogs from "ui/dialogs";
import { SecureStorage } from "nativescript-secure-storage";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

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
     firebase
      .init({
        onAuthStateChanged: data => {
          console.log(
            data.loggedIn ? "Logged in to firebase" : "Logged out from firebase"
          );
          if (data.loggedIn) {
            console.log(
              "user's email address: " +
                (data.user.email ? data.user.email : "N/A")
            );
            //this.router.navigateByUrl("/profile");
          }
        }
      })
      .then(
        instance => {
          console.log("firebase.init done");
        },
        error => {
          //BORRAR
          this.router.navigateByUrl("/profile");
          console.log("firebase.init error: " + error);
        }
      ); 
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
              value: this.email.toLowerCase()
            }
          ]
        })
        .then(result => {
          for (var key in result.value) {
            firebase
              .resetPassword({
                email: this.email.toLowerCase()
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
      "passRegister"
    );
    password.secure = !password.secure;
    passwordReg.secure = !passwordReg.secure;
  }

  register() {
    console.log(
      "email:" +
        this.emailRegister +
        " pass:" +
        this.passRegister +
        " name:" +
        this.nameRegister +
        " lastname:" +
        this.lastnameRegister +
        " id:" +
        this.id
    );
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
        .query(this.onQueryEvent, "/users", {
          singleEvent: true,
          orderBy: {
            type: firebase.QueryOrderByType.CHILD,
            value: "email"
          },
          ranges: [
            {
              type: firebase.QueryRangeType.EQUAL_TO,
              value: this.emailRegister
            }
          ]
        })
        .then(result => {
          if (result.value == null) {
            firebase
              .createUser({
                email: this.emailRegister.toLowerCase(),
                password: this.passRegister
              })
              .then(
                result => {
                  firebase
                    .push("/users", {
                      email: this.emailRegister.toLowerCase(),
                      id: this.id,
                      lastname: this.lastnameRegister,
                      name: this.nameRegister,
                      points: 0,
                      type: "client",
                      image: "~/assets/productodefault.png"
                    })
                    .then(result => {
                      console.log("created key: " + result.key);
                      let secureStorage = new SecureStorage();
                      secureStorage
                        .set({
                          key: "user",
                          value: JSON.stringify({
                            name:
                              this.nameRegister + " " + this.lastnameRegister,
                            email: this.emailRegister.toLowerCase(),
                            image: "~/assets/productodefault.png",
                            key: result.key
                          })
                        })
                        .then(function(success) {
                          console.log("Successfully set a value? " + success);
                        });
                      this.router.navigateByUrl("/home");
                    });
                },
                errorMessage => {
                  firebase
                    .push("/users", {
                      email: this.emailRegister.toLowerCase(),
                      id: this.id,
                      lastname: this.lastnameRegister,
                      name: this.nameRegister,
                      points: 0,
                      type: "client",
                      image: "~/assets/productodefault.png"
                    })
                    .then(result => {
                      console.log("created key: " + result.key);
                      let secureStorage = new SecureStorage();
                      secureStorage
                        .set({
                          key: "user",
                          value: JSON.stringify({
                            name:
                              this.nameRegister + " " + this.lastnameRegister,
                            email: this.emailRegister.toLowerCase(),
                            image: "~/assets/productodefault.png",
                            key: result.key
                          })
                        })
                        .then(function(success) {
                          console.log("Successfully set a value? " + success);
                        });
                      this.router.navigateByUrl("/home");
                    });
                }
              );
          } else {
            dialogs.alert({
              title: "Algo anda mal!",
              message:
                "Ya existe una cuenta asociada a este correo electrónico",
              okButtonText: "OK"
            });
          }
        })
        .catch(error => {});
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
            email: this.email.toLowerCase(),
            password: this.pass
          }
        })
        .then(resultLo => {
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
                  value: this.email.toLowerCase()
                }
              ]
            })
            .then(
              result => {
                if (result.value == null) {
                  dialogs.alert({
                    title: "Algo anda mal!",
                    message: "No existe una cuenta asociada",
                    okButtonText: "OK"
                  });
                } else {
                  for (var key in result.value) {
                    for (var key in result.value) {
                      if (
                        resultLo.profileImageURL &&
                        result.value[key].image != resultLo.profileImageURL &&
                        result.value[key].image ==
                          "~/assets/productodefault.png"
                      ) {
                        var secureStorage = new SecureStorage();
                        secureStorage
                          .set({
                            key: "user",
                            value: JSON.stringify({
                              name: result.value[key].name,
                              email: result.value[key].email,
                              image: resultLo.profileImageURL,
                              key: result.key
                            })
                          })
                          .then(function(success) {
                            console.log("Successfully set a value? " + success);
                          });
                        this.router.navigateByUrl("/home");
                      } else {
                        console.log("Value: " + result.value[key].email);
                        var secureStorage = new SecureStorage();
                        secureStorage
                          .set({
                            key: "user",
                            value: JSON.stringify({
                              name: result.value[key].name,
                              email: result.value[key].email,
                              image: result.value[key].image,
                              key: result.key
                            })
                          })
                          .then(function(success) {
                            console.log("Successfully set a value? " + success);
                          });
                        this.router.navigateByUrl("/home");
                      }
                    }
                  }
                }
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
        });
    } else {
      this.valid = false;
      this.validText = "Direccion de correo invalida!";
    }
  }

  fbLogin() {
    console.log("fb");
    firebase.logout();
    firebase
      .login({
        type: firebase.LoginType.FACEBOOK
        // Optional
      })
      .then(resultFa => {
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
                value: resultFa.email
              }
            ]
          })
          .then(result => {
            if (result.value == null) {
              dialogs.alert({
                title: "Algo anda mal!",
                message: "No existe una cuenta asociada",
                okButtonText: "OK"
              });
            } else {
              for (var key in result.value) {
                if (
                  resultFa.profileImageURL &&
                  result.value[key].image != resultFa.profileImageURL &&
                  result.value[key].image == "~/assets/productodefault.png"
                ) {
                  var secureStorage = new SecureStorage();
                  secureStorage
                    .set({
                      key: "user",
                      value: JSON.stringify({
                        name: resultFa.name,
                        email: resultFa.email,
                        image: resultFa.profileImageURL
                      })
                    })
                    .then(function(success) {
                      console.log("Successfully set a value? " + success);
                    });
                  this.router.navigateByUrl("/home");
                } else {
                  var secureStorage = new SecureStorage();
                  secureStorage
                    .set({
                      key: "user",
                      value: JSON.stringify({
                        name: resultFa.name,
                        email: resultFa.email,
                        image: result.value[key].image
                      })
                    })
                    .then(function(success) {
                      console.log("Successfully set a value? " + success);
                    });
                  this.router.navigateByUrl("/home");
                }
              }
            }
          }).catch(err=>{
            console.log(err);
          });
      });
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
                var secureStorage = new SecureStorage();
                secureStorage
                  .set({
                    key: "user",
                    value: JSON.stringify({
                      name: result.value[key].name,
                      email: result.value[key].email,
                      image: result.value[key].image,
                      key: result.key
                    })
                  })
                  .then(function(success) {
                    console.log("Successfully set a value? " + success);
                  });
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
      .then(resultGo => {
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
                value: resultGo.email
              }
            ]
          })
          .then(result => {
            if (result.value == null) {
              dialogs.alert({
                title: "Algo anda mal!",
                message: "No existe una cuenta asociada",
                okButtonText: "OK"
              });
            } else {
              for (var key in result.value) {
                if (
                  resultGo.profileImageURL &&
                  result.value[key].image != resultGo.profileImageURL &&
                  result.value[key].image == "~/assets/productodefault.png"
                ) {
                  var secureStorage = new SecureStorage();
                  secureStorage
                    .set({
                      key: "user",
                      value: JSON.stringify({
                        name: resultGo.name,
                        email: resultGo.email,
                        image: resultGo.profileImageURL,
                        key: result.key
                      })
                    })
                    .then(function(success) {
                      console.log("Successfully set a value? " + success);
                    });
                  this.router.navigateByUrl("/home");
                } else {
                  console.log("Value: " + result.value[key].email);
                  var secureStorage = new SecureStorage();
                  secureStorage
                    .set({
                      key: "user",
                      value: JSON.stringify({
                        name: result.value[key].name,
                        email: result.value[key].email,
                        image: result.value[key].image,
                        key: result.key
                      })
                    })
                    .then(function(success) {
                      console.log("Successfully set a value? " + success);
                    });
                  this.router.navigateByUrl("/home");
                }
              }
            }
          });
      });
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
                var secureStorage = new SecureStorage();
                secureStorage
                  .set({
                    key: "user",
                    value: JSON.stringify({
                      name: result.value[key].name,
                      email: result.value[key].email,
                      image: result.value[key].image,
                      key: result.key
                    })
                  })
                  .then(function(success) {
                    console.log("Successfully set a value? " + success);
                  });
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
