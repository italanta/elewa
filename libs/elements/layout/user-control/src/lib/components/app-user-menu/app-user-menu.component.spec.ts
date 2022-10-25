import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppUserMenuComponent } from './app-user-menu.component';

describe('AppUserMenuComponent', () => {
  let component: AppUserMenuComponent;
  let fixture: ComponentFixture<AppUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppUserMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
