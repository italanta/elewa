import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenendedQuestionBlockComponent } from './openended-question-block.component';

describe('OpenendedQuestionBlockComponent', () => {
  let component: OpenendedQuestionBlockComponent;
  let fixture: ComponentFixture<OpenendedQuestionBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenendedQuestionBlockComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpenendedQuestionBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
