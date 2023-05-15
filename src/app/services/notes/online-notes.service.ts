import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {firstValueFrom, map, Observable} from "rxjs";
import {Note, NotesDisplayOption, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class OnlineNotesService {
  private notesCollection = collection(this.firestore, 'notes')

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {}

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

  getUserNotes$(displayOption?: NotesDisplayOption, sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    const queryConstraints = [where('userId', '==', this.userService.currentUser!.uid)]
    const displayOptionFilter = this.getDisplayOptionFilter(displayOption)
    if (displayOptionFilter)
      queryConstraints.push(displayOptionFilter)
    queryConstraints.push(this.getSortingFunction(sortingMethod))
    return collectionData(query(this.notesCollection, ...queryConstraints), {idField: 'id'})
      .pipe(map(notes => notes.map(this.firestoreDocDataToNote)))
  }

  getUserNotesQuantity$(displayOption?: NotesDisplayOption): Observable<number> {
    return this.getUserNotes$(displayOption).pipe(map(userNotes => userNotes.length))
  }

  private getDisplayOptionFilter(displayOption?: NotesDisplayOption): any {
    switch (displayOption) {
      case NotesDisplayOption.ALL:
        return null
      case NotesDisplayOption.FAVOURITES:
        return where('isFavourite', '==', true)
      default:
        return this.getDisplayOptionFilter(NotesDisplayOption.DEFAULT)
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
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
  }

  async deleteUserNotesExceptFavourites() {
    const userNotes = await firstValueFrom(this.getUserNotes$(NotesDisplayOption.ALL))
    for (const note of userNotes.filter(note => !note.isFavourite))
      await this.deleteNote(note.id!)
  }

  async deleteUserFavouriteNotes() {
    const userNotes = await firstValueFrom(this.getUserNotes$(NotesDisplayOption.FAVOURITES))
    for (const note of userNotes)
      await this.deleteNote(note.id!)
  }

  async updateNote(noteId: string, note: Note) {
    await updateDoc(doc(this.notesCollection, noteId), {
      ...note,
      lastUpdateTimestamp: new Date()
    })
  }

  async toggleNoteIsFavourite(note: Note) {
    await updateDoc(doc(this.notesCollection, note.id!), {
      isFavourite: !note.isFavourite
    })
  }
}
