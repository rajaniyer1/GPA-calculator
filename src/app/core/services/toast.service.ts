import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    tone: 'success' | 'info' | 'error';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
    readonly toasts = signal<Toast[]>([]);

    show(message: string, tone: Toast['tone'] = 'info', duration = 2500): void {
        const id = Date.now() + Math.random();
        this.toasts.update((list) => [...list, { id, message, tone }]);
        setTimeout(() => this.dismiss(id), duration);
    }

    dismiss(id: number): void {
        this.toasts.update((list) => list.filter((t) => t.id !== id));
    }
}
