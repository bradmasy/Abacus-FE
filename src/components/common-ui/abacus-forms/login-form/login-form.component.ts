import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ab-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})

export class LoginFormComponent {
  public logoUrl = "../../../../assets/logos/logo-d2-no-background.png";
  public passwordIcon = "../../../../assets/icons/password.png";
  public emailIcon ="../../../../assets/icons/email.png";
  public email = new FormControl('');
  public password = new FormControl('');

}
