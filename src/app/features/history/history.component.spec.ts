import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HistoryComponent } from './history.component';

describe('HistoryComponent', () => {
  let component: HistoryComponent;
  let fixture: ComponentFixture<HistoryComponent>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HistoryComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a new semester', () => {
    const before = component.summaries().length;
    component.newSemesterName.set('Spring 2027');
    component.addSemester();
    expect(component.summaries().length).toBe(before + 1);
  });
});
