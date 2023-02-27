import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { SortHostDirective } from '../sort-host.directive'; 
import { SortViewComponent } from '../sort-view/sort-view.component';
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { FormControl, Validators } from '@angular/forms';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SortService } from '../sort.service';
import { DEFAULT_ARRAY_PARAMETERS } from '../constants';

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

export const tooltipDefaults: MatTooltipDefaultOptions = {
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
    useValue: tooltipDefaults
  }],
})
export class MainViewComponent implements OnInit{

  @ViewChild(SortHostDirective, {static: true}) sortHost!: SortHostDirective;
  arrayParameters = DEFAULT_ARRAY_PARAMETERS;
  curArray = this.newArray();
  editMenuOpen = false;
  defaultSpeed = 'Standard';
  isOn$ = new BehaviorSubject(false);
  reset$: Subject<void> = new Subject<void>();
  speed$: Subject<number> = new Subject<number>();
  array$: Subject<number[]> = new Subject<number[]>();

  arrLength = new FormControl(
    this.arrayParameters.length,
    [
      Validators.required,
      Validators.min(2),
      Validators.max(100),
      integer()
    ]
  );
  arrMin = new FormControl(
    this.arrayParameters.min,
    [Validators.required, integer()]
  );
  arrMax = new FormControl (
    this.arrayParameters.max,
    [Validators.required, integer()]
  );

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

  play() {
    this.isOn$.next(true);
  }

  pause() {
    this.isOn$.next(false);
  }

  onDeleteAll() {
    this.sortHost.viewContainerRef.clear();
  }

  onEdit() {
    this.updateArrayParameters();
    this.curArray = this.newArray();
  }

  onSendAll() {
    this.curArray = this.newArray();
    this.emitGlobalArray();
  }

  emitGlobalReset() {
    this.reset$.next();
  }

  emitGlobalSpeed(speed: string) {
    this.speed$.next(this.speedToMs(speed));
  }

  emitGlobalArray() {
    this.array$.next(this.curArray);
  }

  onNewArrayClick() {
    const comp = this.loadComponent();
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

  getEditFormErrorMSg(ctrl: FormControl) {
      if (ctrl.hasError('integer')) {
        return 'Must be an integer'
      }
      if (ctrl.hasError('required')) {
        return 'Required'
      }
      if (ctrl.hasError('min')) {
        return 'Too small'
      }
      if (ctrl.hasError('max')) {
        return 'Too large'
      }
      return 'Unknown error'
    }

  newArray() {
    return this.sortService.randomArray(
      this.arrayParameters.length,
      this.arrayParameters.max,
      this.arrayParameters.min,
    );
  }

  updateArrayParameters() {
    if (
      this.arrLength.valid &&
      this.arrMax.valid &&
      this.arrMin.valid &&
      this.arrLength.value !== null &&
      this.arrMax.value !== null &&
      this.arrMin.value !== null
    ) {
      this.arrayParameters.length = +this.arrLength.value;
      this.arrayParameters.max = +this.arrMax.value;
      this.arrayParameters.min = +this.arrMin.value;
    }
  }
}

