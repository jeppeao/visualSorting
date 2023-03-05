import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { WarningDialogComponent } from '../warning-dialog/warning-dialog.component';

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
  @Input() initArray!: number[];
  @Input() windowAddDelete$!: Observable<void>;
  @Input() destroySelf: () => void = () => {};

  stepTime: number = DEFAULT_STEP_TIME;
  sort = Sort.insertion;
  array!: number[];
  sorterStatus!: SorterStatus;
  touched = false;
  ctrlSubscription = this.newCtrlSubscription();
  isOn$ = new BehaviorSubject(false);
  subs = new Subscription();

  constructor (
    private sorterService: SorterService, 
    public dialog: MatDialog
  ) { }
 
  ngOnInit(): void {
    this.subs.add(this.globalIsOn$.subscribe(this.isOn$));
    this.sorterService.defineSorter(this.sort, this.initArray);
    this.sorterStatus = this.sorterService.getNext();
    this.subs.add(this.globalReset$.subscribe(() => this.restart()));
    this.subs.add(this.globalSpeed$.subscribe((speed) => this.changeSpeed(speed)));
    this.subs.add(this.globalArray$.subscribe((array) => this.changeArray(array)));
    this.array = this.initArray;
    this.pause();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  openDialog(msg: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = msg;
    dialogConfig.maxWidth = '350px';
    this.dialog.open(WarningDialogComponent, dialogConfig);
  }

  displayWarning() {
    if (this.sort === Sort.miracle) {
      this.openDialog(
      "Miracle sort may take a very long time to finish"
      );
    }

    if (this.sort === Sort.permutation && this.array.length > 8) {
      this.openDialog(
      "Permutation sort may take a long time to finish, consider a shorter array"
      );
    }

    if (this.sort === Sort.counting) {
      const range = Math.max(...this.array) - Math.min(...this.array) + 1;
      if (range > 500)
      this.openDialog(
      "If max and min values are far apart counting sort may require a larger display and may slow down app"
      );
    }
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
    this.array = array;
    this.sorterService.setArray(array);
    this.restart();
    this.displayWarning();
  }

  onShuffleClick = () => {
    this.sorterService.shuffle();
    this.restart();
  }

  setSortType = (type: Sort) => {
    this.sort = type;
    this.sorterService.setSortType(type);
    this.restart();
    this.displayWarning();
  }
}
