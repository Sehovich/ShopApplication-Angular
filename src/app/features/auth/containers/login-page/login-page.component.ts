import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from '../../../../models/auth.model';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../shared/material.module';
import { AuthStore } from '../../store/auth.store';
import { NotificationService } from '../../../../services/notification.service';



@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  imports: [CommonModule, FormsModule, MaterialModule],
})
export class LoginPageComponent {
  form: LoginRequest = { email: '', password: '' };
  error: string | null = null;
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}
 

  onSubmit(): void {
    this.authService.login(this.form).subscribe({
      next: (res) => {
        AuthStore.setToken(res.token);
        this.notificationService.success('Login successful');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        this.notificationService.error('Invalid email or password.');
      }
    });
  }
  
}
