import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSurveyModalComponent } from './delete-survey-modal.component';

describe('DeleteSurveyModalComponent', () => {
  let component: DeleteSurveyModalComponent;
  let fixture: ComponentFixture<DeleteSurveyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteSurveyModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSurveyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
