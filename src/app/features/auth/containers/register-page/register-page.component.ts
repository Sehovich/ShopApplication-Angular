import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { RegisterRequest } from '../../../../models/auth.model';
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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.register(this.form).subscribe({
      next: () => {
        this.success = 'Registration successful. Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: () => {
        this.error = 'Registration failed. Email may already exist.';
      }
    });
  }
}
