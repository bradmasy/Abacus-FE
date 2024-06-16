import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePartialComponent } from './schedule-partial.component';

describe('SchedulePartialComponent', () => {
  let component: SchedulePartialComponent;
  let fixture: ComponentFixture<SchedulePartialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulePartialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchedulePartialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
