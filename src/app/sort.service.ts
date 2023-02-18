import { Injectable } from '@angular/core';
import { Sort } from './constants'

@Injectable({
  providedIn: 'root'
})
export class SortService {
  
  constructor() { }

  randomArray(length: number, hi: number, lo: number) {
    return [...Array(length)]
     .map(() => Math.floor(Math.random()* (hi + 1 - lo)) + lo);
  }

  shuffleArray(array: number[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]; 
    }
    return arr;
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

  *insertionSortGen(array: number[]) {
    const arr = [...array]
    for (let i=1; i<arr.length; i++) {
      let j = i;
      yield {arr: [...arr], i, j, swap: false};
      for (j=i-1; j>-1 && arr[j+1] < arr[j]; j--) {
        yield {arr: [...arr], i, j, swap: false};
        [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
        yield {arr: [...arr], i, j, swap: true};
      }
    }
    yield {arr: [...arr], i:arr.length, j:arr.length, swap: false};
  }

  
  getSorter(type: Sort) {
    switch(type) {
      case Sort.selection:
        return this.selectionSortGen;
     
      case Sort.insertion:
          return this.insertionSortGen;
    }
  }

}
