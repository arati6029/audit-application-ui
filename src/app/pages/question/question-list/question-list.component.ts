import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ApiService } from '../../../service/api.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-question-list',
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzModalModule,
    NzSelectModule,
    NzIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './question-list.component.html',
  styleUrl: './question-list.component.css',
})
export class QuestionListComponent {
  // questions = [
  //   { text: 'Is audit documentation up to date?' },
  //   { text: 'Are financial records properly maintained?' },
  //   { text: 'Is data backup policy implemented?' },
  // ];
  questions: any[] = [];
  selectedQuestion: any;
  isAssignModalVisible: boolean = false;
  selectedUserId: number | null = null;
  auditors: any[] = [];
  assignForm!: FormGroup;
  questionAssignments: any[] = [];
  questionAssigned: any[] = [];
  constructor(
    private router: Router,
    private api: ApiService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}
  ngOnInit() {
    this.loadQuestions();
    this.assignForm = this.fb.group({
      auditor: [null],
      questionId: [null],
    });
  }
  loadQuestions() {
    this.api.getQuestions().subscribe({
      next: (data) => {
        this.questions = data;
      },
      error: () => {
        this.message.error('Failed to load questions.');
      },
    });
  }
  addQuestion() {
    this.router.navigate(['/pages/add-question']);
  }
  openAssignModal(question: any) {
    this.selectedQuestion = question;

    //get list of auditors
    this.api.getUsersWithRole('AUDITOR').subscribe({
      next: (data) => {
        this.auditors = data;
        //get all question assignments
        this.api.getAllAssignments().subscribe({
          next: (assignments) => {
            this.questionAssignments = assignments;
            this.questionAssigned = this.questionAssignments.filter(
              (qa) =>
                qa.question.questionId === this.selectedQuestion.questionId
            );
            if (this.questionAssigned.length > 0) {
              this.notification.info(
                'Info',
                'This question is already assigned to an auditor.'
              );
              return;
            } else {
              this.isAssignModalVisible = true;
            }
          },
          error: () => {
            this.message.error('Failed to load question assignments.');
          },
        });
      },
      error: () => {
        this.message.error('Failed to load auditors.');
      },
    });
  }
  handleAssignSave() {
    if (!this.selectedQuestion) {
      this.message.warning('Please select a question before saving.');
      return;
    }
    console.log(this.assignForm.value);
    if (this.assignForm.invalid) {
      this.message.warning('Please select an auditor before saving.');
      return;
    }
    console.log(this.selectedQuestion);
    this.selectedUserId = Number(this.assignForm.value.auditor);
    this.api
      .assignQuestionToAuditor(
        this.selectedQuestion.questionId,
        this.selectedUserId
      )
      .subscribe({
        next: () => {
          this.message.success('Question assigned successfully.');
          this.isAssignModalVisible = false;
          this.selectedUserId = null;
          this.assignForm.reset();
          this.selectedQuestion = null;
          window.location.reload();
        },
        error: () => {
          this.message.error('Failed to assign question.');
        },
      });
  }
  handleCancel() {
    this.isAssignModalVisible = false;
    this.selectedUserId = null;
    this.assignForm.reset();
  }
}
