import { Component, OnInit, ViewChild, ComponentRef, ElementRef } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { SortHostDirective } from '../sort-host.directive'; 
import { SortViewComponent } from '../sort-view/sort-view.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function integer(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const error: ValidationErrors = { integer: true };

    if (control.value && control.value != `${parseInt(control.value, 10)}`) {
      control.setErrors(error);
      return error;
    }

    control.setErrors(null);
    return null;
  };
}


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
  isOn$ = new BehaviorSubject(false);
  reset$: Subject<void> = new Subject<void>();
  speed$: Subject<number> = new Subject<number>();
  editMenuOpen = false;
  defaultSpeed = 'Standard';
  arrLength = new FormControl(
    10, [Validators.required, Validators.min(2), Validators.max(100), integer()]
  );
  arrMin = new FormControl(
    -10, [Validators.required, Validators.min(-100), Validators.max(100), integer()]
  );
  arrMax = new FormControl (
    10, [Validators.required, Validators.min(-100), Validators.max(100), integer()]
  );

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

  emitGlobalArray() {
  }

  onNewArrayClick() {
    this.loadComponent();
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

  getEditFormErrorMSg(field: string) {
    if (field === 'arrLength') {
      if (this.arrLength.hasError('integer')) {
        return 'Length must be an integer'
      }
      if (this.arrLength.hasError('required')) {
        return 'You must set an array length'
      }
      if (this.arrLength.hasError('min')) {
        return 'Array length must be greater than 0'
      }
      if (this.arrLength.hasError('max')) {
        return 'Please set array length below 100'
      }
    }
    else if (field === 'arrMin') {
      if (this.arrMin.hasError('integer')) {
        return 'Value must be an integer'
      }
      if (this.arrMin.hasError('required')) {
        return 'You must set a minimum value'
      }
      if (this.arrMin.hasError('min')) {
        return 'Please set a minimum value greater than -100'
      }
      if (this.arrMin.hasError('max')) {
        return 'Please set a maximum value below 100'
      }
    }
    else if (field === 'arrMax') {
      if (this.arrMax.hasError('integer')) {
        return 'Value must be an integer'
      }
      if (this.arrMax.hasError('required')) {
        return 'You must set a maximum value'
      }
      if (this.arrMax.hasError('min')) {
        return 'Please set a minimum value greater than -100'
      }
      if (this.arrMin.hasError('max')) {
        return 'Please set a maximum value below 100'
      }
    }
    return 'Unknown error'
  }
}

