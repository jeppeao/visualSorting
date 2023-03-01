import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { DEFAULT_STEP_TIME, Sort, SorterStatus } from '../constants';
import {
  interval,
  BehaviorSubject,
  filter,
  Observable,
  Subscription
} from 'rxjs'
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
export class SortViewComponent implements OnInit, OnDestroy {
  @Input() globalIsOn$!: BehaviorSubject<boolean>;
  @Input() globalReset$!: Observable<void>;
  @Input() globalSpeed$!: Observable<number>;
  @Input() globalArray$!: Observable<number[]>;
  @Input() windowAddDelete$!: Observable<void>;
  @Input() destroySelf: () => void = () => {};

  stepTime: number = DEFAULT_STEP_TIME;
  sort = Sort.insertion;
  sorterStatus!: SorterStatus;
  touched = false;
  ctrlSubscription = this.newCtrlSubscription();
  isOn$ = new BehaviorSubject(false);
  subs = new Subscription();

  constructor (private sorterService: SorterService) { }
 
  ngOnInit(): void {
    this.subs.add(this.globalIsOn$.subscribe(this.isOn$));
    this.sorterService.defineSorter(this.sort);
    this.sorterStatus = this.sorterService.getNext();
    this.subs.add(this.globalReset$.subscribe(() => this.restart()));
    this.subs.add(this.globalSpeed$.subscribe((speed) => this.changeSpeed(speed)));
    this.subs.add(this.globalArray$.subscribe((array) => this.changeArray(array)));
    this.pause();
  }

   ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  play = () => { 
    this.isOn$.next(true); 
    this.touch();
  }

  pause = () => { 
    this.isOn$.next(false); 
  }
  
  slower = () => { 
    this.changeSpeed(this.stepTime*2) 
  }

  faster = () => { 
    this.changeSpeed(this.stepTime/2) 
  }
  
  touch = () => {
    this.touched=true
  }

  newCtrlSubscription() {
    return interval(this.stepTime).pipe(
      filter(_ => this.isOn$.value === true)
    ).subscribe(_ => this.sorterStatus = this.sorterService.getNext());
  }

  restart = () => {
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

  changeArray(array: number[]) {
    this.sorterService.setArray(array);
    this.restart();
  }

  onShuffleClick = () => {
    this.sorterService.shuffle();
    this.restart();
  }

  setSortType = (type: Sort) => {
    this.sorterService.setSortType(type);
    this.restart();
  }
}
