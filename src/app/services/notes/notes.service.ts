import {inject, Injectable} from '@angular/core';
import {
  addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, updateDoc, where
} from "@angular/fire/firestore";
import {firstValueFrom, map, Observable} from "rxjs";
import {Note, NotesFilteringOption, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../user/user.service";
import {LocalNotesService} from "./local-notes.service";
import {Capacitor} from "@capacitor/core";
import {NetworkService} from "../network/network.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesCollection = collection(this.firestore, 'notes')
  private favouriteNotesService?: LocalNotesService

  constructor(
    private firestore: Firestore,
    private userService: UserService,
    private networkService: NetworkService
  ) {
    if (Capacitor.isNativePlatform())
      this.favouriteNotesService = inject(LocalNotesService)
  }

  private firestoreDocDataToNote = (docData: any): Note => {
    return {
      ...docData,
      creationTimestamp: docData.creationTimestamp.toDate(),
      lastUpdateTimestamp: docData.lastUpdateTimestamp.toDate(),
    }
  }

  getNoteById(noteId: string): Observable<Note | undefined> {
    return docData(doc(this.notesCollection, noteId), {idField: 'id'}).pipe(
      map(docData => docData ? this.firestoreDocDataToNote(docData) : undefined)
    )
  }

  getUserNotes$(displayOption?: NotesFilteringOption, sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    const queryConstraints = [where('userId', '==', this.userService.currentUser!.uid)]
    const displayOptionFilter = this.getQueryConstraints(displayOption)
    if (displayOptionFilter)
      queryConstraints.push(displayOptionFilter)
    queryConstraints.push(this.getSortingFunction(sortingMethod))
    return collectionData(query(this.notesCollection, ...queryConstraints), {idField: 'id'})
      .pipe(map(notes => notes.map(this.firestoreDocDataToNote)))
  }

  getUserNotesQuantity$(displayOption?: NotesFilteringOption): Observable<number> {
    return this.getUserNotes$(displayOption).pipe(map(userNotes => userNotes.length))
  }

  private getQueryConstraints(filteringOption?: NotesFilteringOption): any {
    switch (filteringOption) {
      case NotesFilteringOption.ALL:
        return null
      case NotesFilteringOption.FAVOURITES:
        return where('isFavourite', '==', true)
      case NotesFilteringOption.EXCEPT_FAVOURITES:
        return where('isFavourite', '==', false)
      default:
        return this.getQueryConstraints(NotesFilteringOption.DEFAULT)
    }
  }

  private getSortingFunction(sortingMethod?: NotesSortingMethod): any {
    switch (sortingMethod) {
      case NotesSortingMethod.LAST_UPDATED_FIRST:
        return orderBy('lastUpdateTimestamp', 'desc')
      case NotesSortingMethod.LAST_UPDATED_LAST:
        return orderBy('lastUpdateTimestamp', 'asc')
      default:
        return this.getSortingFunction(NotesSortingMethod.DEFAULT)
    }
  }

  async addNote(note: Note) {
    const now = new Date()
    await addDoc(this.notesCollection, {
      title: note.title,
      content: note.content,
      isFavourite: note.isFavourite ?? false,
      creationTimestamp: now,
      lastUpdateTimestamp: now,
      userId: this.userService.currentUser!.uid
    })
    await this.storeFavouriteNotesLocally()
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
  }

  async deleteUserNotesExceptFavourites() {
    const userNotesExceptFavourites = await firstValueFrom(
      this.getUserNotes$(NotesFilteringOption.EXCEPT_FAVOURITES)
    )
    for (const note of userNotesExceptFavourites)
      await this.deleteNote(note.id!)
    await this.storeFavouriteNotesLocally()
  }

  async deleteUserFavouriteNotes() {
    const userFavouriteNotes = await firstValueFrom(
      this.getUserNotes$(NotesFilteringOption.FAVOURITES)
    )
    for (const note of userFavouriteNotes)
      await this.deleteNote(note.id!)
    await this.storeFavouriteNotesLocally()
  }

  async updateNote(noteId: string, note: Note) {
    await updateDoc(doc(this.notesCollection, noteId), {
      ...note,
      lastUpdateTimestamp: new Date()
    })
    await this.storeFavouriteNotesLocally()
  }

  async toggleNoteIsFavourite(note: Note) {
    await updateDoc(doc(this.notesCollection, note.id!), {
      isFavourite: !note.isFavourite
    })
    await this.storeFavouriteNotesLocally()
  }

  private async storeFavouriteNotesLocally() {
    this.favouriteNotesService?.storeNotes(
      await firstValueFrom(this.getUserNotes$(NotesFilteringOption.FAVOURITES))
    )
  }

  storeFavouriteNotesLocallyWhenUserChanges() {
    this.userService.currentUser$.subscribe(async user => {
      if (user && await this.networkService.isConnected())
        await this.storeFavouriteNotesLocally()
    })
  }
}
