import { Injectable, computed, effect, signal } from '@angular/core';
import { Course, createCourse } from '../models/course.model';
import { createSemester, Semester } from '../models/semester.model';
import { AppSettings, defaultSettings, GpaMode } from '../models/settings.model';
import { GpaCalculatorService } from './gpa-calculator.service';
import { StorageService } from './storage.service';

/**
 * Single source of truth for semesters/settings. Signals drive the UI; an effect()
 * persists every change to localStorage, so there is no explicit "save" action anywhere.
 */
@Injectable({ providedIn: 'root' })
export class AppStoreService {
    private readonly initial = this.storage.load();

    readonly semesters = signal<Semester[]>(this.initial.semesters);
    readonly activeSemesterId = signal<string | null>(this.initial.activeSemesterId);
    readonly settings = signal<AppSettings>(this.initial.settings);

    readonly activeSemester = computed(
        () => this.semesters().find((s) => s.id === this.activeSemesterId()) ?? null
    );

    readonly activeResult = computed(() => {
        const semester = this.activeSemester();
        const { gradeScale, weightBonuses } = this.settings();
        return this.gpaCalc.calculate(semester?.courses ?? [], gradeScale, weightBonuses);
    });

    readonly cumulativeResult = computed(() => {
        const { gradeScale, weightBonuses } = this.settings();
        const allCourses = this.semesters().flatMap((s) => s.courses);
        return this.gpaCalc.calculate(allCourses, gradeScale, weightBonuses);
    });

    constructor(private storage: StorageService, private gpaCalc: GpaCalculatorService) {
        effect(() => {
            this.storage.save({
                semesters: this.semesters(),
                activeSemesterId: this.activeSemesterId(),
                settings: this.settings()
            });
        });
    }

    // --- Semesters -----------------------------------------------------

    addSemester(name: string): void {
        const semester = createSemester(name || `Semester ${this.semesters().length + 1}`);
        this.semesters.update((list) => [...list, semester]);
        this.activeSemesterId.set(semester.id);
    }

    renameSemester(id: string, name: string): void {
        this.semesters.update((list) =>
            list.map((s) => (s.id === id ? { ...s, name, updatedAt: Date.now() } : s))
        );
    }

    removeSemester(id: string): void {
        const remaining = this.semesters().filter((s) => s.id !== id);
        this.semesters.set(remaining.length ? remaining : [createSemester('Semester 1')]);
        if (this.activeSemesterId() === id) {
            this.activeSemesterId.set(this.semesters()[0]?.id ?? null);
        }
    }

    setActiveSemester(id: string): void {
        this.activeSemesterId.set(id);
    }

    resetSemester(id: string): void {
        this.semesters.update((list) =>
            list.map((s) => (s.id === id ? { ...s, courses: [], updatedAt: Date.now() } : s))
        );
    }

    resetAll(): void {
        const semester = createSemester('Semester 1');
        this.semesters.set([semester]);
        this.activeSemesterId.set(semester.id);
        this.settings.set(defaultSettings());
    }

    // --- Courses (on the active semester) ------------------------------

    addCourse(): void {
        const id = this.activeSemesterId();
        if (!id) return;
        this.updateSemesterCourses(id, (courses) => [...courses, createCourse()]);
    }

    removeCourse(courseId: number): void {
        const id = this.activeSemesterId();
        if (!id) return;
        this.updateSemesterCourses(id, (courses) => courses.filter((c) => c.id !== courseId));
    }

    updateCourse(courseId: number, patch: Partial<Course>): void {
        const id = this.activeSemesterId();
        if (!id) return;
        this.updateSemesterCourses(id, (courses) =>
            courses.map((c) => (c.id === courseId ? { ...c, ...patch } : c))
        );
    }

    private updateSemesterCourses(semesterId: string, fn: (courses: Course[]) => Course[]): void {
        this.semesters.update((list) =>
            list.map((s) =>
                s.id === semesterId ? { ...s, courses: fn(s.courses), updatedAt: Date.now() } : s
            )
        );
    }

    // --- Settings --------------------------------------------------------

    setPrimaryMode(mode: GpaMode): void {
        this.settings.update((s) => ({ ...s, primaryMode: mode }));
    }

    setGoalGpa(goal: number | null): void {
        this.settings.update((s) => ({ ...s, goalGpa: goal }));
    }

    updateGradePoint(label: string, points: number): void {
        this.settings.update((s) => ({
            ...s,
            gradeScale: s.gradeScale.map((g) => (g.label === label ? { ...g, points } : g))
        }));
    }

    updateWeightBonus(category: 'Honors' | 'AP', value: number): void {
        this.settings.update((s) => ({
            ...s,
            weightBonuses: { ...s.weightBonuses, [category]: value }
        }));
    }
}
