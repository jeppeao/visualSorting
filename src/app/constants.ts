export const DEFAULT_STEP_TIME = 500;

export interface SelectionSortStatus {
  arr:number[],
  i:number,
  j:number,
  low:number,
  swap: boolean
}

export enum ArrayClass {
  current = 'current',
  sorted = 'sorted',
  unsorted = 'unsorted',
  marked = 'marked',
  swapped = 'swapped'
}