import { Component, OnInit } from "@angular/core";
import firebase = require("nativescript-plugin-firebase");
import * as elementRegistryModule from 'nativescript-angular/element-registry';
import { Page } from "ui/page";
import { TextField } from "ui/text-field";
import * as EmailValidator from 'email-validator';
import { Router } from "@angular/router";
import * as dialogs from "ui/dialogs";



elementRegistryModule.registerElement(
  "CardView",
  () => require("nativescript-cardview").CardView
);

@Component({
  selector: "app-login",
  templateUrl: `./login/login.component.html`
})
export class LoginComponent implements OnInit{
  email: any="";
  pass: any="";
  validText: any="";
  valid: boolean = true;

  constructor(
    private page: Page,
    private router: Router) {
    page.actionBarHidden = true;
  }

  ngOnInit(){
  }

  seePassword(){
    let password: TextField = <TextField> this.page.getViewById("password");
    password.secure=!password.secure;
  }

  login() {
    if (this.email == "" || this.pass == "") {
      this.validText = "Los campos deben estar llenos!";
      this.valid = false;
    } else if (EmailValidator.validate(this.email)) {
      //login
      this.valid = true;
      firebase.login({
        type: firebase.LoginType.PASSWORD,
        passwordOptions: {
          email: this.email,
          password: this.pass
        }
      }).then((result)=> {
            this.router.navigateByUrl("/home");      
          },
          (errorMessage)=> {
            console.log("Error:"+errorMessage);
            if(errorMessage=='Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidUserException: There is no user record corresponding to this identifier. The user may have been deleted.'){
              dialogs.alert({
                title: "Algo anda mal!",
                message: "El email ingresado es incorrecto",
                okButtonText: "OK"
            });
            }else if(errorMessage=='Logging in the user failed. com.google.firebase.auth.FirebaseAuthInvalidCredentialsException: The password is invalid or the user does not have a password.'){
              dialogs.alert({
                title: "Algo anda mal!",
                message: "La contraseña ingresada es incorrecta o el usuario no posee contraseña!",
                okButtonText: "OK"
            });
          }
        }); 
    } else {
      this.valid = false;
      this.validText = "Direccion de correo invalida!";
    }
  }

  fbLogin(){
    console.log("fb")
    firebase.login({
      type: firebase.LoginType.FACEBOOK,
      // Optional
      facebookOptions: {
        // defaults to ['public_profile', 'email']
        scope: ['public_profile', 'email']
      }
    }).then( (result) =>{
          console.log(JSON.stringify(result));
          this.router.navigateByUrl("/home");                
        },(errorMessage) =>{
          console.log(errorMessage);
        }
    );
  }

  googleLogin(){
    console.log("google");
    firebase.logout();    
    firebase.login({
      type: firebase.LoginType.GOOGLE,
      // Optional 
    }).then( (result)=> {
          JSON.stringify(result);
          console.log(result);
          this.router.navigateByUrl("/home");                
        },(errorMessage)=> {
          console.log(errorMessage);
        }
    );
  }
}