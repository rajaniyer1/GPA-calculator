import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Semester } from '../../core/models/semester.model';
import { AppStoreService } from '../../core/services/app-store.service';
import { GpaCalculatorService } from '../../core/services/gpa-calculator.service';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';

interface SemesterSummary {
    semester: Semester;
    weightedGpa: number | null;
    unweightedGpa: number | null;
    credits: number;
}

@Component({
    selector: 'app-history',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmDialogComponent],
    templateUrl: './history.component.html',
    styleUrl: './history.component.css'
})
export class HistoryComponent {
    private store = inject(AppStoreService);
    private gpaCalc = inject(GpaCalculatorService);
    private toast = inject(ToastService);
    private router = inject(Router);

    readonly settings = this.store.settings;
    readonly cumulative = this.store.cumulativeResult;

    readonly summaries = computed<SemesterSummary[]>(() => {
        const { gradeScale, weightBonuses } = this.settings();
        return this.store
            .semesters()
            .map((semester) => {
                const result = this.gpaCalc.calculate(semester.courses, gradeScale, weightBonuses);
                return {
                    semester,
                    weightedGpa: result.weightedGpa,
                    unweightedGpa: result.unweightedGpa,
                    credits: result.totalCredits
                };
            })
            .sort((a, b) => b.semester.createdAt - a.semester.createdAt);
    });

    readonly newSemesterName = signal('');
    readonly renamingId = signal<string | null>(null);
    readonly renameValue = signal('');
    readonly deleteTarget = signal<Semester | null>(null);
    readonly confirmResetAllOpen = signal(false);

    addSemester(): void {
        this.store.addSemester(this.newSemesterName().trim());
        this.newSemesterName.set('');
        this.toast.show('Semester created', 'success');
    }

    openSemester(id: string): void {
        this.store.setActiveSemester(id);
        this.router.navigate(['/']);
    }

    startRename(semester: Semester): void {
        this.renamingId.set(semester.id);
        this.renameValue.set(semester.name);
    }

    saveRename(id: string): void {
        const value = this.renameValue().trim();
        if (value) this.store.renameSemester(id, value);
        this.renamingId.set(null);
    }

    cancelRename(): void {
        this.renamingId.set(null);
    }

    requestDelete(semester: Semester): void {
        this.deleteTarget.set(semester);
    }

    confirmDelete(): void {
        const target = this.deleteTarget();
        if (target) {
            this.store.removeSemester(target.id);
            this.toast.show(`${target.name} deleted`, 'info');
        }
        this.deleteTarget.set(null);
    }

    cancelDelete(): void {
        this.deleteTarget.set(null);
    }

    requestResetAll(): void {
        this.confirmResetAllOpen.set(true);
    }

    confirmResetAll(): void {
        this.store.resetAll();
        this.confirmResetAllOpen.set(false);
        this.toast.show('All data reset', 'info');
    }

    cancelResetAll(): void {
        this.confirmResetAllOpen.set(false);
    }

    exportAll(): void {
        const payload = {
            semesters: this.store.semesters(),
            settings: this.store.settings(),
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'gpa-history-backup.json';
        link.click();
        URL.revokeObjectURL(url);
        this.toast.show('Full history exported', 'success');
    }
}
