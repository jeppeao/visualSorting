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
    const counts = {swaps: 0, comparisons: 0};
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
        counts.comparisons += 1;
        yield {arr: [...arr], i, j, low, swap: false, counts}
      }
      swapped = low !== i ? true : false;
      if (swapped) {
        [arr[i], arr[low]] = [arr[low], arr[i]];
        counts.swaps +=1;
        yield {arr: [...arr], i, j, low, swap: swapped, counts}; 
      }
    }
  }

  *insertionSortGen(array: number[]) {
    const arr = [...array];
    const counts = {swaps: 0, comparisons: 0};
    for (let i=1; i<arr.length; i++) {
      let j = i;
      yield {arr: [...arr], i, j, swap: false, counts};
      for (j=i-1; j>-1 && arr[j+1] < arr[j]; j--) {
        yield {arr: [...arr], i, j, swap: false, counts};
        [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
        counts.comparisons += 1;
        counts.swaps += 1;
        yield {arr: [...arr], i, j, swap: true, counts};
      }
      counts.comparisons += 1;
    }
    yield {arr: [...arr], i:arr.length, j:arr.length, swap: false, counts};
  }
  
  *bubbleSortGen(array: number[]) {
    const arr = [...array];
    const counts = {swaps: 0, comparisons: 0};
    let lastUnsorted = arr.length-1;
    while (lastUnsorted > 0) {
      let j = -1; // index of last swap
      let i;
      for (i=1; i<=lastUnsorted; i++) {
        yield {arr: [...arr], i, j, lastUnsorted, swap: false, counts};
        counts.comparisons +=1
        if (arr[i-1] > arr[i]) {
          [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
          counts.swaps +=1;
          j = i;
          yield {arr: [...arr], i, j, lastUnsorted, swap: true, counts};
        }
      }
      lastUnsorted = j - 1;
    }
    yield {arr: [...arr], i:-1, j:-1, lastUnsorted, swap: false, counts}
  }


  getSorter(type: Sort, array: number[]) {
    switch(type) {
      case Sort.selection:
        return this.selectionSortGen(array);
      case Sort.insertion:
        return this.insertionSortGen(array);
      case Sort.bubble:
        return this.bubbleSortGen(array);
    }
  }

}
