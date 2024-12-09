import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Course } from './course.model';
@Component({
    selector: 'app-gradepointcalc',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './gradepointcalc.component.html',
    styleUrl: './gradepointcalc.component.css'
})
export class GradepointcalcComponent {
    grades = [
        // this the default weights
        { label: 'A', value: 4.0 },
        { label: 'A-', value: 3.67 },
        { label: 'B+', value: 3.33 },
        { label: 'B', value: 3.0 },
        { label: 'B-', value: 2.67 },
        { label: 'C+', value: 2.33 },
        { label: 'C', value: 2.0 },
        { label: 'C-', value: 1.67 },
        { label: 'D+', value: 1.0 },
        { label: 'D', value: 1.0 },
        { label: 'D-', value: 1.0 },
        { label: 'F', value: 0.0 }
    ];

    gradeWeights = [
        // this the one the user changes
        { label: 'A', value: 4.0 },
        { label: 'A-', value: 3.67 },
        { label: 'B+', value: 3.33 },
        { label: 'B', value: 3.0 },
        { label: 'B-', value: 2.67 },
        { label: 'C+', value: 2.33 },
        { label: 'C', value: 2.0 },
        { label: 'C-', value: 1.67 },
        { label: 'D+', value: 1.0 },
        { label: 'D', value: 1.0 },
        { label: 'D-', value: 1.0 },
        { label: 'F', value: 0.0 }
    ];
    courseWeights = ['Regular', 'Honors', 'AP'];

    // courses = [{ name: '', grade: '', credits: null, weight: 'Regular' }];
    courses: Course[] = JSON.parse(localStorage.getItem('dataSource') || '[]');
    
    weights = {
        AP: 1.0, // default ap weight
        Honors: 0.5 // default honrs weight
    };

    gpa: number | null = null;
    unweightedGpa: number | null = null;
    editGradePoints = false;
    toggleDarkMode(): void {
        console.log('dark mode');
        document.body.classList.toggle('dark-mode');
    }
    addCourse(): void {
        this.courses.push({
            //unshift
            id: Date.now(),
            name: '',
            grade: '',
            credits: null,
            weight: 'Regular'
        });
    }

    removeCourse(index: number): void {
        this.courses.splice(index, 1);
    }

    toggleEditGradePoints(): void {
        this.editGradePoints = !this.editGradePoints;
    }

    saveGradePoints(): void {
        this.editGradePoints = false;
        // gonna add extra validation maybe
    }

    calculateGPA(): void {
        let totalWeightedGradePoints = 0;
        let totalGradePoints = 0;
        let totalCredits = 0;

        for (const course of this.courses) {
            if (course.grade && course.credits) {
                this.syncGradesAndWeights(); //dont get rid of this
                const letterGrade = this.grades.find(
                    (g) => g.value.toString() === course.grade
                )?.label;

                let gradeValue =
                    this.gradeWeights.find((g) => g.label === letterGrade)
                        ?.value ?? 0;
                let unweightedGradeValue =
                    this.gradeWeights.find((g) => g.label === letterGrade)
                        ?.value ?? 0;
                // let gradeValue = parseFloat(course.grade)
                //parseFloat(course.grade);
                // console.log(course.grade);
                gradeValue = this.applyWeighting(
                    gradeValue,
                    course.weight,
                    course.grade
                );
                totalWeightedGradePoints += gradeValue * course.credits;
                totalGradePoints += unweightedGradeValue * course.credits;
                totalCredits += course.credits;
                localStorage.setItem(
                    'dataSource',
                    JSON.stringify(this.courses)
                );
                
            }
        }

        this.gpa = totalCredits
            ? totalWeightedGradePoints / totalCredits
            : null;
        this.unweightedGpa = totalCredits
            ? totalGradePoints / totalCredits
            : null;
    }
    applyWeighting(
        gradePointAvg: number,
        weight: string,
        grade: string
    ): number {
        // console.log(grade);
        const courseWeight = weight as 'Regular' | 'Honors' | 'AP';
        if (grade === '1' || grade === '0') {
            return gradePointAvg;
        } else if (courseWeight === 'Honors') {
            return gradePointAvg + this.weights.Honors;
        } else if (courseWeight === 'AP') {
            return gradePointAvg + this.weights.AP;
        } else {
            return gradePointAvg;
        }
    }
    syncGradesAndWeights(): void {
        for (let i = 0; i < this.grades.length; i++) {
            this.grades[i].label =
                this.gradeWeights[i]?.label || this.grades[i].label;
        }
    }
}
