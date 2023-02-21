export const DEFAULT_STEP_TIME = 200;

export interface SortStatus {
  arr:number[],
  i:number,
  j:number,
  counts: {swaps: number, comparisons: number}
}

export interface SelectionSortStatus extends SortStatus {
  low:number,
  swap: boolean
}

export interface InsertionSortStatus extends SortStatus {
  swap: boolean
}

export interface BubbleSortStatus extends SortStatus {
  swap: boolean,
  lastUnsorted: number
}

export interface HeapSortStatus extends SortStatus {
  swap: boolean,
  last: number,
  heap: boolean
}

export enum ArrayClass {
  value = 'value',
  current = 'current',
  sorted = 'sorted',
  unsorted = 'unsorted',
  marked = 'marked',
  swapped = 'swapped'
}

export enum Sort {
  selection = 'selection',
  insertion = 'insertion',
  bubble = 'bubble',
  heap = 'heap'
}