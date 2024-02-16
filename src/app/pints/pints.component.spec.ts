import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PintsComponent } from './pints.component';

describe('PintsComponent', () => {
  let component: PintsComponent;
  let fixture: ComponentFixture<PintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
