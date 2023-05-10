import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../model/user.model";
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
export class UsernameInputComponent  implements OnInit {
  @Input() control!: FormControl
  readonly minLength = User.MIN_USERNAME_LENGTH
  readonly maxLength = User.MAX_USERNAME_LENGTH

  constructor() { }

  ngOnInit() {}

}
