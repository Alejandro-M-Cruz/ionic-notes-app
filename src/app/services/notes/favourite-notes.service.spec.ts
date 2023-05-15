import { TestBed } from '@angular/core/testing';

import { FavouriteNotesService } from './favourite-notes.service';

describe('OfflineNotesService', () => {
  let service: FavouriteNotesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteNotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
