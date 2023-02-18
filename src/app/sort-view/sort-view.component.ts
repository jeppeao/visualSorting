import { Component } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { DEFAULT_STEP_TIME, Sort } from '../constants';
import { interval, BehaviorSubject, from, take, zip, filter, Observable } from 'rxjs'

@Component({
  selector: 'app-sort-view',
  templateUrl: './sort-view.component.html',
  styleUrls: ['./sort-view.component.css']
})
export class SortViewComponent {
  array = this.sortService.randomArray(40, 20, -20);
  currentArray: number[] = this.array;
  classList: string[] = [];
  stepTime: number = DEFAULT_STEP_TIME;
  sort: Sort = Sort.selection;
  sorter = this.sortService.getSorter(this.sort);
  cur$ = this.initCur$();
  isOn$ = new BehaviorSubject(false);

  constructor (public sortService: SortService, public classService: ClassService) {
    this.loadInitialState();
  }
 
  handleSortState(state: {arr: number[]}) {
    this.currentArray = state.arr;
    this.classList = this.classService.getClass(this.sort, state);
  }

  play() {
    this.isOn$.next(true);
  };
      
  pause() {
    this.isOn$.next(false);
  }

  loadInitialState() {
    from(this.sorter(this.currentArray)).pipe(take(1)).subscribe(s => {
      this.handleSortState(s);
    });
  }
  
  initCur$() {
    const ctrl = interval(this.stepTime).pipe(
      filter(go => this.isOn$.value === true)
    );
  
    return zip(ctrl, this.sorter(this.array)).subscribe(s => {
      this.handleSortState(s[1]); 
    });
  }

}
