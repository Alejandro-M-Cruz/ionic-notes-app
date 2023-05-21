import {Component, Input} from '@angular/core';
import {USERNAME_MAX_LENGTH, USERNAME_MIN_LENGTH} from "../../../model/user.model";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-username-input',
  templateUrl: './username-input.component.html',
  styleUrls: ['./username-input.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule
  ],
  standalone: true
})
export class UsernameInputComponent {
  @Input() control!: FormControl
  readonly minLength = USERNAME_MIN_LENGTH
  readonly maxLength = USERNAME_MAX_LENGTH
}
