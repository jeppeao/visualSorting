import { 
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild 
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Sort } from '../constants';

@Component({
  selector: 'app-sort-view-toolbar',
  templateUrl: './sort-view-toolbar.component.html',
  styleUrls: ['./sort-view-toolbar.component.css']
})
export class SortViewToolbarComponent implements AfterViewInit, OnDestroy {
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.responsiveMenuToggle();
  }
  @ViewChild('menuLongBtn') longMenuBtn!: ElementRef;
  @ViewChild('longBar') longBar!: ElementRef;
  @Input() info!: {label: string, content: string}[];
  @Input() isOn!: boolean;
  @Input() touched!: boolean;
  @Input() setSortType!: (type: Sort) => void;
  @Input() play!: () => void;
  @Input() pause!: () => void;
  @Input() faster!: () => void;
  @Input() slower!: () => void;
  @Input() restart!: () => void;
  @Input() onShuffleClick!: () => void;
  @Input() destroySelf!: () => void;
  @Input() windowAddDelete$!: Observable<void>;
  subs = new Subscription;
  sortSelect = 'insertion';

  constructor (private host: ElementRef) {}

  onSortSelection() {
    this.setSortType(this.sortSelectionToType());
  }

  ngAfterViewInit(): void {
    this.responsiveMenuToggle()
    this.subs.add(this.windowAddDelete$.subscribe(() => this.responsiveMenuToggle()));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();  
  }

  sortSelectionToType() {
    switch(this.sortSelect) {
      case 'insertion':
        return Sort.insertion;
      case 'selection':
        return Sort.selection;
      case 'bubble':
        return Sort.bubble;
      case 'heap':
        return Sort.heap;
      case 'permutation':
        return Sort.permutation;
      case 'quick':
        return Sort.quick;
      case 'merge':
        return Sort.merge;
      case 'miracle':
        return Sort.miracle;
      case 'cycle':
          return Sort.cycle;
      default:
        return Sort.insertion;
    }
  }

  responsiveMenuToggle() {
    const width = this.host.nativeElement.clientWidth;
    if (this.longBar && this.longMenuBtn) {
      if (width < 450) {
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
