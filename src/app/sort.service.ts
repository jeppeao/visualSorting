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
    const info = {swaps: 0, comparisons: 0};
    let i = 0;
    let j = 0;
    let swapped;
    let low = 0;
    yield {arr: [...arr], i, j, low, swap: false, info}
    for (i=0; i<arr.length-1; i++) {
      low = i;
      for (j=i; j<arr.length; j++) {
         if (arr[j] < arr[low]) {
          low = j;
        }
        info.comparisons = i===j ? info.comparisons : info.comparisons+1;
        yield {arr: [...arr], i, j, low, swap: false, info}
      }
      swapped = low !== i ? true : false;
      if (swapped) {
        [arr[i], arr[low]] = [arr[low], arr[i]];
        info.swaps +=1;
        yield {arr: [...arr], i, j, low, swap: swapped, info}; 
      }
    }
    yield {arr: [...arr], i: i+1, j, low, swap: swapped, info};
  }

  *insertionSortGen(array: number[]) {
    const arr = [...array];
    const info = {swaps: 0, comparisons: 0};
    for (let i=1; i<arr.length; i++) {
      let j = i;
      yield {arr: [...arr], i, j, swap: false, info};
      for (j=i-1; j>-1 && arr[j+1] < arr[j]; j--) {
        yield {arr: [...arr], i, j, swap: false, info};
        [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
        info.comparisons += 1;
        info.swaps += 1;
        yield {arr: [...arr], i, j, swap: true, info};
      }
      info.comparisons += 1;
    }
    yield {arr: [...arr], i:arr.length, j:arr.length, swap: false, info};
  }
  
  *bubbleSortGen(array: number[]) {
    const arr = [...array];
    const info = {swaps: 0, comparisons: 0};
    let lastUnsorted = arr.length-1;
    while (lastUnsorted > 0) {
      let j = -1; // index of last swap
      let i;
      for (i=1; i<=lastUnsorted; i++) {
        yield {arr: [...arr], i, j, lastUnsorted, swap: false, info};
        info.comparisons +=1;
        if (arr[i-1] > arr[i]) {
          [arr[i-1], arr[i]] = [arr[i], arr[i-1]];
          info.swaps +=1;
          j = i;
          yield {arr: [...arr], i, j, lastUnsorted, swap: true, info};
        }
      }
      lastUnsorted = j - 1;
    }
    yield {arr: [...arr], i:-1, j:-1, lastUnsorted, swap: false, info}
  }

  // Consider array as a binary tree max-heap
  // with node at index n having children at pos 2n+1 and 2n+2
  // and parent at pos Math.floor((n-1)/2)
  *heapSortGen(array:number[]) {
    const arr = [...array];
    const info = {comparisons: 0, swaps: 0};
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
          if (leftId <= last) info.comparisons += 1;
          if (rightId <= last) info.comparisons += 1;
          states.push({
            arr: [...arr],
            i: n,
            j: toSwapId,
            swap: false,
            info: {...info},
            last}
          );
          break;
        }
        [arr[n], arr[toSwapId]] = [arr[toSwapId], arr[n]];
        const i = n;
        n = toSwapId;
        if (leftId <= last) info.comparisons += 1;
        if (rightId <= last) info.comparisons += 1;
        info.swaps += 1;
        states.push({
          arr: [...arr],
          info: {...info},
          i, j: toSwapId, swap: true, last
        });
      }
      return states;
    }
    // Heapify array by turning progressively larger subtrees into max-heaps
    // Nodes without children are already max heaps
    const lastParentNode = Math.floor((arr.length-2)/2);
    yield {arr: [...arr], i: lastParentNode, j: -1, 
      swap: false, info: {...info}, last: lastParentNode, heap: false}

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
      info.swaps += 1;
      const tmpArr = [...arr] // saved for yield statement below
      const tmpCount = {...info};
      res = siftDown(0, --last);
      yield({...res[0],arr: tmpArr, heap:true, j: res[0].i, info: tmpCount});
      for (let state of res) { yield {...state, heap: true}  }
    }
    yield {...res[res.length-1], last: -1, i: -1, heap: true, swap: false}
  }

  // Yields permutations in decreasing lexocigraphical order,
  // sorted array is the lowest order and therefore the final result.
  // Algorithm:
  // 1. Finds start index (i) of longest non-decreasing suffix
  //    i.e. the longest sequence where no swaps can decrease order
  // 2. If i === 0 work is done
  // 3. Else select previous element (i-1) as pivot
  // 4. Find largest element in suffix that is smaller than pivot 
  // 5. Swap element from step 4 with pivot
  //    Now prefix has been minimally decreased
  // 6. Reverse sequence from i to end
  //    This creates largest suffix, thus miniminally decreased array
  // 7. Go to step 1
  *permutationSortGen(array: number[]) {
    let arr = [...array];
    const info = {comparisons: 0, swaps: 0};

    const nextPerm = () => {
      let i = arr.length - 1;
      let j = arr.length - 1;
      //find i
      while (i > 0 && arr[i] >= arr[i-1]) {
        i--;
        info.comparisons += 1;
      }
      info.comparisons += 1;
      // check if done 
      if (i <= 0) {
        return {arr: [...arr], i, j, info: {...info}, done: true};
      }
      //find largest suffix element smaller than pivot
      while (arr[j] >= arr[i-1]) {
        j--;
        info.comparisons += 1;
      }
      info.comparisons += 1;
      // swap
      [arr[j], arr[i-1]] = [arr[i-1], arr[j]];
      info.swaps += 1;
      // reverse suffix
      arr = [...arr.slice(0, i), ...arr.slice(i).reverse()];
      info.swaps += Math.floor(arr.slice(i).length / 2);
      return {arr: [...arr], i, j, info: {...info}, done: false};
    }

    yield {arr: [...arr], i:-1, j:-1, info: {...info}, done: false};
    let stat = nextPerm();
    while(stat.done === false) {
      yield {...stat, info: {comparisons: 0, swaps: 0}};
      stat = nextPerm()
    }
    yield {...stat, info: {comparisons: 0, swaps: 0}};
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
      case Sort.permutation:
        return this.permutationSortGen(array);
    }
  }

}
