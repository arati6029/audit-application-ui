import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from '../../../service/api.service';

@Component({
  selector: 'app-add-question',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
  ],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css',
})
export class AddQuestionComponent {
  questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService,
    private api: ApiService
  ) {
    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.questionForm.valid) {
      console.log('Question saved:', this.questionForm.value);
      this.message.success('Question added successfully!');
      this.router.navigate(['/pages/question/question-list']);
    } else {
      this.message.error('Please enter a valid question.');
    }
  }

  cancel() {
    this.router.navigate(['/pages/question/question-list']);
  }
  saveQuestion() {
    if (this.questionForm.valid) {
      this.api.addQuestion(this.questionForm.value).subscribe({
        next: () => {
          this.message.success('Question added successfully!');
          this.router.navigate(['/pages/questions-list']);
        },
        error: () => {
          this.message.error('Failed to add question.');
        },
      });
    } else {
      this.message.error('Please enter a valid question.');
    }
  }
}
