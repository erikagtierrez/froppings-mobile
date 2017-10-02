import { Component, OnInit, ViewChild } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");
import { Router } from "@angular/router";

@Component({
    selector: "Profile",
    moduleId: module.id,
    templateUrl: "./profile.component.html"
})
export class ProfileComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;

    constructor(
        private router: Router
    ){}

    logout(){
        firebase.logout();
        this.router.navigateByUrl("/login");
    }

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
