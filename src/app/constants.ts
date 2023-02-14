export const DEFAULT_STEP_TIME = 500;

export interface SelectionSortStatus {
  arr:number[],
  i:number,
  j:number,
  low:number,
  swap: boolean
}