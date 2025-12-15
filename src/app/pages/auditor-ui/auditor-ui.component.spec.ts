import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorUiComponent } from './auditor-ui.component';

describe('AuditorUiComponent', () => {
  let component: AuditorUiComponent;
  let fixture: ComponentFixture<AuditorUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditorUiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
