import { Injectable } from '@angular/core';
import { 
  SelectionSortStatus,
  InsertionSortStatus,
  BubbleSortStatus,
  ArrayClass,
  Sort,
  HeapSortStatus,
  PermutationSortStatus,
  QuickSortStatus,
  MergeSortStatus,
  MiracleSortStatus,
  CycleSortStatus,
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
      case (Sort.quick):
        return this.getQuickSortClassList(status as QuickSortStatus);
      case (Sort.merge):
        return this.getMergeSortClassList(status as MergeSortStatus);
      case (Sort.miracle):
        return this.getMiracleSortClassList(status as MiracleSortStatus);
      case (Sort.cycle):
        return this.getCycleSortClassList(status as CycleSortStatus);
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
      if (status.done === true) {
        clist.push(ArrayClass.sorted);
        return clist.join(' ');
      }
      else {
        clist.push(ArrayClass.unsorted);
      }

      console.log(idx, status.i, idx >= status.i -1)
      if (idx >= status.i - 1) {
        clist.push(ArrayClass.mark2);
      }

      return clist.join(' ');
    });
  }

  getQuickSortClassList(status: QuickSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
      if (status.done === true) {
        clist.push(ArrayClass.sorted);
        return clist.join(' ');
      }
      if (status.i === idx || status.j === idx) {
        clist.push(ArrayClass.current)
      }
      if (status.pId === idx) {
        clist.push(ArrayClass.marked)
      }
      else {
        clist.push(ArrayClass.unsorted)
      }
      if (idx < status.start || idx > status.end) {
        clist.push(ArrayClass.dim)
      }
      return clist.join(' ');
    });
  }

  getMergeSortClassList(status: MergeSortStatus): string[] {
    const mLen = Math.ceil(status.arr.length/2);
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
    
      if (status.done === true) {
        clist.push(ArrayClass.sorted);
        return clist.join(' ');
      }
      
      // hide non-used parts of merge array
      if (status.merging && idx >= status.mi && idx < mLen) {
        return clist.join(' ');
      }
      if (status.merging && (idx < status.s1+mLen || idx > status.e2+mLen)) {
        if (idx >= mLen) {
          clist.push(ArrayClass.dim);
        }
      }
      else if (status.merged === true) {
        clist.push(ArrayClass.swapped);
        clist.push(ArrayClass.sorted);
        return clist.join(' ');
      }
      if ((idx === status.i + mLen && idx <= status.e1 + mLen) ||
        (idx === status.j + mLen && idx <= status.e2 + mLen)) {
        clist.push(ArrayClass.current);
      }

      if (status.merging && !status.merged &&
        idx >= status.s1 + mLen && idx <= status.e1 + mLen) {
        clist.push(ArrayClass.marked)
      }
      else if (status.merging && !status.merged && 
        idx >= status.s2 + mLen && idx <= status.e2 + mLen) {
        clist.push(ArrayClass.mark2)
      }
      else {
        clist.push(ArrayClass.unsorted)
      }
      return clist.join(' ');
    });
  }

  getMiracleSortClassList(status: MiracleSortStatus): string[] {
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];
      if (status.info.sorted === 'true') {
        clist.push(ArrayClass.sorted);
      }
      else {
        clist.push(ArrayClass.unsorted);
      }
      return clist.join(' ');
    });
  }

  getCycleSortClassList(status: CycleSortStatus): string[] {
    const pre = 2;
    return status.arr.map((_, idx) => {
      const clist = [ArrayClass.value];

      if (idx === 1) {
        return ArrayClass.value
      }
      if (status.done === true && idx === 0) {
        return ArrayClass.value;
      }
      if (status.done === true) {
        return ArrayClass.sorted;
      }
      if (status.pos === idx - pre) {
        clist.push(ArrayClass.marked)
      }
      else if (status.sorted.includes(idx - pre)) {
        clist.push(ArrayClass.sorted)
      }
      else {
        clist.push(ArrayClass.unsorted);
      }
      if (status.j === idx - pre) {
        clist.push(ArrayClass.current)
      }
      else if (idx === 0) {
        clist.push(ArrayClass.dim)
      }

      return clist.join(' ');
    });
  }
}
