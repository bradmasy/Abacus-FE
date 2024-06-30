import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[eventViewContainer]',
  exportAs: 'eventViewContainer'

})

export class EventDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}

}
