import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { SharedModule } from "../shared/shared.module";
import { ProductsComponent } from "./products.component";
import { ProductsRoutingModule } from "./products-routing.module";

@NgModule({
    imports: [
        NativeScriptModule,
        SharedModule,
        ProductsRoutingModule        
    ],
    declarations: [
        ProductsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class ProductsModule { }
