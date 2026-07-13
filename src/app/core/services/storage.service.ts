import { Injectable } from '@angular/core';
import { createSemester, Semester } from '../models/semester.model';
import { AppSettings, defaultGradeScale, defaultSettings } from '../models/settings.model';

const SEMESTERS_KEY = 'gpa.semesters';
const ACTIVE_SEMESTER_KEY = 'gpa.activeSemesterId';
const SETTINGS_KEY = 'gpa.settings';
const LEGACY_KEY = 'dataSource';

export interface PersistedState {
    semesters: Semester[];
    activeSemesterId: string | null;
    settings: AppSettings;
}

/**
 * Thin, typed wrapper around localStorage. Corrupt/missing data always falls back to
 * sane defaults instead of throwing, since a parse failure shouldn't brick the app.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
    load(): PersistedState {
        const semesters = this.readJson<Semester[]>(SEMESTERS_KEY);
        const activeSemesterId = localStorage.getItem(ACTIVE_SEMESTER_KEY);
        const settings = this.readJson<AppSettings>(SETTINGS_KEY);

        if (semesters && semesters.length) {
            return {
                semesters,
                activeSemesterId: activeSemesterId && semesters.some((s) => s.id === activeSemesterId)
                    ? activeSemesterId
                    : semesters[0].id,
                settings: settings ?? defaultSettings()
            };
        }

        const migrated = this.migrateLegacyData();
        if (migrated) {
            return { semesters: [migrated], activeSemesterId: migrated.id, settings: settings ?? defaultSettings() };
        }

        const fresh = createSemester('Semester 1');
        return { semesters: [fresh], activeSemesterId: fresh.id, settings: settings ?? defaultSettings() };
    }

    save(state: PersistedState): void {
        localStorage.setItem(SEMESTERS_KEY, JSON.stringify(state.semesters));
        if (state.activeSemesterId) {
            localStorage.setItem(ACTIVE_SEMESTER_KEY, state.activeSemesterId);
        }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
    }

    private migrateLegacyData(): Semester | null {
        const raw = localStorage.getItem(LEGACY_KEY);
        if (!raw) return null;
        try {
            const legacyCourses = JSON.parse(raw);
            if (!Array.isArray(legacyCourses) || !legacyCourses.length) return null;

            const defaultScale = defaultGradeScale();
            const semester = createSemester('Semester 1');
            semester.courses = legacyCourses.map((c: any) => ({
                id: c.id ?? Date.now() + Math.random(),
                name: c.name ?? '',
                // Legacy data stored the grade as a stringified point value. Best-effort recovery
                // against the (unedited) default scale; falls back to null if it can't be matched.
                grade: defaultScale.find((g) => g.points.toString() === c.grade)?.label ?? null,
                credits: typeof c.credits === 'number' ? c.credits : null,
                category: c.weight === 'Honors' || c.weight === 'AP' ? c.weight : 'Regular'
            }));
            return semester;
        } catch {
            return null;
        }
    }

    private readJson<T>(key: string): T | null {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }
}
