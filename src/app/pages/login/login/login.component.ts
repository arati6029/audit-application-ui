import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // ✅ plural fixed (was `styleUrl`)
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // ✅ Added email validation
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);

      this.api.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          // ✅ Store session info
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('role', response.role);
          sessionStorage.setItem('userId', response.userId.toString());

          // ✅ Role-based redirect
          if (response.role === 'ADMIN') {
            window.location.href = '/pages/admin-ui';
          } else if (response.role === 'AUDITOR') {
            window.location.href = '/pages/audit-ui';
          } else {
            window.location.href = '/';
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
          alert('Invalid credentials or server error!');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  onRegister(): void {
    window.location.href = '/users/user-form';
  }
}
