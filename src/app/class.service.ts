import { Injectable } from '@angular/core';
import { 
  SelectionSortStatus,
  InsertionSortStatus,
  BubbleSortStatus,
  ArrayClass,
  Sort,
  HeapSortStatus,
  PermutationSortStatus
 } from './constants';


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
      case (Sort.bubble): 
        return this.getBubbleSortClassList(status as BubbleSortStatus);
      case (Sort.heap): 
        return this.getHeapSortClassList(status as HeapSortStatus);
      case (Sort.permutation):
        return this.getPermutationSortClassList(status as PermutationSortStatus);
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
      return clist.join(' ');
    });
  }

    getBubbleSortClassList(status: BubbleSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
       
      if ([status.i, status.i-1].includes(idx) ){
        clist.push(ArrayClass.current);
        clist.push(ArrayClass.unsorted);
        if (status.swap === true) {
          clist.push(ArrayClass.marked)
        }
      }
      else if (idx > status.lastUnsorted) {
        clist.push(ArrayClass.sorted);
      }
      else {
        clist.push(ArrayClass.unsorted);
      }
      return clist.join(' ');
    });
  }

  getHeapSortClassList(status: HeapSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
      
      if (status.heap === false && status.last === idx) {
        clist.push(ArrayClass.current);
      }
      else if (status.heap === true && status.swap === true && status.j === idx) {
        clist.push(ArrayClass.current);
      }
      else if (status.heap === true && status.swap === false && status.i === idx) {
        clist.push(ArrayClass.current);
      }

      if (status.swap === true && [status.j, status.i].includes(idx)) {
        if (status.j !== status.i) clist.push(ArrayClass.marked);
      }
      if (status.swap === false && [status.j].includes(idx)) {
        clist.push(ArrayClass.marked);
      }

      if (status.heap === true && status.last < idx) {
        clist.push(ArrayClass.sorted);
      }
      else {
        clist.push(ArrayClass.unsorted)
      }
      return clist.join(' ');
    });
  }

  getPermutationSortClassList(status: PermutationSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
      
      if (status.done === false) {
        clist.push(ArrayClass.unsorted);
      }

      if (status.done === false && [status.i-1, status.j].includes(idx)) {
        clist.push(ArrayClass.marked);
      }

      if (status.done === true) {
        clist.push(ArrayClass.sorted);
      }

      return clist.join(' ');
    });
  }
}
