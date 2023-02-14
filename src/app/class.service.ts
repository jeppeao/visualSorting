import { Injectable } from '@angular/core';
import { SelectionSortStatus } from './constants'

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  constructor() { }

  getSelectionSortClassList(sortStatus: SelectionSortStatus): string[] {
    return sortStatus.arr.map((_, idx) => {
      const clist =['value'];
      // if already sorted
      if (
        idx < sortStatus.i || 
        sortStatus.arr.length-1 === sortStatus.i ||
        (idx === sortStatus.i && sortStatus.swap === true)
      ) {
        clist.push('sorted');
      }
      // if lowest value found
      else if (sortStatus.low === idx && sortStatus.swap === false) {
        clist.push('marked')
      }
      else {
        clist.push('unsorted');
      }

      // if current
      if (idx === sortStatus.j && !clist.includes('sorted')) {
        clist.push('current');
      }

      // if swapped
      if (
        sortStatus.swap === true &&
        [sortStatus.i, sortStatus.low].includes(idx)
      ) {
        clist.push('swapped');
      }
      return clist.join(' ');
    });
  }
}
