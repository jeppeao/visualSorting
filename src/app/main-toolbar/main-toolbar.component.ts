import { Component, Input } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { DEFAULT_STEP_TIME, DEFAULT_ARRAY_PARAMETERS } from '../constants';

export const tooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 1000,
  hideDelay: 0,
  touchendHideDelay: 500,
};

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

@Component({
  selector: 'app-main-toolbar',
  templateUrl: './main-toolbar.component.html',
  styleUrls: ['./main-toolbar.component.css'],
  providers: [{
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: tooltipDefaults
  }],
})
export class MainToolbarComponent {

  @Input() arrayParameters = DEFAULT_ARRAY_PARAMETERS;
  @Input() onPlay!: () => void; 
  @Input() onPause!: () => void; 
  @Input() onResetAll!: () => void;
  @Input() onReset!: () => void;
  @Input() onSetSpeed!: (speed: string) => void;
  @Input() onDelete!: () => void;
  @Input() onNewSortWindow!: () => void;
  @Input() onArrayEdit!: (len:number, max:number, min:number) => void;
  @Input() onSendToAll!: () => void;
  
  speed = DEFAULT_STEP_TIME;
  selectedSpeed = 'Standard';
  editMenuOpen = false;

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

  onEdit() {
    if (
      this.arrLength.valid &&
      this.arrMax.valid &&
      this.arrMin.valid &&
      this.arrLength.value !== null &&
      this.arrMax.value !== null &&
      this.arrMin.value !== null
    ) {
      this.onArrayEdit(
        +this.arrLength.value,
        +this.arrMax.value,
        +this.arrMin.value,
      )
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
}
