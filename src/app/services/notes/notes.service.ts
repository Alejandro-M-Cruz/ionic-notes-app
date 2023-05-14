import {inject, Injectable} from '@angular/core';
import {OfflineNotesService} from "./offline-notes.service";
import {OnlineNotesService} from "./online-notes.service";
import {Capacitor} from "@capacitor/core";
import {ErrorMessage} from "../alerts/alerts.service";
import {Observable} from "rxjs";
import {Note, NotesSortingMethod} from "../../model/note.model";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  mode: 'offline' | 'online' = this.deviceIsOffline() ? 'offline' : 'online'
  offlineNotesService?: OfflineNotesService
  onlineNotesService?: OnlineNotesService

  constructor() {
    this.injectServices()
  }

  private canUseOfflineMode(): boolean {
    return Capacitor.isNativePlatform()
  }

  private deviceIsOffline(): boolean {
    return !navigator.onLine
  }

  private injectOfflineNotesService() {
    this.offlineNotesService = inject(OfflineNotesService)
  }

  private injectOnlineNotesService() {
    this.onlineNotesService = inject(OnlineNotesService)
  }

  private injectServices() {
    this.mode === 'offline' ? this.injectOfflineNotesService() : this.injectOnlineNotesService()
  }

  setMode(mode: 'offline' | 'online') {
    if (mode === 'offline' && !this.canUseOfflineMode())
      throw new Error(ErrorMessage.OFFLINE_MODE_NOT_SUPPORTED)
    this.mode = mode
  }

  getUserNotes$(sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    return this.mode === 'offline' ?
      this.offlineNotesService!.getNotes$(sortingMethod) :
      this.onlineNotesService!.getUserNotes$(false, sortingMethod)
  }

  getUserFavouriteNotes$(sortingMethod: NotesSortingMethod) {
    return this.mode === 'offline' ?
      this.offlineNotesService!.getFavouriteNotes$(sortingMethod) :
      this.onlineNotesService!.getUserNotes$(true, sortingMethod)
  }

  getUserNotesQuantity$(): Observable<number> {
    return this.mode === 'offline' ?
      this.offlineNotesService!.getNotesQuantity$() :
      this.onlineNotesService!.getUserNotesQuantity$()
  }

  getUserFavouriteNotesQuantity$(): Observable<number> {
    return this.mode === 'offline' ?
      this.offlineNotesService!.getFavouriteNotesQuantity$() :
      this.onlineNotesService!.getUserNotesQuantity$(true)
  }

  getNoteById(noteId: string): Observable<Note | undefined> {
    return this.mode === 'offline' ?
      this.offlineNotesService!.getNoteById(noteId) :
      this.onlineNotesService!.getNoteById(noteId)
  }
}
