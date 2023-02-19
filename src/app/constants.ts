export const DEFAULT_STEP_TIME = 200;

export interface SortStatus {
  arr:number[],
  i:number,
  j:number,
}

export interface SelectionSortStatus extends SortStatus {
  low:number,
  swap: boolean
}

export interface InsertionSortStatus extends SortStatus {
  swap: boolean
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
  insertion = 'insertion'
}