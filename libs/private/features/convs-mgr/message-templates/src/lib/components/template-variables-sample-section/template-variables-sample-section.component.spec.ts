import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateVariablesSampleSectionComponent } from './template-variables-sample-section.component';

describe('TemplateVariablesSampleSectionComponent', () => {
  let component: TemplateVariablesSampleSectionComponent;
  let fixture: ComponentFixture<TemplateVariablesSampleSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TemplateVariablesSampleSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TemplateVariablesSampleSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
