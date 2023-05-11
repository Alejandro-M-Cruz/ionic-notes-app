import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotesWithoutFavouritesComponent } from './notes-without-favourites.component';

describe('NotesWithoutFavouritesComponent', () => {
  let component: NotesWithoutFavouritesComponent;
  let fixture: ComponentFixture<NotesWithoutFavouritesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesWithoutFavouritesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotesWithoutFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
