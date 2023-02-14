import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {
  
  constructor() { }

  *selectionSortGen(arrayInput: number[]) {
    const arr = [...arrayInput];
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

}
