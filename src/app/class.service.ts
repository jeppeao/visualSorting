import { Injectable } from '@angular/core';
import { SelectionSortStatus, InsertionSortStatus } from './constants'
import { ArrayClass, Sort } from './constants';


@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor() { }

  getClass(type: Sort, status: {} = {}) {
    switch(type) {
      case (Sort.selection):
        return this.getSelectionSortClassList(status as SelectionSortStatus);
      
      case (Sort.insertion):
        return this.getInsertionSortClassList(status as InsertionSortStatus);

    }
  }

  getSelectionSortClassList(sortStatus: SelectionSortStatus): string[] {
    return sortStatus.arr.map((_, idx) => {
      const clist =[ArrayClass.value];
      // if already sorted
      if (
        idx < sortStatus.i || 
        sortStatus.arr.length-1 === sortStatus.i ||
        (idx === sortStatus.i && sortStatus.swap === true)
      ) {
        clist.push(ArrayClass.sorted);
      }
      // if lowest value found
      else if (sortStatus.low === idx && sortStatus.swap === false) {
        clist.push(ArrayClass.marked)
      }
      else {
        clist.push(ArrayClass.unsorted);
      }

      // if current
      if (idx === sortStatus.j && !clist.includes(ArrayClass.sorted)) {
        clist.push(ArrayClass.current);
      }

      // if swapped
      if (
        sortStatus.swap === true &&
        [sortStatus.i, sortStatus.low].includes(idx)
      ) {
        clist.push(ArrayClass.swapped);
      }
      return clist.join(' ');
    });
  }

  getInsertionSortClassList(status: InsertionSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist =[ArrayClass.value];

      if (idx === status.j) {
        clist.push(ArrayClass.current);
      }
      if (idx === status.j && status.swap === true) {
        clist.push(ArrayClass.marked);
      }
      else if (idx === status.j && idx === status.i) {
        clist.push(ArrayClass.marked);      
      }
      else if (idx === status.j+1 && idx <= status.i && status.swap === false) {
        clist.push(ArrayClass.marked);
      }
      else if (idx <= status.i) {
        clist.push(ArrayClass.sorted);
      }
      else {
        clist.push(ArrayClass.unsorted)
      }
      // if (status.swap === true && [status.j, status.j+1].includes(idx)) {
      //   clist.push(ArrayClass.swapped);
      // }
      return clist.join(' ');
    });
  }
}
