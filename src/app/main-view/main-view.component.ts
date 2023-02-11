import { Component } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent {
  arr = [3, 4, 5, 2, 1];

  test():void {
    setTimeout(() => {
      this.arr = [5, 4, 6, 8, 9, 10];
    }, 1000);
  }

  constructor () {
    this.test();
  }
}
