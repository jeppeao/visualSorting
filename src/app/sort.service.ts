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

  isSorted(array: number[]) {
    return array.every(
      (val, idx) => idx === 0 || val >= array[idx-1]
    );
  }

  *selectionSortGen(array: number[]) {
    const arr = [...array]
    const info = {swaps: 0, comparisons: 0};
    let i = 0;
    let j = 0;
    let swapped;
    let low = 0;
    let lowVal = 0;
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
        info.comparisons += 1;
        yield {arr: [...arr], i, j, swap: false, info};
        [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
        info.swaps += 1;
        yield {arr: [...arr], i, j, swap: true, info};
      }
      info.comparisons = j === -1 ? info.comparisons : info.comparisons+1;
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
    yield {arr: [...arr], i:-1, j:-1, lastUnsorted:-1, swap: false, info}
  }

  // Consider array as a binary tree max-heap
  // with node at index n having children at pos 2n+1 and 2n+2
  // and parent at pos Math.floor((n-1)/2)
  *heapSortGen(array:number[]) {
    const arr = [...array];
    const info = {swaps: 0, comparisons: 0};
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
    const info = {swaps: 0, comparisons: 0};

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
        return { arr: [...arr], i, j, info: {...info}, done: true };
      }
      //find largest suffix element smaller than pivot
      while (arr[j] >= arr[i-1]) {
        j--;
        info.comparisons += 1;
      }
      info.comparisons += 1;
      [arr[j], arr[i-1]] = [arr[i-1], arr[j]];
      info.swaps += 1;
      arr = [...arr.slice(0, i), ...arr.slice(i).reverse()];
      info.swaps += Math.floor(arr.slice(i).length / 2);
        return { arr: [...arr], i, j, info: {...info}, done: false };
    }

    yield { arr: [...arr], i: Infinity, j:-1, info: {...info}, done: false };
    let stat = nextPerm();
    while(stat.done === false) {
        yield stat;
        stat = nextPerm()
    }
    yield stat;
  }

  *quicksortGen(array: number[]) {
    let arr = [...array];
    let states:{}[] = [];
    const info = {swaps: 0, comparisons: 0};

    let stack = [0, arr.length-1];
    while (stack.length > 0) {
      const end = stack.pop();
      const start = stack.pop();

      if (start !== undefined && end !== undefined) {
        const pivot = partition(start, end);
        for (let state of states) {
          yield {...state, done: false};
        }
        states = [];
        if (pivot > start) {
          stack.push(start);
          stack.push(pivot);
        }

        if (pivot + 1 < end) {
          stack.push(pivot + 1);
          stack.push(end);
        }
      }
    }
    yield {arr, i:-1, j:-1, start:-1, end:-2, swap: false, info, done: true}
    
    function partition(start:number, end:number) {
      // choose pivot as middle index value
      let pId = start + Math.floor((end-start)/2);
      const pivot = arr[pId];
      
      let i = start;
      let j = end;
      while (true) {
        states.push({
          arr: [...arr], i, j, info: {...info}, swap: false, start, end, pId
        })

        while (arr[i] < pivot) {
          i++;
          info.comparisons++;
          states.push({
            arr: [...arr], i, j, info: {...info}, swap: false, start, end, pId
          })
        }
        while (arr[j] > pivot) {
          j--;
          info.comparisons++;
          states.push({
            arr: [...arr], i, j, info: {...info}, swap: false, start, end, pId
          })
        }
        if (i >= j) break;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;

        if (pId === i) {pId = j}
        else if (pId === j) {pId = i}
        info.swaps++;
        states.push({
          arr: [...arr], i, j, info: {...info}, swap: true, start, end, pId
        });
      }
      return Math.min(i,j);
    }
  }

  *mergeSortGen(array: number[]) {
    let arr = [...array];
    let merged = new Array(Math.ceil(arr.length +1)).fill(0); // one empty item for array-view

    let states:{}[] = [];
    const info = {insertions: 0, comparisons: 0};

    yield {
      arr: [...arr], info: {...info}, merged: false, merging: false,
      i:-Infinity, j:-Infinity, done: false, s1:-1, e1:-1, s2:-1, e2:-1, mi: -2
    }
    for (let size=1; size<arr.length; size*=2) {
      for (let i=0; i<arr.length-1; i+=2*size) {
         const s1 = i;
         const e1 = i + size - 1; 
         const s2 = e1 + 1;
         let e2 = s2 + size - 1;
         if (e1 >= arr.length - 1) {
          break;
         }
         if (e2 > arr.length - 1) {
          e2 = arr.length -1;
         }
         merge(s1, e1, s2, e2);
         for (let state of states) {
          yield state;
         }
         states = [];
      }
    }
    yield {
      arr: [...arr], info: {...info}, merging: false,
      i:-1, j:-1, done: true, s1:-1, e1:-1, s2:-1, e2:-1, mi: -2
    }
    
    function merge(s1: number, e1: number, s2:number, e2:number ) {
      let i = s1;
      let j = s2;
      let mi = 0;

      while (i < j && i <= e1 && j <= e2) {
        states.push({
          arr: [...merged, ...arr], info: {...info}, merged: false,
          i, j, done: false, s1, e1, s2, e2, mi, merging: true
        });
        if (arr[i] <= arr[j]) {
          merged[mi] = arr[i];
          mi++;
          info.comparisons += 1;
          info.insertions += 1;
          states.push({
            arr: [...merged, ...arr], info: {...info}, merged: false,
            i, j, done: false, s1, e1, s2, e2, mi, merging: true
          });
          i++;
        }
        else {
          merged[mi] = arr[j];
          mi++;
          info.comparisons += 1;
          info.insertions += 1;
          states.push({
            arr: [...merged, ...arr], info: {...info}, merged: false,
            i, j, done: false, s1, e1, s2, e2, mi, merging: true
          });
          j++;
        }  
      }
      states.push({
        arr: [...merged, ...arr], info: {...info}, merged: false,
        i, j, done: false, s1, e1, s2, e2, mi, merging: true
      });
      while (i <= e1) {
        merged[mi] = arr[i];
        i++;
        mi++;
        info.insertions += 1;
        states.push({
          arr: [...merged, ...arr], info: {...info}, merged: false,
          i, j, done: false, s1, e1, s2, e2, mi, merging: true
        });
      }
      while (j <= e2) {
        merged[mi] = arr[j];
        j++;
        mi++;
        info.insertions += 1;
        states.push({
          arr: [...merged, ...arr], info: {...info}, merged: false,
          i, j, done: false, s1, e1, s2, e2, mi, merging: true
        });
      }
      for (let k=0; k<=e2-s1; k++) {
        arr[s1+k] = merged[k];
        info.insertions += 1;
      }
      merged = new Array(Math.ceil(arr.length +1)).fill(0);
      
      states.push({
        arr: [...merged, ...arr], info: {...info}, merged: true,
        i, j, done: false, s1, e1, s2, e2, mi: -1, merging: true
      });
    }
  }

  *cycleSortGen(array: number[]) {
    const arr = [...array];
    const swapArr = [0, 0];
    const sorted = [];
    const info = {insertions: 0, comparisons: 0};

    for (let i = 0; i < arr.length-1; i++) {
      let pos = i;
      let cur = arr[i]
      swapArr[0] = cur;
      for (let j=i+1; j< arr.length; j++) {
        pos = arr[j] < cur ? pos + 1: pos;
        info.comparisons += 1;
        yield { 
          arr: [...swapArr, ...arr], i, j, pos,
          cur, sorted:[...sorted], info, done: false
        }
      }

      // element is already in correct position
      if (pos === i) {
        sorted.push(pos)
        yield { 
          arr: [...swapArr, ...arr], i, j:-1, pos,
          cur, sorted:[...sorted], info, done: false
        }
        continue;
      }
      // put element after other equal elements
      while (arr[pos] === cur) {
        info.comparisons += 1;
        pos++;
        yield { 
          arr: [...swapArr, ...arr], i, j:-1, pos,
          cur, sorted:[...sorted], info, done: false
        }
      }
      info.comparisons += 1;
      [arr[pos], cur] = [cur, arr[pos]];
      info.insertions += 1;
      sorted.push(pos);
      swapArr[0] = cur;
      yield { 
        arr: [...swapArr, ...arr], i, j:-1, pos,
        cur, sorted:[...sorted], info, done: false
      }
      // find end of cycle
      while (pos !== i) {
        pos = i;
        for (let j=i+1; j< arr.length; j++) {
          pos = arr[j] < cur ? pos + 1: pos;
          info.comparisons += 1;
          yield { 
            arr: [...swapArr, ...arr], i, j, pos,
            cur, sorted:[...sorted], info, done: false
          }
        }
        // put element after other equal elements
        while (arr[pos] === cur) {
          info.comparisons += 1;
          pos++;
          yield { 
            arr: [...swapArr, ...arr], i, j:-1, pos,
            cur, sorted:[...sorted], info, done: false
          }
        }
        info.comparisons += 1;
        [arr[pos], cur] = [cur, arr[pos]];
        info.insertions += 1;
        sorted.push(pos);
        swapArr[0] = cur;
        yield { 
          arr: [...swapArr, ...arr], i,j:-1, pos,
          cur, sorted:[...sorted], info, done: false
        }
      }
    }
    yield { 
      arr: [...swapArr, ...arr], i:-1,j:-1, pos:-1,
      cur:-1, sorted:[...sorted], info, done: true
    }
  }

  *countingSortGen(array: number[]) {
    const arr = [...array];
    const info = { 'count list length': 0, scanned: 0 };
    let min: number = arr[0], max: number = arr[0];
    
    yield { arr: [...arr], i:-1, info, j: -1, state: 'minmax' }
    
    for (let i=0; i< arr.length; i++) {
      min = arr[i] < min ? arr[i] : min;
      max = arr[i] > max ? arr[i] : max;
      info.scanned += 1;
      info['count list length'] = max - min + 1;
      yield { arr: [...arr], i, info, j: -1, state: 'minmax' }
    }
    const counts = new Array(max - min + 1).fill(0);
    info['count list length'] = max - min + 1;
    for (let i=0; i < array.length; i++) {
      counts[array[i] - min] += 1;
      info.scanned += 1;
      yield {arr: [...counts, max, min ,...arr], i, info, j:-1, state: 'count'}
    }
    let i = 0;
    for (let j=min; j<=max; j++) {
      for (let c=0; c<counts[j - min]; c++) {
        arr[i] = j;
        info.scanned += 1;
        yield {
          arr: [...counts, max, min, ...arr], 
          i, info, j: j-min, state: 'distribute'
        }
        i++;
      }
    }
    yield { arr: [...arr], i, info, j: -1, state: 'done' }
  }

  *radixSortGen(array: number[]) {
    const arr = [...array];
    const info = {insertions: 0, stage: 'ready'};
    const arrLen = arr.length;

    function getDigit(n: number, pos: number) {
      return Math.floor(Math.abs(n) / 10**(pos-1)) % 10;
    }

    yield {arr: [...arr], info, i: -1, j:-1, state: 'ready', arrLen};

    // find longest number 
    let longestNumber = 0;
    for (let i=0; i<arr.length; i++) {
      let cur = Math.abs(arr[i])
      longestNumber = cur > longestNumber ? cur : longestNumber;
      info.insertions += 1;
      info.stage = 'counting digits';
      yield {arr: [...arr], info, i, j:-1, state: 'longestNumber', arrLen};
    }
    
    if (longestNumber === 0) {
      info.stage = 'done';
      yield {arr: [...arr], info, i: -1, j:-1, state: 'done', arrLen};
      return;
    }
    const digits = Math.floor(Math.log10(longestNumber)) + 1;
    
    for (let d=1; d<=digits; d++) {
      const buckets:number[][] = [];
      info.stage = 'filling buckets';
      for (let i=0; i<arr.length; i++) {
        const v = getDigit(arr[i], d);
        (buckets[v] || (buckets[v] = [])).push(arr[i]); 
        info.insertions += 1;
        yield {
          arr: [...buckets.flat(), 0, ...arr], info, i, 
          j:-1, state: 'bucketFill', arrLen
        };
      }
      info.stage = 'filling array';
      
      for (let j=0, arrIndx=0; j<buckets.length; j++) {
        if (!buckets[j]) continue;
        for (let bi=0; bi < buckets[j].length; bi++) {
          arr[arrIndx++] = buckets[j][bi];
          info.insertions += 1;
          yield {
            arr: [...buckets.flat(), 0, ...arr], info, i:arrIndx-1, 
            j:-1, state: 'arrayFill', arrLen
          };
        }
      }
    }
    info.stage = 'positives and negatives bucket';
    
    // extra loops to sort negative numbers
    const buckets: number[][] = [[],[]];
    let arrIdx = 0;

    for (let i=0; i<arr.length; i++) {
      buckets[(arr[i]<0 ? 0 : 1)].push(arr[i]);
      info.insertions += 1;
      yield {
        arr: [...buckets.flat(), 0, ...arr], info, i, 
        j:-1, state: 'bucketFill', arrLen
      };
    }
    info.stage = 'negatives fill';
    let negCount = buckets[0].length;
    // order of negative numbers need to be reversed
    for (let i=buckets[0].length-1; i>=0; i--) {
      arr[arrIdx++] = buckets[0][i];        
      info.insertions += 1;
      yield {
        arr: [...buckets.flat(), 0, ...arr], info, i, 
        j: arrIdx-1, state: 'negFill', arrLen
      };
    }
    info.stage = 'positives fill';

    for (let i=0; i<buckets[1].length; i++) {
      arr[arrIdx++] = buckets[1][i];        
      info.insertions += 1;
      yield {
        arr: [...buckets.flat(), 0, ...arr], info, i: i+negCount, 
        j:-1, state: 'posFill', arrLen
      };
    }

    info.stage = 'done';
    yield {arr: [...arr], info, i: -1, j:-1, state: 'done', arrLen};
  }

  *miracleSortGen(array: number[]) {
    const arr = [...array];
    const info = {'times checked': 0, sorted: 'false'};

    while (this.isSorted(arr) === false) {
      info['times checked'] += 1;
      yield {arr: [...array], info}
    }
    info['times checked'] += 1;
    info.sorted = 'true';
    yield { arr: [...array], info }
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
      case Sort.quick:
        return this.quicksortGen(array);
      case Sort.merge:
        return this.mergeSortGen(array);
      case Sort.cycle:
        return this.cycleSortGen(array);
      case Sort.counting:
          return this.countingSortGen(array);
      case Sort.miracle:
        return this.miracleSortGen(array);
      case Sort.radix:
        return this.radixSortGen(array);
    }
  }
}
