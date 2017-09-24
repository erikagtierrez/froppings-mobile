import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { SharedModule } from "../shared/shared.module";
import { ProductDetailsRoutingModule } from "./productdetails-routing.module";
import { ProductDetailsComponent } from "./productdetails.component";

@NgModule({
    imports: [
        NativeScriptModule,
        ProductDetailsRoutingModule,
        SharedModule
    ],
    declarations: [
        ProductDetailsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ProductDetailsModule { }
