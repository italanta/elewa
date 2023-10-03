import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateFormDropdownComponent } from './template-form-dropdown.component';

describe('TemplateFormDropdownComponent', () => {
  let component: TemplateFormDropdownComponent;
  let fixture: ComponentFixture<TemplateFormDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateFormDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateFormDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
