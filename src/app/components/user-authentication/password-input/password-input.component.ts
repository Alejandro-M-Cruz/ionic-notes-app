import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user.model";
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
export class PasswordInputComponent  implements OnInit {
  @Input() control!: FormControl
  readonly minLength = User.MIN_PASSWORD_LENGTH
  readonly maxLength = User.MAX_PASSWORD_LENGTH
  constructor() { }

  ngOnInit() {}

}
