import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfilePhotoModifierComponent } from './profile-photo-modifier.component';

describe('ProfilePhotoModifierComponent', () => {
  let component: ProfilePhotoModifierComponent;
  let fixture: ComponentFixture<ProfilePhotoModifierComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilePhotoModifierComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePhotoModifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
