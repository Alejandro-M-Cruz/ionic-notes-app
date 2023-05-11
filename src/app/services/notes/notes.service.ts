import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore, orderBy,
  query,
  setDoc,
  where
} from "@angular/fire/firestore";
import {BehaviorSubject, map, Observable, Subscription, tap} from "rxjs";
import {Note} from "../../model/note.model";
import {UserService} from "../user/user.service";
import {serverTimestamp} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private notesCollection = collection(this.firestore, 'notes')
  userNotes$ = new BehaviorSubject([] as Note[])
  userNotesSubscription?: Subscription

  constructor(
    private firestore: Firestore,
    private userService: UserService
  ) {
    this.loadUserNotes()
  }

  private loadUserNotes() {
    this.userNotesSubscription = this.loadUserNotesFromFirestore$().subscribe(userNotes => {
      this.userNotes$.next(userNotes)
    })
  }

  private firestoreDocDataToNote = (docData: any): Note => {
    return {
      ...docData,
      creationTimestamp: docData.creationTimestamp.toDate(),
      lastUpdateTimestamp: docData.lastUpdateTimestamp.toDate(),
    }
  }

  private loadUserNotesFromFirestore$(): Observable<Note[]> {
    const q = query(
      this.notesCollection,
      where('userId', '==', this.userService.currentUser!.uid),
      orderBy('lastUpdateTimestamp', 'desc')
    )
    return collectionData(q, {idField: 'id'}).pipe(
      map(userNotes => userNotes.map(this.firestoreDocDataToNote))
    ) as Observable<Note[]>
  }

  getUserNotes$(): Observable<Note[]> {
    return this.userNotes$.pipe(tap(notes => console.log(notes)))
  }

  async addNote(note: Note) {
    const now = serverTimestamp()
    await addDoc(this.notesCollection, {
      title: note.title,
      content: note.content,
      creationTimestamp: now,
      lastUpdateTimestamp: now,
      userId: this.userService.currentUser!.uid
    })
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
  }

  async updateNote(noteId: string, note: Note) {
    await setDoc(doc(this.notesCollection, noteId), {
      ...note,
      lastUpdateTimestamp: serverTimestamp()
    })
  }

  destroySubscriptions(): void {
    this.userNotesSubscription?.unsubscribe()
  }
}
