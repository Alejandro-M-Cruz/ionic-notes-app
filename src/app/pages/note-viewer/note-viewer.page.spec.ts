import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoteViewerPage } from './note-viewer.page';

describe('NoteViewerPage', () => {
  let component: NoteViewerPage;
  let fixture: ComponentFixture<NoteViewerPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NoteViewerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
