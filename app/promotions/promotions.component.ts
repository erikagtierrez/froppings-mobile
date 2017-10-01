import {
  Component,
  OnInit,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  DrawerTransitionBase,
  SlideInOnTopTransition
} from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");
import { Router } from "@angular/router";
import { Observable as RxObservable } from "rxjs/Observable";
var nativescriptGradient = require("nativescript-gradient")

export class Promotion {
  constructor(
    public name: string,
    public type: string,
    public discount: number,
    public code: string,
    public dateStart: string,
    public dateEnd: string,
    public minPurchase: number,
    public key: string
  ) {}
}

@Component({
  selector: "app-promotions",
  moduleId: module.id,
  templateUrl: "./promotions.component.html"
})
export class PromotionsComponent implements OnInit {
  @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  public promotions: RxObservable<Array<Promotion>>;
  public promotionsArray = [];
  public subscr;

  constructor(private router: Router, private zone: NgZone) {
    //initializeOnAngular();
  }

  ngOnInit(): void {
    console.log("PROM" + this.promotionsArray);
    this._sideDrawerTransition = new SlideInOnTopTransition();
    firebase.query(this.onPromotionsEvent, "/promotions", {
      singleEvent: false,
      orderBy: {
        type: firebase.QueryOrderByType.VALUE
      }
    });
    this.promotions = RxObservable.create(subscriber => {
      this.subscr = subscriber;
      subscriber.next(this.promotionsArray);
      return function() {
        console.log("Unsubscribe called!!!");
      };
    });

    let counter = 2;
    let intervalId = setInterval(() => {
      counter++;
      this.subscr.next(this.promotionsArray);
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

  onPromotionsEvent = result => {
    if (!result.error) {
      console.log("Value: " + JSON.stringify(result.value));
      var item = result.value;
      this.zone.run(() => {
        this.promotionsArray.forEach((element, index) => {
          console.log(result.key + "=" + element.key);
          if (element.key == result.key) {
            this.promotionsArray.splice(index, 1);
          }
        });
        this.promotionsArray.unshift(
          new Promotion(
            item.name,
            item.type,
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
