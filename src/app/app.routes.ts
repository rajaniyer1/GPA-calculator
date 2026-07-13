import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./features/calculator/calculator.component').then((m) => m.CalculatorComponent)
    },
    {
        path: 'history',
        loadComponent: () => import('./features/history/history.component').then((m) => m.HistoryComponent)
    },
    {
        path: 'goals',
        loadComponent: () =>
            import('./features/goal-tracker/goal-tracker.component').then((m) => m.GoalTrackerComponent)
    },
    // Preserve old bookmarks/links from the previous version of the app.
    { path: 'gpa-calculator', redirectTo: '' },
    { path: '**', redirectTo: '' }
];
