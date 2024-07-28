import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbacusDropdownButtonComponent } from './abacus-dropdown-button.component';

describe('AbacusDropdownButtonComponent', () => {
  let component: AbacusDropdownButtonComponent;
  let fixture: ComponentFixture<AbacusDropdownButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbacusDropdownButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbacusDropdownButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
