import { Component, ViewChild, signal } from '@angular/core';
import { SpinnerComponent } from '../../common-ui/spinner/spinner.component';
import { ApiService } from '../../../services/api/api.service';
import { Router } from '@angular/router';
import { SessionOptions } from 'http2';
import { SessionService } from '../../../services/session/session.service';

@Component({
  selector: 'ab-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @ViewChild(SpinnerComponent) spinner!: SpinnerComponent;

  public imgUrl: string;
  public loading = signal(false);

  constructor(
    private api: ApiService,
    private router: Router,
    private session: SessionService
  ) {
    this.imgUrl = "../../../../assets/photos/home.jpg";
  }

  /**
   * Receives the credentials from the output of the login form and makes an api call to login.
   * @param event the event data from the login form
   */
  receiveLoginCredentials = (event: { [key: string]: string }) => {
    this.loading.set(true)

    const body = {
      "Username": event['email'],
      "Password": event["password"]
    }

    this.api.login(body).subscribe(
      {
        next: (success) => {
          this.session.setUserId(success["userId"]);
          this.session.setToken(success["token"]);
          this.router.navigateByUrl("dashboard")
        },
        error: (err) => {
          this.loading.set(false)

        }
      }
    )
  }

  onMouseMove(event: MouseEvent): void {

    if (this.spinner) {
      const spinnerRef = this.spinner.spinner;
      const leftOffset = 35; // Adjust offset as needed
      const topOffset = 50;

      spinnerRef.nativeElement.style.left = (event.clientX - leftOffset) + "px";
      spinnerRef.nativeElement.style.top = (event.clientY - topOffset) + "px";
    }
  }

}
