import { Course } from './course.model';

export interface Semester {
    id: string;
    name: string;
    courses: Course[];
    createdAt: number;
    updatedAt: number;
}

export function createSemester(name: string): Semester {
    const now = Date.now();
    return {
        id: `sem-${now}-${Math.floor(Math.random() * 1000)}`,
        name,
        courses: [],
        createdAt: now,
        updatedAt: now
    };
}
