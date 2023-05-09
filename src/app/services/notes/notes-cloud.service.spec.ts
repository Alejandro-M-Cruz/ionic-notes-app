import { TestBed } from '@angular/core/testing';

import { NotesCloudService } from './notes-cloud.service';

describe('NotesService', () => {
  let service: NotesCloudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotesCloudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
