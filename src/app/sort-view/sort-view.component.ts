import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { DEFAULT_STEP_TIME, Sort } from '../constants';
import { interval, BehaviorSubject, from, take, zip, filter} from 'rxjs'
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
  sorter = this.sortService.getSorter(this.sort);
  cur$ = this.setupCur$();
  isOn$ = new BehaviorSubject(false);

  constructor (public sortService: SortService, public classService: ClassService) {
    console.log([...this.sorter(this.array)])
    this.loadInitialState();
  }
 
  handleSortState(state: {arr: number[]}) {
    this.currentArray = state.arr;
    this.classList = this.classService.getClass(this.sort, state);
  }

  play() { this.isOn$.next(true); }

  pause() { this.isOn$.next(false); }

  loadInitialState() {
    from(this.sorter(this.array)).pipe(take(1)).subscribe(s => {
      this.handleSortState(s);
    });
  }
  
  setupCur$() {
    const ctrl$ = interval(this.stepTime).pipe(
      filter(go => this.isOn$.value === true)
    );
  
    return zip(ctrl$, this.sorter(this.array)).subscribe(s => {
      this.handleSortState(s[1]); 
    });
  }

  restart() {
    this.pause();
    this.cur$.unsubscribe();
    this.cur$ = this.setupCur$();
    this.loadInitialState();
  }

  onShuffleClick() {
    this.array = this.sortService.shuffleArray(this.array);
    this.restart();
  }

}
