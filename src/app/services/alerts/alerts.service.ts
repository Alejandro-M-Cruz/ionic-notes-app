import { Injectable } from '@angular/core';
import {ErrorMessage} from "./errors.service";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(private alertController: AlertController) { }

  async showErrorAlert(error: ErrorMessage, onClose?: () => void) {
    const errorAlert = await this.alertController.create({
      header: 'Error',
      message: error,
      buttons: ['Accept']
    })
    await errorAlert.present()
    errorAlert.onDidDismiss().then(() => onClose?.())
  }

  async showDeleteConfirmationAlert(message: string, onClose?: (shouldDelete: boolean) => void) {
    const confirmationAlert = await this.alertController.create({
      message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'delete',
        }
      ]
    })
    await confirmationAlert.present()
    confirmationAlert.onDidDismiss().then(result => onClose?.(result.role === 'delete'))
  }
}
