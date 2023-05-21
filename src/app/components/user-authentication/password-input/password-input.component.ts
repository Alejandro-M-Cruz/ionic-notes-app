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
  readonly minLength = USER_PASSWORD_MIN_LENGTH
  readonly maxLength = USER_PASSWORD_MAX_LENGTH
}
