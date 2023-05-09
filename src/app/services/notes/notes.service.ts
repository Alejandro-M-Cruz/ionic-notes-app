import { Injectable } from '@angular/core';
import {NotesCloudService} from "./notes-cloud.service";
import {take} from "rxjs";
import {UserService} from "../user/user.service";
import {Note} from "../../model/note.model";
import {NotesLocalService} from "./notes-local.service";
import {Platform} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  constructor(
    private userService: UserService,
    private notesCloudService: NotesCloudService,
    private notesLocalService: NotesLocalService,
    private platform: Platform
  ) { }

  private isMobile() {
    return this.platform.is('mobile') ||
      this.platform.is('android') ||
      this.platform.is('ios')
  }

  /*loadNotesFromCloud() {
    this.notesCloudService.userNotes$.pipe(take(1)).subscribe(async notes => {
      const addedNotes: Note[] = []
      const updatedNotes: Note[] = []
      const deletedNotesLocalIds: number[] = []
      for (const note of notes) {
        if (this.noteHasBeenAddedToCloud(note)) {
          addedNotes.push(note)
        } else if (await this.noteHasBeenUpdatedInCloud(note)) {
          updatedNotes.push(note)
        } else if (this.noteHasBeenDeletedFromCloud(note)) {
          if (note.localId) deletedNotesLocalIds.push(note.localId)
        }
      }
      await this.updateLocalDatabase(addedNotes, updatedNotes, deletedNotesLocalIds)
    })
  }

  private noteHasBeenAddedToCloud(note: Note): boolean {
    return !note.localId
  }

  private async noteHasBeenUpdatedInCloud(note: Note): Promise<boolean> {
    const localNote = await this.notesLocalService.getNoteByLocalId(note.localId!)
    return localNote!.lastUpdateTimestamp < note.lastUpdateTimestamp
  }

  private async noteHasBeenDeletedFromCloud(note: Note): boolean {
    const localNotes = await this.notesLocalService.getNotes()

  }

  private async updateLocalDatabase(
    addedNotes: Note[],
    updatedNotes: Note[],
    deletedNotesLocalIds: number[]
  ) {
    await this.notesLocalService.addNotes(addedNotes)
    await this.notesLocalService.updateNotes(updatedNotes)
    await this.notesLocalService.deleteNotes(deletedNotesLocalIds)
  }

  storeNotesToCloud() {

  }*/
}
