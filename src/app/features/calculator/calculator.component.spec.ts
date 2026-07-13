import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a course to the active semester', () => {
    const before = component.semester()?.courses.length ?? 0;
    component.addCourse();
    expect(component.semester()?.courses.length).toBe(before + 1);
  });

  it('removes a course by id', () => {
    component.addCourse();
    const id = component.semester()!.courses[0].id;
    component.removeCourse(id);
    expect(component.semester()?.courses.some((c) => c.id === id)).toBeFalse();
  });
});
