import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../../services/auth.service';
import { NotificationService } from '../../../../../../services/notification.service';


@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export class RegisterPageComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  register() {
    if (this.form.invalid) return;

    this.authService.register(this.form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.notificationService.success('Registration successful');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.notificationService.error('Registration failed');
      },
    });
  }
}