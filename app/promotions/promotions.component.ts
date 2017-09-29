import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import firebase = require("nativescript-plugin-firebase");
import * as elementRegistryModule from "nativescript-angular/element-registry";
import { Observable as RxObservable } from 'rxjs/Observable';
import {initializeOnAngular} from "nativescript-web-image-cache";
import { registerElement } from "nativescript-angular";
registerElement("Gradient", () => require("nativescript-gradient").Gradient);

export class Promotion {
    constructor(
        public name: string,
        public type: string,
        public discount:number,
        public code:number,
        public discountType:string,
        public dateStart:string,
        public dateEnd:string
    ){
    }
}

@Component({
    selector: "Promotions",
    moduleId: module.id,
    templateUrl: "./promotions.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromotionsComponent implements OnInit {
    @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
    private _sideDrawerTransition: DrawerTransitionBase;
    public promotions:RxObservable<Array<Promotion>>;
    public promotionsArray=[];
    public subscr;

    constructor(){
        initializeOnAngular();
    }

    ngOnInit(): void {
        this._sideDrawerTransition = new SlideInOnTopTransition();
        firebase.query(this.onPromotionsEvent, "/promotions", {
            singleEvent: false,
            orderBy: {
              type: firebase.QueryOrderByType.PRIORITY
            }
          });
          this.promotions = RxObservable.create(subscriber => {
              this.subscr = subscriber;
              subscriber.next(this.promotionsArray);
              return function () {
                  console.log("Unsubscribe called!!!");
              }
          });
      
       /*    let counter = 2;
          let intervalId = setInterval(() => {
              counter++;
              this.subscr.next(this.promotionsArray);
          }, 1000);
      
          setTimeout(() => {
              clearInterval(intervalId);
          }, 15000); */
    }

    get sideDrawerTransition(): DrawerTransitionBase {
        return this._sideDrawerTransition;
    }

    onDrawerButtonTap(): void {
        this.drawerComponent.sideDrawer.showDrawer();
    }

    onPromotionsEvent = (result) =>{
        if (!result.error) {
        console.log("Value: " + JSON.stringify(result.value));
          console.log("Value: " + JSON.stringify(result.value));
          var item = result.value;
          this.promotionsArray.push(
              new Promotion(item.name,item.type,item.discount,item.code,item.discountType,item.dateStart, item.dateEnd)
            );
          this.subscr.next(this.promotionsArray);
        }
      };
}
