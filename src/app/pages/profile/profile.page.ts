import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user/user.service";
import {User} from "../../model/user.model";
import {Subscription} from "rxjs";
import {AuthService} from "../../services/user/auth.service";
import {Router} from "@angular/router";
import {AccountDeletionService} from "../../services/user/account-deletion.service";
import {FormControl} from "@angular/forms";
import {NotesService} from "../../services/notes/notes.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user?: User
  userSubscription?: Subscription
  profilePhotoFormControl = new FormControl<File | null>(null)
  userNotesQuantity$ = this.notesService.getUserNotesQuantity$()
  userFavouriteNotesQuantity$ = this.notesService.getUserNotesQuantity$(true)
  profilePhotoChanged = false

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private notesService: NotesService,
    private accountDeletionService: AccountDeletionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userSubscription = this.userService.currentUser$.subscribe(user => {
      this.user = user!
    })
    this.profilePhotoFormControl.valueChanges.subscribe(profilePhotoFile => {
      this.profilePhotoChanged = true
    })
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe()
  }

  async onSignOutButtonClicked() {
    try{
      await this.authService.signOut()
      await this.router.navigate(['/home'])
    } catch (e: any) {
      console.error(e)
      alert(e.message)
    }
  }

  async onAccountDeletionConfirmationClosed(shouldDeleteAccount: boolean) {
    if (shouldDeleteAccount)
      await this.accountDeletionService.deleteUserAccount()
  }

}
