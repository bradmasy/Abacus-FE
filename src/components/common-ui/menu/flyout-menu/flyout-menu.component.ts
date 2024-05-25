import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../../services/session/session.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { State } from '../../../pages/dashboard/dashboard.component';

@Component({
  selector: 'ab-flyout-menu',
  templateUrl: './flyout-menu.component.html',
  styleUrl: './flyout-menu.component.scss'
})
export class FlyoutMenuComponent implements OnInit, AfterViewInit {
  @ViewChildren("menuItem") menuItems!: QueryList<ElementRef>;;
  @ViewChild("projects") projectsState!: ElementRef;
  @ViewChild("dashboard") dashboardState!: ElementRef;



  @Output() stateBehaviour: BehaviorSubject<string> = new BehaviorSubject<string>("projects");
  @Output() stateChange = new EventEmitter<string>();


  private active!: ElementRef;

  public state: string = "projects"


  constructor(
    private session: SessionService,
    private router: Router
  ) {

  }

  ngOnInit(): void {


  }

  onStateChange(newState: string) {
    this.stateChange.emit(newState);
  }

  ngAfterViewInit(): void {
    console.log(this.projectsState)
    this.stateBehaviour.subscribe((state: string) => {


      this.state = state
      console.log(this.menuItems)
      this.onStateChange(state);

      const menuItemArr = this.menuItems.toArray();
      console.log(menuItemArr[0])

      // reset the colors of the other menu items to default
      menuItemArr.forEach((menuItem) => {
        menuItem.nativeElement.style.backgroundColor = "#F4F4F4";
        menuItem.nativeElement.style.color = "black";
      })

      switch (state) {
        case "dashboard":
          console.log('dash')
          menuItemArr[0].nativeElement.style.backgroundColor = "blue";
          menuItemArr[0].nativeElement.style.color = "white";
          break;
        case "projects":
          menuItemArr[1].nativeElement.style.backgroundColor = "blue";
          menuItemArr[1].nativeElement.style.color = "white";
          break
        case "time":
          menuItemArr[2].nativeElement.style.backgroundColor = "blue";
          menuItemArr[2].nativeElement.style.color = "white";
          break
        case "settings":
          menuItemArr[3].nativeElement.style.backgroundColor = "blue";
          menuItemArr[3].nativeElement.style.color = "white";
          break
        default:
          this.projectsState.nativeElement.style.backgroundColor = "blue";
          this.projectsState.nativeElement.style.color = "white";

          break;
      }
    })
  }

  logout = () => {
    this.session.logout();
    this.router.navigateByUrl("/");
  }


  changeState = (newState: string) => {
    console.log(newState)
    this.stateBehaviour.next(newState);// = newState
  }


  //   updateStyle = (state: string): void => {
  //     // Example: Update style based on state
  //     switch (state) {
  //       case "projects":
  //         if (this.projectsState) {
  //           this.projectsState.nativeElement.style.backgroundColor = "blue";
  //           this.projectsState.nativeElement.style.color = "white";
  //         }
  //         break;
  //       case "dashboard":
  //         if (this.menuItems && this.menuItems.length > 0) {
  //           this.menuItems.forEach(item => {
  //             item.nativeElement.style.backgroundColor = "blue";
  //             item.nativeElement.style.color = "white";
  //           });
  //         }
  //         break;
  //       default:
  //         // Default styling
  //         break;
  //     }
  //   }
}




