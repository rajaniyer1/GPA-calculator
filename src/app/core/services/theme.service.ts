import { Injectable, computed, effect, signal } from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';

const THEME_KEY = 'gpa.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    readonly preference = signal<ThemePreference>(
        (localStorage.getItem(THEME_KEY) as ThemePreference) || 'system'
    );

    private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
    readonly systemPrefersDark = signal(this.media.matches);

    readonly resolvedTheme = computed<'light' | 'dark'>(() => {
        const pref = this.preference();
        return pref === 'system' ? (this.systemPrefersDark() ? 'dark' : 'light') : pref;
    });

    constructor() {
        this.media.addEventListener('change', (e) => this.systemPrefersDark.set(e.matches));

        effect(() => {
            document.documentElement.setAttribute('data-theme', this.resolvedTheme());
            localStorage.setItem(THEME_KEY, this.preference());
        });
    }

    setPreference(pref: ThemePreference): void {
        this.preference.set(pref);
    }

    toggle(): void {
        this.setPreference(this.resolvedTheme() === 'dark' ? 'light' : 'dark');
    }
}
