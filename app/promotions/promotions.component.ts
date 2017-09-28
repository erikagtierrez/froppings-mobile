import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");
import * as elementRegistryModule from "nativescript-angular/element-registry";
import { Observable as RxObservable } from 'rxjs/Observable';
import {initializeOnAngular} from "nativescript-web-image-cache";
import { registerElement } from "nativescript-angular";
registerElement("Gradient", () => require("nativescript-gradient").Gradient);

@Component({
    selector: "Promotions",
    moduleId: module.id,
    templateUrl: "./promotions.component.html"
})
export class PromotionsComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    public promotions=["1","2"];

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }
}
