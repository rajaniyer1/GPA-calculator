import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradepointcalcComponent } from './gradepointcalc.component';

describe('GradepointcalcComponent', () => {
  let component: GradepointcalcComponent;
  let fixture: ComponentFixture<GradepointcalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradepointcalcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradepointcalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
