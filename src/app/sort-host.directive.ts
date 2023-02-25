import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[sortHost]',
})
export class SortHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}