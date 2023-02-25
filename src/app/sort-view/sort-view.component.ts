import { Component, Input, OnInit } from '@angular/core';
import { SortService } from '../sort.service';
import { ClassService } from '../class.service';
import { DEFAULT_STEP_TIME, Sort, SorterStatus } from '../constants';
import { interval, BehaviorSubject, filter } from 'rxjs'
import { MAT_TOOLTIP_DEFAULT_OPTIONS, MatTooltipDefaultOptions} from '@angular/material/tooltip';
import { SorterService } from '../sorter.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 2000,
  hideDelay: 0,
  touchendHideDelay: 500,
};

@Component({
  selector: 'app-sort-view',
  templateUrl: './sort-view.component.html',
  styleUrls: ['./sort-view.component.css'],
  providers: [
    SorterService,
    {
    provide: MAT_TOOLTIP_DEFAULT_OPTIONS,
    useValue: myCustomTooltipDefaults
  }
 ],
})
export class SortViewComponent implements OnInit {

  @Input() globalIsOn$!: BehaviorSubject<boolean>;
  @Input() destroySelf: () => void = () => {};

  stepTime: number = DEFAULT_STEP_TIME;
  sort = Sort.insertion;
  sortSelect = 'insertion';
  sorterStatus!: SorterStatus;
  touched = false;
  ctrlSubscription = this.newCtrlSubscription();
  isOn$ = new BehaviorSubject(false);

  constructor (private sorterService: SorterService) { }
 
  ngOnInit(): void {
    this.globalIsOn$.subscribe(this.isOn$);
    this.sorterService.defineSorter(this.sort);
    this.sorterStatus = this.sorterService.getNext();
  }

  play() { 
    this.isOn$.next(true); 
    this.touch();
  }

  pause() { this.isOn$.next(false); }
  slower() { this.changeSpeed(this.stepTime*2) }
  faster() { this.changeSpeed(this.stepTime/2) }
  touch() { this.touched=true }

  newCtrlSubscription() {
    return interval(this.stepTime).pipe(
      filter(_ => this.isOn$.value === true)
    ).subscribe(_ => this.sorterStatus = this.sorterService.getNext());
  }

  restart() {
    this.pause();
    this.ctrlSubscription.unsubscribe();
    this.ctrlSubscription = this.newCtrlSubscription();
    this.sorterService.restart();
    this.sorterStatus = this.sorterService.getNext()
    this.touched=false;
  }

  changeSpeed(stepTime: number) {
    this.stepTime = stepTime;
    this.ctrlSubscription.unsubscribe();
    this.ctrlSubscription = this.newCtrlSubscription();
  }

  onShuffleClick() {
    this.sorterService.shuffle();
    this.restart();
  }

  onSortSelection() {
    let type: Sort;
    switch(this.sortSelect) {
      case 'insertion':
        type = Sort.insertion;
        break;
      case 'selection':
        type = Sort.selection;
        break;
      case 'bubble':
        type = Sort.bubble;
        break;
      case 'heap':
        type = Sort.heap;
        break;
      case 'permutation':
        type = Sort.permutation;
        break
      default:
        type = Sort.insertion;
    }
    this.sorterService.setSortType(type);
    this.restart();
  }

}
