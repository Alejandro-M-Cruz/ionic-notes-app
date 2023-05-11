import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    IonicModule,
    RouterModule
  ],
  standalone: true
})
export class ToolbarComponent  implements OnInit {
  @Input() title: string = ""

  constructor() { }

  ngOnInit() {}

}
