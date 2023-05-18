import { CssSelector } from '@angular/compiler';
import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";

export enum ErrorMessage {
  EMAIL_ALREADY_IN_USE = 'The email address is already in use by another account',
  USER_NOT_FOUND = 'There is no user with this email',
  WRONG_PASSWORD = 'The password is incorrect',
  REQUIRES_RECENT_LOGIN = 'You must have logged in recently to delete your account, please log in again',
  ERROR_STORING_FAVOURITE_NOTES = 'Could not store favourite notes in the device',
  UNKNOWN = 'An error occurred, please try again later'
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(private alertController: AlertController) { }

  private identifyError(error: any): ErrorMessage {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return ErrorMessage.EMAIL_ALREADY_IN_USE
      case 'auth/user-not-found':
        return ErrorMessage.USER_NOT_FOUND
      case 'auth/wrong-password':
        return ErrorMessage.WRONG_PASSWORD
      case 'auth/requires-recent-login':
        return ErrorMessage.REQUIRES_RECENT_LOGIN
      default:
        return ErrorMessage.UNKNOWN
    }
  }

  async showErrorAlert(error: any | string, onClose?: () => void) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: typeof error === 'string' ? error : this.identifyError(error),
      buttons: [{
        text: 'Accept',
        cssClass: 'alert-accept-button'
      }],
      cssClass: 'error-alert'
    })
    await errorAlert.present()
    errorAlert.onDidDismiss().then(() => onClose?.())
  }

  async showDeleteConfirmationAlert(
    title: string,
    message: string,
    onClose?: (shouldDelete: boolean) => void
  ) {
    const confirmationAlert = await this.alertController.create({
      header: title,
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-cancel-button'
        },
        {
          text: 'Delete',
          role: 'delete',
          cssClass: 'alert-delete-button'
        }
      ],
      cssClass: 'delete-confirmation-alert'
    })
    await confirmationAlert.present()
    confirmationAlert.onDidDismiss()
      .then($event => onClose?.($event.role === 'delete'))
  }

  async showInformationAlert(title: string, message: string) {
    const informationAlert = await this.alertController.create({
      header: title,
      message,
      buttons: [{
        text: 'Accept',
        cssClass: 'alert-accept-button'
      }],
      cssClass: 'information-alert'
    })
    await informationAlert.present()
  }
}
