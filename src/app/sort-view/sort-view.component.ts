import { 
  Component,
  ElementRef,
  Input,
  OnInit, OnDestroy, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { DEFAULT_STEP_TIME, Sort, SorterStatus } from '../constants';
import { interval, BehaviorSubject, filter, Observable, Subscription } from 'rxjs'
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
export class SortViewComponent implements OnInit, OnDestroy, AfterViewInit {

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.responsiveMenuToggle();
  }
  @ViewChild('menuLongBtn') longMenuBtn!: ElementRef;
  @ViewChild('longBar') longBar!: ElementRef;

  @Input() globalIsOn$!: BehaviorSubject<boolean>;
  @Input() globalReset$!: Observable<void>;
  @Input() globalSpeed$!: Observable<number>;
  @Input() globalArray$!: Observable<number[]>;
  @Input() windowAddDelete$!: Observable<void>;
  @Input() destroySelf: () => void = () => {};

  stepTime: number = DEFAULT_STEP_TIME;
  sort = Sort.insertion;
  sortSelect = 'insertion';
  sorterStatus!: SorterStatus;
  touched = false;
  ctrlSubscription = this.newCtrlSubscription();
  isOn$ = new BehaviorSubject(false);
  subs = new Subscription();

  constructor (
    private sorterService: SorterService,
    private host: ElementRef,
  ) { }
 
  ngOnInit(): void {
    this.subs.add(this.globalIsOn$.subscribe(this.isOn$));
    this.sorterService.defineSorter(this.sort);
    this.sorterStatus = this.sorterService.getNext();
    this.subs.add(this.globalReset$.subscribe(() => this.restart()));
    this.subs.add(this.globalSpeed$.subscribe((speed) => this.changeSpeed(speed)));
    this.subs.add(this.globalArray$.subscribe((array) => this.changeArray(array)));
    this.subs.add(this.windowAddDelete$.subscribe(() => this.responsiveMenuToggle()));
    this.pause();
  }

  ngAfterViewInit(): void {
    this.responsiveMenuToggle()
  }
  
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  play() { 
    this.isOn$.next(true); 
    this.touch();
  }

  pause() { 
    this.isOn$.next(false); 
  }
  
  slower() { 
    this.changeSpeed(this.stepTime*2) 
  }

  faster() { 
    this.changeSpeed(this.stepTime/2) 
  }
  
  touch() {
    this.touched=true
  }

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

  changeArray(array: number[]) {
    this.sorterService.setArray(array);
    this.restart();
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

  responsiveMenuToggle() {
    const width = this.host.nativeElement.clientWidth;
    if (this.longBar && this.longMenuBtn) {
      if (width < 400) {
      this.longBar.nativeElement.style.display = 'none';
      this.longMenuBtn.nativeElement.style.display = 'block';
      }
      else {
        this.longBar.nativeElement.style.display = 'flex';
        this.longMenuBtn.nativeElement.style.display = 'none';
      }
    }

  }

}
