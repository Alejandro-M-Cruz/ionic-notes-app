import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {Note, NoteDisplayOptions} from "../../model/note.model";
import {UserService} from "../user/user.service";
import {serverTimestamp} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class NotesCloudService {
  private notesCollection = collection(this.firestore, 'notes')

  constructor(private firestore: Firestore, private userService: UserService) {}

  getUserNotes$(option: NoteDisplayOptions): Observable<Note[]> {
    const q = query(
      this.notesCollection,
      where('userId', '==', this.userService.currentUser!),
      orderBy('lastUpdateTimestamp'),
      option === NoteDisplayOptions.FAVOURITES ?
        where('isFavourite', '==', true) :
        orderBy('isFavourite', 'desc')
    )
    return collectionData(q, {idField: 'id'}) as Observable<Note[]>
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
