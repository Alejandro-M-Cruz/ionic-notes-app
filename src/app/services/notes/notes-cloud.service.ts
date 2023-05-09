import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query, setDoc, updateDoc,
  where
} from "@angular/fire/firestore";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Note} from "../../model/note.model";
import {UserService} from "../user/user.service";
import {serverTimestamp} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class NotesCloudService {
  private notesCollection = collection(this.firestore, 'notes')
  private notes$ = new BehaviorSubject<Note[]>([])

  constructor(private firestore: Firestore, private userService: UserService) {
    this.loadUserNotes()
  }

  private loadUserNotes() {
    this.getUserNotesFromFirebase().subscribe(this.notes$)
  }

  private getUserNotesFromFirebase(): Observable<Note[]> {
    const q = query(
      this.notesCollection,
      where('userId', '==', this.userService.currentUser!),
      orderBy('lastUpdateTimestamp')
    )
    return collectionData(q, {idField: 'id'}) as Observable<Note[]>
  }

  get userNotes$(): Observable<Note[]> {
    return this.notes$
  }

  get userFavouriteNotes$(): Observable<Note[]> {
    return this.notes$.pipe(map(notes => notes.filter(note => note.isFavourite)))
  }

  async addNote(note: Note) {
    await addDoc(this.notesCollection, {
      title: note.title,
      content: note.content,
      isFavourite: note.isFavourite,
      lastUpdateTimestamp: note.lastUpdateTimestamp ?? serverTimestamp(),
      userId: this.userService.currentUser!.uid
    })
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
  }

  async updateNote(noteId: string, note: Note) {
    await setDoc(doc(this.notesCollection, noteId), note)
  }

  async setIfNoteIsFavourite(noteId: string, isFavourite: boolean) {
    await updateDoc(doc(this.notesCollection, noteId), {isFavourite})
  }

}
