import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NotesService} from "../../services/notes/notes.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Note} from "../../model/note.model";

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
})
export class NoteEditorPage implements OnInit {
  noteId: string | null = null
  noteForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.maxLength(Note.MAX_TITLE_LENGTH)],
    content: ['', Validators.maxLength(Note.MAX_CONTENT_LENGTH)]
  })

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private notesService: NotesService
  ) { }

  async ngOnInit() {
    this.getNoteIdFromRouteParams()
    await this.loadNoteFormInitialValue()
  }

  private getNoteIdFromRouteParams() {
    this.noteId = this.route.snapshot.paramMap.get('noteId')
  }

  private async loadNoteFormInitialValue() {
    if (this.noteId)
      this.noteForm.patchValue(await this.notesService.getNoteById(this.noteId))
  }

  private async navigateToHome() {
    await this.router.navigate(['/home'])
  }

  async onCancelButtonClicked() {
    await this.navigateToHome()
  }

  private async createNote() {
    await this.notesService.addNote(this.noteForm.value as Note)
  }

  private async updateNote() {
    await this.notesService.updateNote(this.noteId!, this.noteForm.value as Note)
  }

  async onConfirmButtonClicked() {
    this.noteId ? await this.updateNote() : await this.createNote()
    await this.navigateToHome()
  }
}
