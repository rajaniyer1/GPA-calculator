import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoalTrackerComponent } from './goal-tracker.component';

describe('GoalTrackerComponent', () => {
  let component: GoalTrackerComponent;
  let fixture: ComponentFixture<GoalTrackerComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [GoalTrackerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GoalTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reports no-credits status when no future credits are planned', () => {
    component.setFutureCredits('0');
    expect(component.status()).toBe('no-credits');
  });
});
