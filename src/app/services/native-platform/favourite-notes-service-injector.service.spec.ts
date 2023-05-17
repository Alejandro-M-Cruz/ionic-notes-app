import { TestBed } from '@angular/core/testing';

import { FavouriteNotesServiceInjectorService } from './favourite-notes-service-injector.service';

describe('NotesSyncService', () => {
  let service: FavouriteNotesServiceInjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavouriteNotesServiceInjectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
