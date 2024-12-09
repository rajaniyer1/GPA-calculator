import { Component } from '@angular/core';
import { GradepointcalcComponent } from './gradepointcalc/gradepointcalc.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    selectedTab = 'gpaCalculator'; // Default selected tab

    // Select the active tab
    selectTab(tab: string) {
        this.selectedTab = tab; // Update the selected tab
    }
}
