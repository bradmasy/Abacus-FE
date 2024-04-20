import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbacusBasicButtonComponent } from './abacus-basic-button.component';

describe('AbacusBasicButtonComponent', () => {
  let component: AbacusBasicButtonComponent;
  let fixture: ComponentFixture<AbacusBasicButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AbacusBasicButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AbacusBasicButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
