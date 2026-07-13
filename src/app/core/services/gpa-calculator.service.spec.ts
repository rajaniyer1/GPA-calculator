import { Course } from '../models/course.model';
import { defaultGradeScale, defaultSettings } from '../models/settings.model';
import { GpaCalculatorService } from './gpa-calculator.service';

function course(partial: Partial<Course>): Course {
    return { id: Math.random(), name: '', grade: null, credits: null, category: 'Regular', ...partial };
}

describe('GpaCalculatorService', () => {
    let service: GpaCalculatorService;
    const scale = defaultGradeScale();
    const bonuses = defaultSettings().weightBonuses;

    beforeEach(() => {
        service = new GpaCalculatorService();
    });

    it('computes unweighted GPA as a straight credit-weighted average', () => {
        const courses = [
            course({ grade: 'A', credits: 3 }), // 4.0 * 3 = 12
            course({ grade: 'B', credits: 4 }) // 3.0 * 4 = 12
        ];
        const result = service.calculate(courses, scale, bonuses);
        expect(result.unweightedGpa).toBeCloseTo(24 / 7, 5);
        expect(result.totalCredits).toBe(7);
    });

    it('applies the Honors/AP bonus on top of base grade points', () => {
        const courses = [course({ grade: 'A', credits: 3, category: 'AP' })];
        const result = service.calculate(courses, scale, bonuses);
        // 4.0 base + 1.0 AP bonus = 5.0
        expect(result.weightedGpa).toBeCloseTo(5.0, 5);
        expect(result.unweightedGpa).toBeCloseTo(4.0, 5);
    });

    it('does not apply a weighting bonus to D or F grades, even in AP/Honors courses', () => {
        const courses = [course({ grade: 'F', credits: 3, category: 'AP' })];
        const result = service.calculate(courses, scale, bonuses);
        expect(result.weightedGpa).toBeCloseTo(0, 5);
    });

    it('ignores courses missing a grade or credits', () => {
        const courses = [course({ grade: null, credits: 3 }), course({ grade: 'A', credits: null })];
        const result = service.calculate(courses, scale, bonuses);
        expect(result.weightedGpa).toBeNull();
        expect(result.totalCredits).toBe(0);
    });

    it('returns null GPA when there are no credits at all', () => {
        const result = service.calculate([], scale, bonuses);
        expect(result.weightedGpa).toBeNull();
        expect(result.unweightedGpa).toBeNull();
    });

    it('computes the required average GPA to reach a target', () => {
        // Currently 3.0 over 10 credits, want 3.5 over 10 more credits.
        const required = service.requiredGpa(3.0, 10, 3.5, 10);
        // total needed = 3.5*20 - 3.0*10 = 70 - 30 = 40 over 10 credits = 4.0
        expect(required).toBeCloseTo(4.0, 5);
    });

    it('returns null required GPA when there are no future credits', () => {
        expect(service.requiredGpa(3.0, 10, 3.5, 0)).toBeNull();
    });

    it('finds the nearest achievable grade for a point value', () => {
        expect(service.nearestGrade(3.5, scale)?.label).toBe('B+');
        expect(service.nearestGrade(4.5, scale)?.label).toBe('A');
    });
});
