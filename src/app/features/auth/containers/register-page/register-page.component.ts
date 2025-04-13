import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { RegisterRequest } from '../../../../models/auth.model';
import { NotificationService } from '../../../../services/notification.service';
import { MaterialModule } from '../../../../shared/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  imports: [MaterialModule, CommonModule, FormsModule],
})
export class RegisterPageComponent {
  form: RegisterRequest = { email: '', username: '', password: '' };
  error: string | null = null;
  success: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
 

  onSubmit(): void {
    this.error = null;
    this.success = null;
  
    this.authService.register(this.form).subscribe({
      next: () => {
        this.notificationService.success('Registration successful');
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: (err) => {
        console.error('[Register Error]', err);
        this.notificationService.error(err?.error?.message || 'Registration failed.');
      }
    });
  }
  
  
  
}
