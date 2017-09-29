import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from "@angular/core";
import {
  DrawerTransitionBase,
  SlideInOnTopTransition
} from "nativescript-telerik-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-telerik-ui/sidedrawer/angular";
import { Router } from "@angular/router";
import firebase = require("nativescript-plugin-firebase");
import * as elementRegistryModule from "nativescript-angular/element-registry";
import { Observable as RxObservable } from 'rxjs/Observable';
import {initializeOnAngular} from "nativescript-web-image-cache";

export class Product {
    constructor(
        public name: string,
        public description: string,
        public price:number,
        public points:number,
        public image:string
    ){
        
    }
}

@Component({
  selector: "app-products",
  moduleId: module.id,
  templateUrl: "./products.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ProductsComponent implements OnInit {
  @ViewChild("drawer") drawerComponent: RadSideDrawerComponent;
  private _sideDrawerTransition: DrawerTransitionBase;
  public products:RxObservable<Array<Product>>;
  public productsArray=[];
  public subscr;

  constructor(private router: Router) {
    initializeOnAngular();
  }

  ngOnInit(): void {
    this._sideDrawerTransition = new SlideInOnTopTransition();
    firebase.query(this.onProductsEvent, "/products", {
      singleEvent: false,
      orderBy: {
        type: firebase.QueryOrderByType.PRIORITY
      }
    });
    this.products = RxObservable.create(subscriber => {
        this.subscr = subscriber;
        subscriber.next(this.productsArray);
        return function () {
            console.log("Unsubscribe called!!!");
        }
    });

    let counter = 2;
    let intervalId = setInterval(() => {
        counter++;
        this.subscr.next(this.productsArray);
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

  onProductsEvent = (result) =>{
    if (!result.error) {
      console.log("Value: " + JSON.stringify(result.value));
      var item = result.value;
      this.productsArray.push(
          new Product(item.name, item.description, item.price, item.points, item.image)
        );
      this.subscr.next(this.productsArray);
    }
  };
}
