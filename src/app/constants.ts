export const DEFAULT_STEP_TIME = 500;
export const DEFAULT_ARRAY_PARAMETERS = {length: 20, max: 10, min: -10};

export interface SortStatus {
  arr:number[],
  i:number,
  j:number,
  info: { [key: string]: string; };
}

export interface SelectionSortStatus extends SortStatus {
  low:number,
  swap: boolean,
}

export interface InsertionSortStatus extends SortStatus {
  swap: boolean,
}

export interface BubbleSortStatus extends SortStatus {
  swap: boolean,
  lastUnsorted: number,
}

export interface HeapSortStatus extends SortStatus {
  swap: boolean,
  last: number,
  heap: boolean,
}

export interface PermutationSortStatus extends SortStatus {
  done: boolean,
}

export interface QuickSortStatus extends SortStatus {
  start: number,
  end: number,
  pId: number,
  swap: boolean,
  done: boolean,
}

export interface MergeSortStatus extends SortStatus {
  start: number,
  end: number,
  merged: boolean,
  merging: boolean,
  done: boolean,
  s1: number,
  s2: number,
  e1: number,
  e2: number,
  mi: number
}

export interface CycleSortStatus extends SortStatus {
  cur: number,
  pos: number,
  sorted: number[],
  done: boolean,
}

export interface CountingSortStatus extends SortStatus {
  state: string,
}

export interface MiracleSortStatus {
  arr: number[],
  info: { sorted: string };
}

export interface InfoItem {
  label: string;
  content: string;
}

export interface SorterStatus {
  arr: number[];
  classList: string[];
  info: InfoItem[];
  done: boolean;
}

export enum ArrayClass {
  value = 'value',
  current = 'current',
  sorted = 'sorted',
  unsorted = 'unsorted',
  marked = 'marked',
  mark2 = 'mark2',
  swapped = 'swapped',
  dim = 'dim',
}

export enum Sort {
  selection = 'selection',
  insertion = 'insertion',
  bubble = 'bubble',
  heap = 'heap',
  permutation = 'permutation',
  quick = 'quick',
  merge = 'merge',
  miracle = 'miracle',
  cycle = 'cycle',
  counting = 'counting'
}

