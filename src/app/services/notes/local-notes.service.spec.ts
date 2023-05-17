import { TestBed } from '@angular/core/testing';

import { LocalNotesService } from './local-notes.service';

describe('OfflineNotesService', () => {
  let service: LocalNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
