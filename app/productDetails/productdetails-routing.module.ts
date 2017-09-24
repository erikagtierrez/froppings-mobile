import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { ProductDetailsComponent } from "./productdetails.component";

const routes: Routes = [
    { path: "", component: ProductDetailsComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class ProductDetailsRoutingModule { }
