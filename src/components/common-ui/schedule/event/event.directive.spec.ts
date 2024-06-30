import { EventDirective } from './event.directive';
import { Directive, ViewContainerRef } from '@angular/core';

describe('EventDirective', () => {
  let viewContainerRef: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    viewContainerRef = jasmine.createSpyObj('ViewContainerRef', ['createComponent', 'clear']);
  });

  it('should create an instance', () => {
    const directive = new EventDirective(viewContainerRef);
    expect(directive).toBeTruthy();
  });
});