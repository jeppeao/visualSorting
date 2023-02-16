import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { from, zip, interval} from 'rxjs'
import { ClassService } from '../class.service';
import { SelectionSortStatus, DEFAULT_STEP_TIME } from '../constants';


@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {
  arr = [3, 4, 5, 2, 1, 8, 12, 15, 14, 12, 11, 4, 7, 9];
  sortState: SelectionSortStatus = {} as SelectionSortStatus;
  classList: string[] = [];
  stepTime: number = DEFAULT_STEP_TIME;

  constructor (public sortService: SortService, public classService: ClassService) {
    this.arr = this.randomArray(40, 20, -20);
    const selectionSort = sortService.selectionSortGen(this.arr);
    
    const obs$ = zip(
      from(selectionSort),
      interval(this.stepTime),
      (a, b) => a
    ).subscribe(state => {
      this.sortState = state;
      this.classList = classService.getSelectionSortClassList(state);
    });
    
  }

  randomArray(length: number, hi: number, lo: number) {
    return [...Array(length)]
     .map(() => Math.floor(Math.random()* (hi + 1 - lo)) + lo);
  }
}
