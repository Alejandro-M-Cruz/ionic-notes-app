import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query, setDoc,
  where
} from "@angular/fire/firestore";
import {BehaviorSubject, map, Observable} from "rxjs";
import {Note} from "../model/note.model";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class NotesService {
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
      orderBy('creationTimestamp')
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
    await addDoc(this.notesCollection, note)
  }

  async deleteNote(noteId: string) {
    await deleteDoc(doc(this.notesCollection, noteId))
  }

  async updateNote(noteId: string, note: Note) {
    await setDoc(doc(this.notesCollection, noteId), note)
  }
}
