import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ab-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})

export class LoginFormComponent {
  @Output() submitEvent: EventEmitter<{ [key: string]: string }>;

  public loginForm: FormGroup;
  public logoUrl = "../../../../assets/logos/logo-d2-no-background.png";
  public passwordIcon = "../../../../assets/icons/password.png";
  public emailIcon = "../../../../assets/icons/email.png";
  public email: FormControl;
  public password: FormControl;

  constructor() {
    this.email = new FormControl('');
    this.password = new FormControl('');
    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    })

    this.submitEvent = new EventEmitter<{ [key: string]: string }>();
  }

  onSubmit() {
    // validate and throw errors
    this.submitEvent.emit(this.loginForm.value)
  }

}
