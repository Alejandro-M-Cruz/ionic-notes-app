import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";
import {NotesDisplayOption} from "../../model/note.model";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  imports: [
    IonicModule,
    RouterModule,
    NgIf,
    ReactiveFormsModule
  ],
  standalone: true
})
export class ToolbarComponent  implements OnInit, OnDestroy {
  @Input() title?: string
  @Input() displayOption?: NotesDisplayOption
  @Output() displayOptionChanged = new EventEmitter<NotesDisplayOption>()
  displayOptionFormControl?: FormControl<NotesDisplayOption>
  displayOptionChangesSubscription?: Subscription

  ngOnInit() {
    if (this.displayOption) {
      this.initialiseDisplayOptionFormControl()
      this.subscribeToDisplayOptionSelectorChanges()
    }
  }

  private initialiseDisplayOptionFormControl() {
    this.displayOptionFormControl = new FormControl(this.displayOption!, {nonNullable: true})
  }

  private subscribeToDisplayOptionSelectorChanges() {
    this.displayOptionChangesSubscription = this.displayOptionFormControl!.valueChanges
      .subscribe(displayOption => {
        this.displayOptionChanged.emit(displayOption)
      })
  }

  ngOnDestroy() {
    this.displayOptionChangesSubscription?.unsubscribe()
  }
}
