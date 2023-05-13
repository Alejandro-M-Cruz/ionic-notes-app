import { Injectable } from '@angular/core';
import {ErrorMessage} from "./errors.service";
import {AlertController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
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
