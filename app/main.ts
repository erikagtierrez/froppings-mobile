// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { platformNativeScriptDynamic } from "nativescript-angular/platform";
import firebase = require("nativescript-plugin-firebase");

import { AppModule } from "./app.module";

firebase.init({
    /* onAuthStateChanged: function(data) {
      console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
      if (data.loggedIn) {
        console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
      }
    } */
   }).then(
    (instance) => {
      console.log("firebase.init done");
    },
    (error) => {
      console.log("firebase.init error: " + error);
    }
  );

platformNativeScriptDynamic().bootstrapModule(AppModule);
