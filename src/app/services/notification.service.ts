import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, duration = 3000) {
    this.snackBar.open(message, 'OK', { duration });
  }

  error(message: string, duration = 4000) {
    this.snackBar.open(`❌ ${message}`, 'Dismiss', { duration });
  }

  success(message: string, duration = 3000) {
    this.snackBar.open(`✅ ${message}`, 'OK', { duration });
  }
}
