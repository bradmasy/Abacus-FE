import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'ab-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @ViewChild('spinner', { static: true }) spinner!: ElementRef;
  @Input() loading!: boolean;


}
