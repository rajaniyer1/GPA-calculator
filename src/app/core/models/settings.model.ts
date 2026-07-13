export interface GradePoint {
    label: string;
    points: number;
}

export interface WeightBonuses {
    Honors: number;
    AP: number;
}

export type GpaMode = 'weighted' | 'unweighted';

export interface AppSettings {
    gradeScale: GradePoint[];
    weightBonuses: WeightBonuses;
    primaryMode: GpaMode;
    goalGpa: number | null;
}

/** Grades that never receive an Honors/AP bonus, preserved from the original calculator's rule. */
export const NO_BONUS_GRADES = new Set(['D+', 'D', 'D-', 'F']);

export function defaultGradeScale(): GradePoint[] {
    return [
        { label: 'A', points: 4.0 },
        { label: 'A-', points: 3.67 },
        { label: 'B+', points: 3.33 },
        { label: 'B', points: 3.0 },
        { label: 'B-', points: 2.67 },
        { label: 'C+', points: 2.33 },
        { label: 'C', points: 2.0 },
        { label: 'C-', points: 1.67 },
        { label: 'D+', points: 1.0 },
        { label: 'D', points: 1.0 },
        { label: 'D-', points: 1.0 },
        { label: 'F', points: 0.0 }
    ];
}

export function defaultSettings(): AppSettings {
    return {
        gradeScale: defaultGradeScale(),
        weightBonuses: { Honors: 0.5, AP: 1.0 },
        primaryMode: 'weighted',
        goalGpa: null
    };
}
