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
  providers: [{
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: myCustomTooltipDefaults
  }],
})
export class SortViewComponent {
  array = this.sortService.randomArray(20, 20, -20);
  currentArray: number[] = this.array;
  classList: string[] = [];
  stepTime: number = DEFAULT_STEP_TIME;
  sort = Sort.insertion;
  sortSelect = 'insertion';
  sorter = this.sortService.getSorter(this.sort, this.array);
  isOn$ = new BehaviorSubject(false);
  ctrlSubscription = this.newCtrlSubscription();
  touched = false;

  constructor (public sortService: SortService, public classService: ClassService) {
    this.advanceState();
  }
 
  play() { 
    this.isOn$.next(true); 
    this.touch();
  }

  pause() { this.isOn$.next(false); }
  slower() { this.changeSpeed(this.stepTime*2)}
  faster() { this.changeSpeed(this.stepTime/2)}
  touch() { this.touched=true}

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
    this.touched=false;
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

  onSortSelection() {
    switch(this.sortSelect) {
      case 'insertion':
        this.sort = Sort.insertion;
        break;
      case 'selection':
        this.sort = Sort.selection;
        break;
      case 'bubble':
        this.sort = Sort.bubble;
  
    }
    this.restart();
  }

  advanceState() {
    const genState = this.sorter.next();
    if (!genState.done) {
      const state = genState.value;
      this.currentArray = state.arr;
      this.classList = this.classService.getClass(this.sort, state);
    }
    else {
      this.pause();
    }
  }

}
