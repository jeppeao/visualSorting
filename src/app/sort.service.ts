import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() { }

  *selectionSortGen(arr: number[]) {
    const narr = [...arr];
    let i = 0;
    let j = 0;
    let changed;
    let low = 0;
    for (i=0; i<narr.length; i++) {
      low = i;
      for (j=i; j<narr.length; j++) {
         if (narr[j] < narr[low]) {
          low = j;
        }
        yield {arr: [...narr], highlights: [i, j, low], changed: false}
      }
      changed = low !== i ? true : false;
      if (changed) {
        [narr[i], narr[low]] = [narr[low], narr[i]];
      }
      yield {arr: [...narr], highlights: [i, j, low], changed: changed}; 
    }
    yield {arr: [...narr], highlights: [i+1, j, low], changed: false};
  }

}
