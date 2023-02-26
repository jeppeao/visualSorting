import { Component, ElementRef, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-array-view',
  templateUrl: './array-view.component.html',
  styleUrls: ['./array-view.component.css']
})
export class ArrayViewComponent implements OnChanges {

  heights: number[] = [];
  topHeight = 50;
  bottomHeight = 50;
  @Input() array: number[] = [];
  @Input() classList: string[] = [];
  @Input() stepTime = 500;

  constructor(private host: ElementRef) {
    this.host.nativeElement.style.setProperty(
      '--animation-time', (this.stepTime / 1000).toString() + "s"
    );
  }

  ngOnChanges() {
    if (this.array) {
      this.configArray();
    }
  }

  configArray() {
    const maxVal = Math.max(Math.max(...this.array), 0);
    const minVal = Math.min(Math.min(...this.array), 0);
    const valueSpan = maxVal - minVal;
    this.topHeight = Math.abs(maxVal / valueSpan) * 100;
    this.bottomHeight = 100 - this.topHeight;

    this.heights = this.array.map(val => {
      const normal = val < 0 ? minVal : maxVal;
      return val / normal * 100;
    });
  }
}
