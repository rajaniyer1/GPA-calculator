import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
    @Input() title = 'Are you sure?';
    @Input() message = 'This action cannot be undone.';
    @Input() confirmLabel = 'Confirm';
    @Input() open = false;

    @Output() confirmed = new EventEmitter<void>();
    @Output() cancelled = new EventEmitter<void>();

    confirm(): void {
        this.confirmed.emit();
    }

    cancel(): void {
        this.cancelled.emit();
    }
}
