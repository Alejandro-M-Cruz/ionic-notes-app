import {Component, Input, OnInit} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss'],
  imports: [
    ReactiveFormsModule,
    IonicModule
  ],
  standalone: true
})
export class EmailInputComponent  implements OnInit {
  @Input() control!: FormControl
  constructor() { }

  ngOnInit() {}

}
