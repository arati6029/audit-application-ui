import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Form,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzTableModule,
    NzButtonModule,
    NzSpaceModule,
    NzMessageModule,
    ReactiveFormsModule,
    NzCardModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css',
})
export class UserFormComponent {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
    });
  }
  onSubmit(): void {
    if (this.userForm.valid) {
      console.log('User data:', this.userForm.value);
      this.api.createUser(this.userForm.value).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          // Handle successful user creation (e.g., show a success message)
          window.location.href = '/login';
        },
        error: (error) => {
          console.error('Error creating user:', error);
          // Handle error (e.g., show an error message)
        },
      });
      // Handle form submission, e.g., send data to API
    } else {
      this.userForm.markAllAsTouched();
    }
  }
  onCancel(): void {
    // Handle cancel action, e.g., navigate back or reset the form
    this.userForm.reset();
    window.location.href = '/login';
  }
}
