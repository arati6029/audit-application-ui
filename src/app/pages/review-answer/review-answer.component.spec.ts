import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAnswerComponent } from './review-answer.component';

describe('ReviewAnswerComponent', () => {
  let component: ReviewAnswerComponent;
  let fixture: ComponentFixture<ReviewAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewAnswerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
