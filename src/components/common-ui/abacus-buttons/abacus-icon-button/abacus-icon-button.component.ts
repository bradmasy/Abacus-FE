import { Component, Input } from '@angular/core';
// import '../../../../assets/icons/'
@Component({
  selector: 'ab-icon-button',
  template: `<button  class="ab-icon-button-element">
    <div class="ab-icon-button-element__icon">
      <img src="getImgSrc()"/>
    </div>
    <div class="ab-icon-button-element__text">
    {{text}}
    </div>
    </button>`,
  styleUrl: './abacus-icon-button.component.scss'
})
export class AbacusIconButtonComponent {
  @Input() text!: string;
  @Input() icon!: 'add' | '';


  getImgSrc(){

    if (this.icon === "add"){
      
      return "../../../../../assets/icons/add-90.png"
    }

    else{
      return ''
    }
  }
}

