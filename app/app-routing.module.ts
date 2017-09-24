import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { LoginComponent } from "./login/login.component";
import { ProductsComponent } from "./products/products.component";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "home", loadChildren: "./home/home.module#HomeModule" },
    { path: "login", component: LoginComponent },        
    { path: "products", loadChildren:  "./products/products.module#ProductsModule" },        
    { path: "productdetails", loadChildren: "./productDetails/productdetails.module#ProductDetailsModule" },
    { path: "promotions", loadChildren: "./promotions/promotions.module#PromotionsModule" },
    { path: "profile", loadChildren: "./profile/profile.module#ProfileModule" },
    { path: "settings", loadChildren: "./settings/settings.module#SettingsModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
