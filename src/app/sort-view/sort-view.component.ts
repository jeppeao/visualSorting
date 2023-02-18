import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { DEFAULT_STEP_TIME, Sort } from '../constants';
import { interval, BehaviorSubject, Subject, EMPTY } from 'rxjs'

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
  sorter = this.sortService.getSorter(this.sort, this.array);
  cur$ = interval(this.stepTime);
  isOn$ = new BehaviorSubject(false);
 

  constructor (public sortService: SortService, public classService: ClassService) {
 


  }
 
  handleSortState(state: {arr: number[]}) {
    this.arr = state.arr;
    this.classList = this.classService.getClass(this.sort, state);
  }


  log() {
    this.cur$.subscribe(_ => {

    let sorterStatus = this.sorter.next();
    if (!sorterStatus.done) {
      const status = sorterStatus.value;
      this.arr = status.arr;
      this.classList = this.classService.getClass(this.sort, status);
    }
    
    });
  }

  unlog() {
    this.isOn$.next(false);
  }
}
