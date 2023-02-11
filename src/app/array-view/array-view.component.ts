import { Component, ElementRef, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-array-view',
  templateUrl: './array-view.component.html',
  styleUrls: ['./array-view.component.css']
})
export class ArrayViewComponent implements OnChanges {

  height = this.host.nativeElement.clientHeight;
  width = this.host.nativeElement.clientWidth;
  SPACING_FACTOR = 0.10;
  @Input() array: number[] = [];

  arrayConfig: {
    colors: string[],
    heights: number[],
    width: number,
    spacing: number,
    lefts: number[],
  } = {
    colors: [],
    heights: [],
    width: 0,
    spacing: 0,
    lefts: []
  };

  constructor(private host: ElementRef) {}

  ngOnChanges() {

    this.configArray();
  }

  configArray() {
    const cfg = this.arrayConfig;
    const maxH = Math.max(...this.array);
    const valuesWidth = Math.floor(this.width * (1 - this.SPACING_FACTOR));
    const spacingsWidth = this.width - valuesWidth;
    cfg.spacing = Math.floor(spacingsWidth / (this.array.length -1));
    cfg.colors = this.array.map(val => 'firebrick');
    cfg.heights = this.array.map(val => val/maxH *this.height)
    cfg.width = Math.floor(valuesWidth / this.array.length);
    const usedSpacingWidth = cfg.spacing * (this.array.length -1);
    const usedValWidth = cfg.width * this.array.length;
    const offsetStart = (this.width - usedSpacingWidth - usedValWidth) / 2;
    cfg.lefts = this.array.map((_, i) => {
      return cfg.width * i + cfg.spacing * i + offsetStart
    });
  }
}
