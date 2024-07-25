import { Component, Input } from '@angular/core';

export enum NavBarTypes {
  Dropdown = "dropdown",
  Link = "link"
}

export type NavBarSelectOption = {
  link:string;
  value:string;
}

type NavBarOption = {
  link: string;
  type: NavBarTypes;
  selectOptions?:NavBarSelectOption[]
}

@Component({
  selector: 'ab-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})
export class NavigationBarComponent {

  @Input() options!: NavBarOption[];

  public dropDownPth = "../../../../assets/icons/drop-down-50.png";

}
