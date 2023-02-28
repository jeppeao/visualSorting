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
export class MainViewComponent implements OnInit{

  @ViewChild(SortHostDirective, {static: true}) sortHost!: SortHostDirective;
  arrayParameters = DEFAULT_ARRAY_PARAMETERS;
  defaultSpeed = 'Standard';
  curArray = this.newArray();
  isOn$ = new BehaviorSubject(false);
  reset$: Subject<void> = new Subject<void>();
  speed$: Subject<number> = new Subject<number>();
  array$: Subject<number[]> = new Subject<number[]>();

  constructor(private sortService: SortService) {}

  ngOnInit() {
    this.loadComponent();
    this.loadComponent();
  }

  loadComponent() {
    const viewContainerRef = this.sortHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(SortViewComponent);
    componentRef.instance.globalIsOn$ = this.isOn$;
    componentRef.instance.globalReset$ = this.reset$;
    componentRef.instance.globalSpeed$ = this.speed$;
    componentRef.instance.globalArray$ = this.array$;
    componentRef.instance.destroySelf = () => componentRef.destroy();
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

  emitNewArray = () => {
    this.curArray = this.newArray();
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

