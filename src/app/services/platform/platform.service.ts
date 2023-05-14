import {inject, Injectable} from '@angular/core';
import {Capacitor} from "@capacitor/core";
import {OfflineNotesService} from "../notes/offline-notes.service";
import {OnlineNotesService} from "../notes/online-notes.service";
import {ErrorMessage} from "../alerts/alerts.service";

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

}
