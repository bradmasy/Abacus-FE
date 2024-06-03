import { Component, Input } from '@angular/core';

@Component({
  selector: 'ab-button',
  template: `<button  class="ab-button-element">{{text}}</button>`,
  styleUrl: './abacus-basic-button.component.scss'
})
export class AbacusBasicButtonComponent {

  @Input() text!:string;
 



}

