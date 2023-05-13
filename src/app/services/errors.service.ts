import { Injectable } from '@angular/core';
import {AlertController} from "@ionic/angular";

export enum ErrorMessage {
  REQUIRES_RECENT_LOGIN = 'You must have logged in recently to delete your account',
  UNKNOWN = 'An error occurred'
}

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor(private alertController: AlertController) { }

  async showErrorAlert(error: ErrorMessage) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: error,
      buttons: ['Accept']
    })
    await errorAlert.present()
  }

}
