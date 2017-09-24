import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { SharedModule } from "../shared/shared.module";
import { PromotionsComponent } from "./promotions.component";
import { PromotionsRoutingModule } from "./promotions-routing.module";

@NgModule({
    imports: [
        NativeScriptModule,
        PromotionsRoutingModule,
        SharedModule
    ],
    declarations: [
        PromotionsComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class PromotionsModule { }
