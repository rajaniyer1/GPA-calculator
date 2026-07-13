import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Course, CourseCategory } from '../../core/models/course.model';
import { AppStoreService } from '../../core/services/app-store.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-calculator',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmDialogComponent],
    templateUrl: './calculator.component.html',
    styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
    private store = inject(AppStoreService);
    private toast = inject(ToastService);

    readonly categories: CourseCategory[] = ['Regular', 'Honors', 'AP'];

    readonly semester = this.store.activeSemester;
    readonly result = this.store.activeResult;
    readonly settings = this.store.settings;
    readonly gradeLabels = computed(() => this.settings().gradeScale.map((g) => g.label));

    readonly showBreakdown = signal(false);
    readonly showGradeScale = signal(false);
    readonly confirmResetOpen = signal(false);

    addCourse(): void {
        this.store.addCourse();
    }

    removeCourse(courseId: number): void {
        this.store.removeCourse(courseId);
    }

    updateName(course: Course, value: string): void {
        this.store.updateCourse(course.id, { name: value });
    }

    updateGrade(course: Course, value: string): void {
        this.store.updateCourse(course.id, { grade: value || null });
    }

    updateCredits(course: Course, value: string): void {
        const credits = value === '' ? null : Number(value);
        this.store.updateCourse(course.id, { credits });
    }

    updateCategory(course: Course, value: CourseCategory): void {
        this.store.updateCourse(course.id, { category: value });
    }

    setPrimaryMode(mode: 'weighted' | 'unweighted'): void {
        this.store.setPrimaryMode(mode);
    }

    toggleBreakdown(): void {
        this.showBreakdown.update((v) => !v);
    }

    toggleGradeScale(): void {
        this.showGradeScale.update((v) => !v);
    }

    updateGradePoint(label: string, value: string): void {
        const points = Number(value);
        if (!Number.isNaN(points)) this.store.updateGradePoint(label, points);
    }

    updateBonus(category: 'Honors' | 'AP', value: string): void {
        const points = Number(value);
        if (!Number.isNaN(points)) this.store.updateWeightBonus(category, points);
    }

    requestReset(): void {
        this.confirmResetOpen.set(true);
    }

    confirmReset(): void {
        const id = this.semester()?.id;
        if (id) this.store.resetSemester(id);
        this.confirmResetOpen.set(false);
        this.toast.show('Semester reset', 'info');
    }

    cancelReset(): void {
        this.confirmResetOpen.set(false);
    }

    async copySummary(): Promise<void> {
        const semester = this.semester();
        const result = this.result();
        if (!semester) return;

        const lines = [
            `${semester.name} — GPA Summary`,
            `Weighted GPA: ${result.weightedGpa?.toFixed(2) ?? '—'}`,
            `Unweighted GPA: ${result.unweightedGpa?.toFixed(2) ?? '—'}`,
            `Total credits: ${result.totalCredits}`,
            '',
            ...result.breakdown.map(
                (row) => `${row.course.name || 'Untitled'} — ${row.course.grade} (${row.course.credits} cr)`
            )
        ];

        try {
            await navigator.clipboard.writeText(lines.join('\n'));
            this.toast.show('Summary copied to clipboard', 'success');
        } catch {
            this.toast.show('Could not copy — clipboard unavailable', 'error');
        }
    }

    exportJson(): void {
        const semester = this.semester();
        if (!semester) return;
        const blob = new Blob([JSON.stringify(semester, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${semester.name.replace(/\s+/g, '-').toLowerCase() || 'semester'}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.toast.show('Semester exported', 'success');
    }

    printSummary(): void {
        window.print();
    }

    trackByCourseId(_index: number, course: Course): number {
        return course.id;
    }

    trackByLabel(_index: number, item: { label: string }): string {
        return item.label;
    }
}
