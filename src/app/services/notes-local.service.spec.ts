import { TestBed } from '@angular/core/testing';

import { NotesLocalService } from './notes-local.service';

describe('NotesLocalService', () => {
  let service: NotesLocalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesLocalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
