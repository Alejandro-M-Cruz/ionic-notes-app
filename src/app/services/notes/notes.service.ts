import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc, docData,
  Firestore, getDoc, orderBy,
  query,
  setDoc, updateDoc,
  where
} from "@angular/fire/firestore";
import {firstValueFrom, map, Observable} from "rxjs";
import {Note} from "../../model/note.model";
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
      where('userId', '==', this.userService.currentUser!.uid),
      orderBy('lastUpdateTimestamp', 'desc')
    )
    this.userNotes$ = collectionData(q, {idField: 'id'}).pipe(
    map(userNotes => userNotes.map(this.firestoreDocDataToNote))
    ) as Observable<Note[]>
  }

  getNoteById(noteId: string): Promise<Note> {
    return getDoc(doc(this.notesCollection, noteId))
      .then(doc => this.firestoreDocDataToNote(doc.data()))
  }

  getUserNotes$(): Observable<Note[]> {
    if (!this.userNotes$)
      this.loadUserNotesFromFirestore()
    return this.userNotes$!
  }

  getUserFavouriteNotes$(): Observable<Note[]> {
    if (!this.userNotes$)
      this.loadUserNotesFromFirestore()
    return this.userNotes$!.pipe(
      map(userNotes => userNotes.filter(note => note.isFavourite))
    )
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
    const userNotes = await firstValueFrom(this.getUserNotes$())
    for (const note of userNotes)
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
