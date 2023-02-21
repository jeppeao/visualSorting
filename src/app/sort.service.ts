import { Injectable } from '@angular/core';
import { Sort } from './constants'

@Injectable({
  providedIn: 'root'
})
export class SortService {
  
  constructor() {}

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
    yield {arr: [...arr], i, j, low, swap: false, counts}
    for (i=0; i<arr.length-1; i++) {
      low = i;
      for (j=i; j<arr.length; j++) {
         if (arr[j] < arr[low]) {
          low = j;
        }
        counts.comparisons = i===j ? counts.comparisons : counts.comparisons+1;
        yield {arr: [...arr], i, j, low, swap: false, counts}
      }
      swapped = low !== i ? true : false;
      if (swapped) {
        [arr[i], arr[low]] = [arr[low], arr[i]];
        counts.swaps +=1;
        yield {arr: [...arr], i, j, low, swap: swapped, counts}; 
      }
    }
    yield {arr: [...arr], i: i+1, j, low, swap: swapped, counts};
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
        counts.comparisons +=1;
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

  // Consider array as a binary tree max-heap
  // with node at index n having children at pos 2n+1 and 2n+2
  // and parent at pos Math.floor((n-1)/2)
  *heapSortGen(array:number[]) {
    const arr = [...array];
    const counts = {comparisons: 0, swaps: 0};
    // Helper function siftDown considers subtree with position n as root
    // forms a max heap from subtree by sifting element n into position 
    // assuming subtrees of this root-n-subtree are already max-heaps
    
    const siftDown = (n: number, last: number) => {
      const states = [];
      let leftId, rightId, toSwapId;
      while (true) {
        leftId = 2 * n + 1;
        rightId = 2 * n + 2;

        if (leftId > last) {
          toSwapId = rightId > last ? null : rightId
        }
        else if (rightId > last) {
          toSwapId = leftId;
        }
        else {
          toSwapId = arr[leftId] >= arr[rightId] ? leftId : rightId;
        }
        if (toSwapId != null) {
          toSwapId = arr[toSwapId] > arr[n] ? toSwapId : null
        }
        
        // if (leftId <= last && arr[leftId] > arr[n]) {
        //   toSwapId = leftId;
        // }
        // if (rightId <= last && arr[rightId] > arr[n]) {
        //   toSwapId = arr[leftId] >= arr[rightId] ? leftId : rightId;
        // }
        if (toSwapId === null) {
          if (leftId <= last) counts.comparisons += 1;
          if (rightId <= last) counts.comparisons += 1;
          states.push({
            arr: [...arr],
            i: n,
            j: toSwapId,
            swap: false,
            counts: {...counts},
            last}
          );
          break;
        }
        [arr[n], arr[toSwapId]] = [arr[toSwapId], arr[n]];
        const i = n;
        n = toSwapId;
        if (leftId <= last) counts.comparisons += 1;
        if (rightId <= last) counts.comparisons += 1;
        counts.swaps += 1;
        states.push({
          arr: [...arr],
          counts: {...counts},
          i, j: toSwapId, swap: true, last
        });
      }
      return states;
    }
    // Heapify array by turning progressively larger subtrees into max-heaps
    // Nodes without children are already max heaps
    const lastParentNode = Math.floor((arr.length-2)/2);
    yield {arr: [...arr], i: lastParentNode, j: -1, 
      swap: false, counts: {...counts}, last: lastParentNode, heap: false}

    for (let i=lastParentNode; i>=0; i--) {
      const res = siftDown(i, arr.length-1);
      for (let state of res) { yield {...state, heap: false, last: i} }
    }
    
    // Max-heap root is largest element
    // Swap root to end of max-heap and remove that position from consideration
    // sift new root into correct position in shortened heap
    // repeat until max-heap length is 1
    let last = arr.length-1;
    let res: any[] = [];
    while (last > 0) {
      [arr[0], arr[last]] = [arr[last], arr[0]];
      counts.swaps += 1;
      const tmpArr = [...arr] // saved for yield statement below
      const tmpCount = {...counts};
      res = siftDown(0, --last);
      yield({...res[0],arr: tmpArr, heap:true, j: res[0].i, counts: tmpCount});
      for (let state of res) { yield {...state, heap: true}  }
    }
    yield {...res[res.length-1], last: -1, i: -1, heap: true, swap: false}
  }

  getSorter(type: Sort, array: number[]) {
    switch(type) {
      case Sort.selection:
        return this.selectionSortGen(array);
      case Sort.insertion:
        return this.insertionSortGen(array);
      case Sort.bubble:
        return this.bubbleSortGen(array);
      case Sort.heap:
        return this.heapSortGen(array);
    }
  }

}
