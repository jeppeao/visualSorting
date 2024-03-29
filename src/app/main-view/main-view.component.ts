import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SortHostDirective } from '../sort-host.directive'; 
import { SortViewComponent } from '../sort-view/sort-view.component';
import { SortService } from '../sort.service';
import { DEFAULT_ARRAY_PARAMETERS } from '../constants';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
})
export class MainViewComponent implements OnInit {

  @ViewChild(SortHostDirective, {static: true}) sortHost!: SortHostDirective;
  arrayParameters = DEFAULT_ARRAY_PARAMETERS;
  defaultSpeed = 'Standard';
  curArray = this.newArray();
  isOn$ = new BehaviorSubject(false);
  reset$: Subject<void> = new Subject<void>();
  windowAddDelete$: Subject<void> = new Subject<void>();
  speed$: Subject<number> = new Subject<number>();
  array$: Subject<number[]> = new Subject<number[]>();

  constructor(private sortService: SortService) {}

  ngOnInit() {
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.sortHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(SortViewComponent);
    componentRef.instance.globalIsOn$ = this.isOn$;
    componentRef.instance.globalReset$ = this.reset$;
    componentRef.instance.globalSpeed$ = this.speed$;
    componentRef.instance.globalArray$ = this.array$;
    componentRef.instance.initArray = this.curArray;
    componentRef.instance.windowAddDelete$ = this.windowAddDelete$;
    componentRef.instance.destroySelf = () => {
      setTimeout(() => this.windowAddDelete$.next(), 10);
      componentRef.destroy();
     
    }
    this.windowAddDelete$.next();
    return componentRef;
    // (componentRef.location.nativeElement as HTMLElement).style.width = '500px';
  }

  emitPlay = () => {
    this.isOn$.next(true);
  }

  emitPause = () => {
    this.isOn$.next(false);
  }

  emitDelete = () => {
    this.sortHost.viewContainerRef.clear();
  }

  emitReset = () => {
    this.reset$.next();
  }

  emitSpeed = (speed: string) => {
    this.speed$.next(this.speedToMs(speed));
  }

  emitArray = () => {
    this.array$.next(this.curArray);
  }

  editArray = (
    len: number,
    max: number,
    min: number
  ) =>  {
    this.updateArrayParameters(len, max, min);
    this.curArray = this.newArray();
  }

  updateArray = (val: number, idx: number) => {
    this.curArray.splice(idx, 1, val);
    if (val > this.arrayParameters.max) {
      this.arrayParameters = {...this.arrayParameters, max: val};

    }
    else if (val < this.arrayParameters.min) {
      this.arrayParameters = {...this.arrayParameters, min: val};
    }
    this.curArray = [...this.curArray]

  }

  newSortWindow = () => {
    const comp = this.loadComponent();
  }

  updateArrayParameters (len: number, max: number, min: number) {
    this.arrayParameters.length = len;
    this.arrayParameters.max = max;
    this.arrayParameters.min = min;
  }

  newArray() {
    return this.sortService.randomArray(
      this.arrayParameters.length,
      this.arrayParameters.max,
      this.arrayParameters.min,
    );
  }

  onNew = () => {
    this.curArray = this.newArray();
  }

  speedToMs(speed: string) {
    switch(speed) {
      case 'Slower':
        return 2000;
      case 'Slow':
        return 1000;
      case 'Fast':
        return 100;
      case 'Faster':
        return 25;
      case 'Fastest':
        return 1;
      default:
        return 500;
    }
  }
}

