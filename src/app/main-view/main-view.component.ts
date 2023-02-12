import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { from, zip, map, interval, timer, take, mergeMap, delayWhen, Observable, concatMap, delay, of } from 'rxjs'

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {
  arr = [3, 4, 5, 2, 1, 8, 12, 15, 14, 12, 11, 4, 7, 9];
  sortState: {arr: number[], highlights: number[], changed: boolean} =
   {arr: [], highlights: [], changed: false};

  constructor (public sortService: SortService) {
    this.arr = this.randomArray(30, 30, 0);
    const selectionSort = sortService.selectionSortGen(this.arr);

    const obs$ = zip(
      from(selectionSort),
      interval(50),
      (a, b) => a
    ).subscribe(state => this.sortState = state);
  }

  randomArray(length: number, hi: number, lo: number) {
    return [...Array(length)]
     .map(() => Math.floor(Math.random()* (hi - lo) + 1) + lo);
  }
}
