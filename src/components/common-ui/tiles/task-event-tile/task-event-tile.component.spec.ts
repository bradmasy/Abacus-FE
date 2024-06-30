import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEventTileComponent } from './task-event-tile.component';

describe('TaskEventTileComponent', () => {
  let component: TaskEventTileComponent;
  let fixture: ComponentFixture<TaskEventTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskEventTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaskEventTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
