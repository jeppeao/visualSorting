import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { SelectionSortStatus, DEFAULT_STEP_TIME, Sort } from '../constants';
import { zip, interval } from 'rxjs'

@Component({
  selector: 'app-sort-view',
  templateUrl: './sort-view.component.html',
  styleUrls: ['./sort-view.component.css']
})
export class SortViewComponent {
  array = this.sortService.randomArray(40, 20, -20);
  arr: number[] = [];
  classList: string[] = [];
  stepTime: number = DEFAULT_STEP_TIME;
  sort: Sort = Sort.selection;

  constructor (public sortService: SortService, public classService: ClassService) {
    
    const sort$ = sortService.getSort$(this.sort, this.array);
    const cur$ = zip(sort$, interval(this.stepTime), (a, b) => a);
    cur$.subscribe(state => {this.handleSortState(state)});
    
  }
 
  handleSortState(state: {arr: number[]}) {
    this.arr = state.arr;
    this.classList = this.classService.getClass(this.sort, state);
  }


}
