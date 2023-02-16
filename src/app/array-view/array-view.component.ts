import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { ClassService } from '../class.service';

@Component({
  selector: 'app-array-view',
  templateUrl: './array-view.component.html',
  styleUrls: ['./array-view.component.css']
})
export class ArrayViewComponent implements OnChanges {

  component_height = this.host.nativeElement.clientHeight;
  heights: number[] = [];
  top: number = 0;
  @Input() array: number[] = [];
  @Input() classList: string[] = [];
  @Input() stepTime = 500;

  constructor(private host: ElementRef, public classService: ClassService) {
    this.host.nativeElement.style.setProperty(
      '--animation-time', (this.stepTime/1000).toString() + "s"
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
    this.top = Math.floor(Math.abs(minVal / valueSpan * 100));
    this.heights = this.array.map(
      val => Math.floor(Math.abs(val)/valueSpan * 100)
    );
  }
}
