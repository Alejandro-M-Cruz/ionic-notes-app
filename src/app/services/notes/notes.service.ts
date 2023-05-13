import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore, getDoc,
  query,
  setDoc, updateDoc,
  where
} from "@angular/fire/firestore";
import {firstValueFrom, map, Observable} from "rxjs";
import {Note, NotesSortingMethod} from "../../model/note.model";
import {UserService} from "../user/user.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesCollection = collection(this.firestore, 'notes')
  private userNotes$?: Observable<Note[]>

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

  private loadUserNotesFromFirestore() {
    const q = query(
      this.notesCollection,
      where('userId', '==', this.userService.currentUser!.uid)
    )
    this.userNotes$ = collectionData(q, {idField: 'id'}).pipe(
      map(userNotes => userNotes.map(this.firestoreDocDataToNote))
    )
  }

  getNoteById(noteId: string): Promise<Note> {
    return getDoc(doc(this.notesCollection, noteId))
      .then(doc => this.firestoreDocDataToNote(doc.data()))
  }

  getUserNotes$(favouritesOnly: boolean = false, sortingMethod?: NotesSortingMethod): Observable<Note[]> {
    if (!this.userNotes$)
      this.loadUserNotesFromFirestore()
    const userNotes$ = favouritesOnly ?
      this.userNotes$!.pipe(map(userNotes => userNotes.filter(note => note.isFavourite))) :
      this.userNotes$!
    return userNotes$.pipe(
      map(userNotes => userNotes.sort(this.getSortFunction(sortingMethod))),
    )
  }

  getUserNotesQuantity$(favouritesOnly: boolean = false): Observable<number> {
    return this.getUserNotes$(favouritesOnly).pipe(map(userNotes => userNotes.length))
  }

  private getSortFunction(sortingMethod?: NotesSortingMethod): any {
    switch(sortingMethod) {
      case NotesSortingMethod.LAST_UPDATED_FIRST:
        return (a: Note, b: Note) => b.lastUpdateTimestamp.getTime() - a.lastUpdateTimestamp.getTime()
      case NotesSortingMethod.LAST_UPDATED_LAST:
        return (a: Note, b: Note) => a.lastUpdateTimestamp.getTime() - b.lastUpdateTimestamp.getTime()
      default:
        return this.getSortFunction(NotesSortingMethod.DEFAULT)
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

  async deleteAllUserNotes() {
    const userNotes = await firstValueFrom(this.getUserNotes$(false))
    for (const note of userNotes)
      await this.deleteNote(note.id)
  }

  async deleteUserFavouriteNotes() {
    const userNotes = await firstValueFrom(this.getUserNotes$(true))
    for (const note of userNotes.filter(note => note.isFavourite))
      await this.deleteNote(note.id)
  }

  async updateNote(noteId: string, note: Note) {
    await setDoc(doc(this.notesCollection, noteId), {
      ...note,
      lastUpdateTimestamp: new Date()
    })
  }

  async toggleNoteIsFavourite(note: Note) {
    await updateDoc(doc(this.notesCollection, note.id), {
      isFavourite: !note.isFavourite
    })
  }
}
