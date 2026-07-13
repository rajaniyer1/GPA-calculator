import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppStoreService } from '../../core/services/app-store.service';
import { GpaCalculatorService } from '../../core/services/gpa-calculator.service';

@Component({
    selector: 'app-goal-tracker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './goal-tracker.component.html',
    styleUrl: './goal-tracker.component.css'
})
export class GoalTrackerComponent {
    private store = inject(AppStoreService);
    private gpaCalc = inject(GpaCalculatorService);

    readonly settings = this.store.settings;
    readonly cumulative = this.store.cumulativeResult;

    readonly targetGpa = computed<number>(() => this.settings().goalGpa ?? 4.0);
    readonly futureCredits = signal(6);

    readonly currentGpa = computed(() => this.cumulative().weightedGpa);
    readonly currentCredits = computed(() => this.cumulative().totalCredits);

    readonly requiredGpa = computed(() =>
        this.gpaCalc.requiredGpa(this.currentGpa(), this.currentCredits(), this.targetGpa(), this.futureCredits())
    );

    readonly nearestGrade = computed(() => {
        const required = this.requiredGpa();
        if (required === null) return null;
        return this.gpaCalc.nearestGrade(required, this.settings().gradeScale);
    });

    readonly status = computed<'no-credits' | 'already-there' | 'impossible' | 'on-track'>(() => {
        const required = this.requiredGpa();
        if (required === null) return 'no-credits';
        const maxPoints = Math.max(...this.settings().gradeScale.map((g) => g.points));
        if (required <= 0) return 'already-there';
        if (required > maxPoints) return 'impossible';
        return 'on-track';
    });

    setTargetGpa(value: string): void {
        const num = Number(value);
        this.store.setGoalGpa(Number.isNaN(num) ? null : num);
    }

    setFutureCredits(value: string): void {
        const num = Number(value);
        this.futureCredits.set(Number.isNaN(num) ? 0 : num);
    }
}
