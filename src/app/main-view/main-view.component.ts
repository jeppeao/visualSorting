import { Component, OnInit, ViewChild, ComponentRef, ElementRef } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { SortHostDirective } from '../sort-host.directive'; 
import { SortViewComponent } from '../sort-view/sort-view.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 0,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css'],
  providers: [{
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: myCustomTooltipDefaults
  }],
})
export class MainViewComponent implements OnInit{

  @ViewChild(SortHostDirective, {static: true}) sortHost!: SortHostDirective;
  @ViewChild('reset') reset: ElementRef = {} as ElementRef;
  isOn$ = new BehaviorSubject(false);
  reset$: Subject<void> = new Subject<void>();
  speed$: Subject<number> = new Subject<number>();
  
  defaultSpeed = 'Standard';

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
    componentRef.instance.destroySelf = () => componentRef.destroy();
    // (componentRef.location.nativeElement as HTMLElement).style.width = '500px';

  }

  play() {
    this.isOn$.next(true);
  }

  pause() {
    this.isOn$.next(false);
  }

  onDeleteAll() {
    this.sortHost.viewContainerRef.clear();
  }

  emitGlobalReset() {
    this.reset$.next();
  }

  emitGlobalSpeed(speed: string) {
    this.speed$.next(this.speedToMs(speed));
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

