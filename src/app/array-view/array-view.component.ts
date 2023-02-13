import { Component, ElementRef, Input, OnChanges } from '@angular/core';

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
  @Input() highlights: number[] = [];
  @Input() changed = false;
  @Input() stepTime = 500;


  arrayConfig: {
    heights: number[],
    width: number,
    spacing: number,
    lefts: number[],
    class: string[]
  } = {
    heights: [],
    width: 0,
    spacing: 0,
    lefts: [],
    class: []
  };

  constructor(private host: ElementRef) {
    this.host.nativeElement.style.setProperty(
      '--animation-time', (this.stepTime/1000).toString() + "s"
    );
  }

  ngOnChanges() {
    this.configArray();
  }

  configArray() {
    const cfg = this.arrayConfig;
    const maxH = Math.max(...this.array);
    const valuesWidth = Math.floor(this.width * (1 - this.SPACING_FACTOR));
    const spacingsWidth = this.width - valuesWidth;
    cfg.spacing = Math.floor(spacingsWidth / (this.array.length -1));
    cfg.heights = this.array.map(val => val/maxH *this.height)
    cfg.width = Math.floor(valuesWidth / this.array.length);
    const usedSpacingWidth = cfg.spacing * (this.array.length -1);
    const usedValWidth = cfg.width * this.array.length;
    const offsetStart = (this.width - usedSpacingWidth - usedValWidth) / 2;
    cfg.lefts = this.array.map((_, i) => {
      return cfg.width * i + cfg.spacing * i + offsetStart
    });
    this.setClass();
  }

  setClass() {
    this.arrayConfig.class = this.arrayConfig.heights.map((cur, id) => {
      if (this.changed && this.highlights[0] === id) {
        return "value sorted fade-in";
      }
      if (this.changed && this.highlights[2] === id) {
        return "value unsorted fade-in";
      }
      // already sorted
      if (
        this.changed && id == this.highlights[0] || id < this.highlights[0]
      ) { 
        return 'value sorted'; 
      }
      // current value
      if (id === this.highlights[1]) { 
        if (id === this.highlights[2]) {
          return 'value current lowest';
        }
        return 'value current unsorted';
      }
      // lowest value seen this loop
      if (id === this.highlights[2] && this.changed === false) { 
        return 'value lowest';
      }
      return 'value unsorted';
    });
  }
}
