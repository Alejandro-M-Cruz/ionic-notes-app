import { TestBed } from '@angular/core/testing';

import { OfflineNotesService } from './offline-notes.service';

describe('OfflineNotesService', () => {
  let service: OfflineNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
