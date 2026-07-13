import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    templateUrl: './toast.component.html',
    styleUrl: './toast.component.css'
})
export class ToastComponent {
    private toastService = inject(ToastService);
    toasts = this.toastService.toasts;

    dismiss(id: number): void {
        this.toastService.dismiss(id);
    }
}
