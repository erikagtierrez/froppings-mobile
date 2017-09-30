import { Component } from "@angular/core";
import * as elementRegistryModule from "nativescript-angular/element-registry";
import { registerElement } from "nativescript-angular";
registerElement("Gradient", () => require("nativescript-gradient").Gradient);

elementRegistryModule.registerElement(
  "CardView",
  () => require("nativescript-cardview").CardView
);

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent { }
