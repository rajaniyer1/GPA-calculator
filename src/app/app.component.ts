import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    theme = inject(ThemeService);
    mobileMenuOpen = signal(false);

    toggleMobileMenu(): void {
        this.mobileMenuOpen.update((v) => !v);
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen.set(false);
    }
}
