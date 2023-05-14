import { TestBed } from '@angular/core/testing';

import { OnlineNotesService } from './online-notes.service';

describe('NotesService', () => {
  let service: OnlineNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
