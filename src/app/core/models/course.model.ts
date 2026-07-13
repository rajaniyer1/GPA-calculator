export type CourseCategory = 'Regular' | 'Honors' | 'AP';

export interface Course {
    id: number;
    name: string;
    /** Letter grade label, e.g. "A-". Null until the student picks one. */
    grade: string | null;
    credits: number | null;
    category: CourseCategory;
}

export function createCourse(): Course {
    return {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: '',
        grade: null,
        credits: null,
        category: 'Regular'
    };
}
