import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../../services/auth.service';
import { NotificationService } from '../../../../../../services/notification.service';


@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;
  
    this.authService.login(this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.notificationService.success('Login successful');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.notificationService.error('Login failed. Check credentials.');
      }
    });
  }
}
