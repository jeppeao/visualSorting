import { Component, OnInit, ViewChild, ComponentRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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
  sortViewComponents: ComponentRef<SortViewComponent>[] = [];
  isOn$ = new BehaviorSubject(false);
  defaultSpeed = 'Standard';
  selectedSpeed = 200;

  ngOnInit() {
    this.loadComponent();
    this.loadComponent();
    setTimeout(()=> {
      this.deleteComponent(1);
      
    }, 1000)
  }

  loadComponent() {
    const viewContainerRef = this.sortHost.viewContainerRef;
    const componentRef = viewContainerRef.createComponent(SortViewComponent);
    componentRef.instance.globalIsOn$ = this.isOn$;
    this.sortViewComponents.push(componentRef);
    // (componentRef.location.nativeElement as HTMLElement).style.width = '500px';

  }

  deleteComponent(index: number) {
    const delId = this.sortHost.viewContainerRef.indexOf(
      this.sortViewComponents[index].hostView);
    this.sortHost.viewContainerRef.remove(delId);
  }
  
  play() {
    this.isOn$.next(true);
  }
  pause() {
    this.isOn$.next(false);
  }

  onSpeedSelection(sel: String) {
    // this.selectedSpeed = speed;
  }
}

