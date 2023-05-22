import {Component, Input} from '@angular/core';
import {USER_PASSWORD_MAX_LENGTH, USER_PASSWORD_MIN_LENGTH} from "../../../model/user.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonicModule
  ],
  standalone: true
})
export class PasswordInputComponent {
  @Input() control!: FormControl
  @Input() isConfirmation: boolean = false
  readonly minLength = USER_PASSWORD_MIN_LENGTH
  readonly maxLength = USER_PASSWORD_MAX_LENGTH

  get errorMessage() {
    if (!this.control.errors)
      return ''
    switch (Object.keys(this.control.errors)[0]) {
      case 'passwordsDoNotMatch':
        return 'Passwords do not match'
      case 'required':
        return 'Password is required'
      case 'minlength':
        return 'Password is too short'
      case 'maxlength':
        return 'Password is too long'
      default:
        return 'Invalid password'
    }
  }
}
