import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbacusIconButtonComponent } from './abacus-icon-button.component';

describe('AbacusIconButtonComponent', () => {
  let component: AbacusIconButtonComponent;
  let fixture: ComponentFixture<AbacusIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbacusIconButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbacusIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
