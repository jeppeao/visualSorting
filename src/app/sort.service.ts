import { Injectable } from '@angular/core';
import { Sort } from './constants'
import { SelectionSortStatus } from './constants';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  
  constructor() { }

  randomArray(length: number, hi: number, lo: number) {
    return [...Array(length)]
     .map(() => Math.floor(Math.random()* (hi + 1 - lo)) + lo);
  }

  *selectionSortGen(array: number[]) {
    const arr = [...array]
    let i = 0;
    let j = 0;
    let swapped;
    let low = 0;
    for (i=0; i<arr.length; i++) {
      low = i;
      for (j=i; j<arr.length; j++) {
         if (arr[j] < arr[low]) {
          low = j;
        }
        yield {arr: [...arr], i, j, low, swap: false}
      }
      swapped = low !== i ? true : false;
      if (swapped) {
        [arr[i], arr[low]] = [arr[low], arr[i]];
        yield {arr: [...arr], i, j, low, swap: swapped}; 
      }
    }
  }

  getSorter(type: Sort) {
    switch(type) {
      case Sort.selection:
        return this.selectionSortGen;
    }
  }

}
