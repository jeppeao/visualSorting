import { Injectable } from '@angular/core';
import { ClassService } from './class.service';
import { SortService } from './sort.service';
import { SortStatus } from './constants';
import { SorterStatus } from './constants';
import { Sort } from './constants';

@Injectable()
export class SorterService {

  initialArray: number[] = this.sortService.randomArray(6, 15, -15);
  sortType: Sort = {} as Sort;
  sorter: Generator = {} as Generator;
  SorterStatus = {} as SorterStatus;  

  constructor(private sortService: SortService, private classService: ClassService) { }

  defineSorter(sortType: Sort, array: number[] = this.initialArray) {
    this.sorter = this.sortService.getSorter(sortType, this.initialArray);
    this.initialArray = [...array];
    this.sortType = sortType;
  }
  
  getNext() {
    const genState = this.sorter.next();
    if (!genState.done) {
      const state = genState.value as SortStatus;
      const arr = state.arr;
      const classList = this.classService.getClass(this.sortType, state);
      const info = this.processSortStatusInfo(state.info);
      this.SorterStatus = {arr, classList, info, done: false}
    }
    else {
    this.SorterStatus = {...this.SorterStatus, done: true}
    }
    return this.SorterStatus;
  }

  processSortStatusInfo(info:{[key: string]: string}) {
    const msgs = [];
    for (let label of Object.keys(info)) {
      msgs.push({label, content: info[label]})
    }
    return msgs;
  }

  setSortType(sortType: Sort) {
    this.sortType = sortType;
    this.sorter = this.sortService.getSorter(sortType, this.initialArray);
  }

  restart() {
    this.sorter = this.sortService.getSorter(this.sortType, this.initialArray);
  }

  shuffle() {
    this.initialArray = this.sortService.shuffleArray(this.initialArray);
  }
}
