import { Component, OnInit, ViewChild, NgZone} from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import * as frameModule from "tns-core-modules/ui/frame"
import firebase = require("nativescript-plugin-firebase");
import { Router } from "@angular/router";
import {ListView} from "ui/list-view";
import { Observable as RxObservable } from "rxjs/Observable";
var nativescriptGradient = require("nativescript-gradient")

export class Feautured {
    constructor(
      public name: string,
      public type: string,
      public description:string,
      public image:string,
      public discount: number,
      public code: string,
      public dateStart: string,
      public dateEnd: string,
      public minPurchase: number,
      public key: string
    ) {}
  }

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})

export class HomeComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    public featured: RxObservable<Array<Feautured>>;
    public featuredArray = [];
    public subscr;

    constructor(private router: Router, private zone: NgZone){

    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        firebase.query(this.onFeaturedEvent, "/featured", {
            singleEvent: false,
            orderBy: {
              type: firebase.QueryOrderByType.VALUE
            }
          });
          this.featured = RxObservable.create(subscriber => {
            this.subscr = subscriber;
            subscriber.next(this.featuredArray);
            return function() {
              console.log("Unsubscribe called!!!");
            };
          });
      
          let counter = 2;
          let intervalId = setInterval(() => {
            counter++;
            this.subscr.next(this.featuredArray);
          }, 1000);
      
          setTimeout(() => {
            clearInterval(intervalId);
          }, 15000);
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    onFeaturedEvent = result => {
        if (!result.error) {
          console.log("Value: " + JSON.stringify(result.value));
          var item = result.value;
          this.zone.run(() => {
            this.featuredArray.forEach((element, index) => {
              console.log(result.key + "=" + element.key);
              if (element.key == result.key) {
                this.featuredArray.splice(index, 1);
              }
            });
            this.featuredArray.unshift(
              new Feautured(
                item.name,
                item.type,
                item.description,
                item.image,
                item.discount,
                item.code,
                item.dateStart,
                item.dateEnd,
                item.minPurchase,
                result.key
              )
            );
          });
        } else {
          console.log("result:" + result.error);
        }
      };
}
