import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {RouterModule} from "@angular/router";
import {NgIf} from "@angular/common";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

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
  @Input() showFavouritesSelector: boolean = false
  @Output() favouritesSelectorChanged = new EventEmitter<boolean>()
  favouritesSelectorFormControl = new FormControl<boolean>(false, {nonNullable: true})
  favouritesSelectorChangesSubscription?: Subscription

  ngOnInit() {
    this.subscribeToFavouritesSelectorChanges()
  }

  private subscribeToFavouritesSelectorChanges() {
    this.favouritesSelectorChangesSubscription = this.favouritesSelectorFormControl.valueChanges
      .subscribe(showFavouritesOnly => {
        console.log('showFavouritesOnly', showFavouritesOnly)
        this.favouritesSelectorChanged.emit(showFavouritesOnly)
      })
  }

  ngOnDestroy() {
    this.favouritesSelectorChangesSubscription?.unsubscribe()
  }
}
