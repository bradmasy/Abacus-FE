import { Component, Input } from '@angular/core';

// export enum NavBarTypes {
//   Dropdown = "dropdown",
//   Link = "link"
// }

export type ButtonSelectOption = {
  link:string;
  value:string;
}

type ButtonOption = {
  link: string;
  selectOptions?:ButtonSelectOption[]
}

@Component({
  selector: 'ab-dropdown-button',
  template: `
  <div class="ab-dropdown-button-container">
    <select>
      <option disabled selected>{{ option.link }}</option>
      @for(select of option.selectOptions; track select){
      <option>{{ select.link }}</option>
      }
    </select>
    <img class="ab-dropdown-button-container__icon"src="{{iconPath}}"/>
  </div>
  `,
  styleUrl: './abacus-dropdown-button.component.scss'
})
export class AbacusDropdownButtonComponent {
  @Input() option!: ButtonOption;

  public iconPath = '../../../../assets/icons/drop-down-50.png'

}
