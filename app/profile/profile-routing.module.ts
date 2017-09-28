import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ProfileComponent } from "./profile.component";
import { LoginComponent } from "../login/login.component";

const routes: Routes = [
    { path: "", component: ProfileComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ProfileRoutingModule { }
