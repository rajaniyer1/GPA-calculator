import { Injectable } from '@angular/core';
import { Course } from '../models/course.model';
import { GradePoint, NO_BONUS_GRADES, WeightBonuses } from '../models/settings.model';

export interface CourseBreakdownRow {
    course: Course;
    basePoints: number;
    bonus: number;
    weightedPoints: number;
    qualityPoints: number;
}

export interface GpaResult {
    weightedGpa: number | null;
    unweightedGpa: number | null;
    totalCredits: number;
    breakdown: CourseBreakdownRow[];
}

/**
 * All GPA math lives here so it can be reused for a single semester and for the
 * cumulative (all-semesters) calculation, and unit-tested independently of any component.
 */
@Injectable({ providedIn: 'root' })
export class GpaCalculatorService {
    /** Base grade points for a letter grade, looked up by label against the (possibly customized) scale. */
    pointsForGrade(label: string | null, scale: GradePoint[]): number | null {
        if (!label) return null;
        return scale.find((g) => g.label === label)?.points ?? null;
    }

    private bonusFor(category: Course['category'], grade: string, bonuses: WeightBonuses): number {
        if (NO_BONUS_GRADES.has(grade)) return 0;
        if (category === 'Honors') return bonuses.Honors;
        if (category === 'AP') return bonuses.AP;
        return 0;
    }

    calculate(courses: Course[], scale: GradePoint[], bonuses: WeightBonuses): GpaResult {
        let totalWeightedPoints = 0;
        let totalUnweightedPoints = 0;
        let totalCredits = 0;
        const breakdown: CourseBreakdownRow[] = [];

        for (const course of courses) {
            if (!course.grade || !course.credits) continue;
            const basePoints = this.pointsForGrade(course.grade, scale);
            if (basePoints === null) continue;

            const bonus = this.bonusFor(course.category, course.grade, bonuses);
            const weightedPoints = basePoints + bonus;
            const qualityPoints = weightedPoints * course.credits;

            totalWeightedPoints += qualityPoints;
            totalUnweightedPoints += basePoints * course.credits;
            totalCredits += course.credits;

            breakdown.push({ course, basePoints, bonus, weightedPoints, qualityPoints });
        }

        return {
            weightedGpa: totalCredits ? totalWeightedPoints / totalCredits : null,
            unweightedGpa: totalCredits ? totalUnweightedPoints / totalCredits : null,
            totalCredits,
            breakdown
        };
    }

    /**
     * Average grade points needed on `futureCredits` additional credits to reach `targetGpa`,
     * given the student currently holds `currentGpa` over `currentCredits`.
     * Returns null when there are no future credits to plan for.
     */
    requiredGpa(
        currentGpa: number | null,
        currentCredits: number,
        targetGpa: number,
        futureCredits: number
    ): number | null {
        if (futureCredits <= 0) return null;
        const currentPoints = (currentGpa ?? 0) * currentCredits;
        const totalCredits = currentCredits + futureCredits;
        const requiredPoints = targetGpa * totalCredits - currentPoints;
        return requiredPoints / futureCredits;
    }

    /** Nearest grade label (rounding down to what's achievable) for a given point value on a scale. */
    nearestGrade(points: number, scale: GradePoint[]): GradePoint | null {
        if (!scale.length) return null;
        const sorted = [...scale].sort((a, b) => b.points - a.points);
        const achievable = sorted.find((g) => g.points <= points);
        return achievable ?? sorted[sorted.length - 1];
    }
}
