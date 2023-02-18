import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { DEFAULT_STEP_TIME, Sort } from '../constants';
import { interval, BehaviorSubject, from, take, zip, filter, Observable} from 'rxjs'
import {MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 2000,
  hideDelay: 0,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-sort-view',
  templateUrl: './sort-view.component.html',
  styleUrls: ['./sort-view.component.css'],
  providers: [{provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults}],
})
export class SortViewComponent {
  array = this.sortService.randomArray(20, 20, -20);
  currentArray: number[] = this.array;
  classList: string[] = [];
  stepTime: number = DEFAULT_STEP_TIME;
  // sort: Sort = Sort.selection;
  sort: Sort = Sort.insertion;
  sorter = this.sortService.getSorter(this.sort, this.array);
  isOn$ = new BehaviorSubject(false);
  ctrlSubscription = this.newCtrlSubscription();

  constructor (public sortService: SortService, public classService: ClassService) {
    this.advanceState();
  }
 
  play() { 
    this.isOn$.next(true); 
    this.changeSpeed(this.stepTime / 2);
  }

  pause() { this.isOn$.next(false); }

  newCtrlSubscription() {
    return interval(this.stepTime).pipe(
      filter(_ => this.isOn$.value === true)
    ).subscribe(_ => this.advanceState());
  }

  restart() {
    this.pause();
    this.ctrlSubscription.unsubscribe();
    this.ctrlSubscription = this.newCtrlSubscription();
    this.sorter = this.sortService.getSorter(this.sort, this.array);
    this.advanceState();
  }

  changeSpeed(stepTime: number) {
    this.stepTime = stepTime;
    this.ctrlSubscription.unsubscribe();
    this.ctrlSubscription = this.newCtrlSubscription();
  }

  onShuffleClick() {
    this.array = this.sortService.shuffleArray(this.array);
    this.restart();
  }

  advanceState() {
    const genState = this.sorter.next();
    if (!genState.done) {
      const state = genState.value;
      this.currentArray = state.arr;
      this.classList = this.classService.getClass(this.sort, state);
    }
  }

}
