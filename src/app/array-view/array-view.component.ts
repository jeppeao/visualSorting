import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { ClassService } from '../class.service';

@Component({
  selector: 'app-array-view',
  templateUrl: './array-view.component.html',
  styleUrls: ['./array-view.component.css']
})
export class ArrayViewComponent implements OnChanges {

  SPACING_FACTOR = 0.10;
  height = this.host.nativeElement.clientHeight;
  width = this.host.nativeElement.clientWidth;
  @Input() array: number[] = [];
  @Input() classList: string[] = [];
  @Input() stepTime = 500;


  arrayConfig: {
    heights: number[],
    width: number,
    spacing: number,
    lefts: number[],
    bottom: number,
  } = {
    heights: [],
    width: 0,
    spacing: 0,
    lefts: [],
    bottom: 0
  };

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
    const cfg = this.arrayConfig;
    const valueSpan = Math.max(...this.array) - Math.min(...this.array);
    cfg.heights = this.array.map(val => Math.abs(val)/valueSpan *this.height);
    cfg.bottom = 100 - Math.floor(100 * Math.max(...this.array) / valueSpan);
    const valuesWidth = Math.floor(this.width * (1 - this.SPACING_FACTOR));
    const spacingsWidth = this.width - valuesWidth;
    cfg.spacing = Math.floor(spacingsWidth / (this.array.length -1));
    cfg.width = Math.floor(valuesWidth / this.array.length);
    const usedSpacingWidth = cfg.spacing * (this.array.length -1);
    const usedValWidth = cfg.width * this.array.length;
    const offsetStart = (this.width - usedSpacingWidth - usedValWidth) / 2;
    cfg.lefts = this.array.map((_, i) => {
      return cfg.width * i + cfg.spacing * i + offsetStart
    });
  }
}
