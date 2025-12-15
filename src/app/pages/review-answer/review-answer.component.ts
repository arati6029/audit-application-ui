import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-review-answer',
  imports: [
    CommonModule,
    FormsModule,
    NzFormModule,
    NzSelectModule,
    NzTableModule,
    NzButtonModule,
    NzSpaceModule,
    NzMessageModule,
  ],
  templateUrl: './review-answer.component.html',
  styleUrl: './review-answer.component.css',
})
export class ReviewAnswerComponent {
  auditors: any[] = [];
  answers: any[] = [];
  selectedAuditorId: number | null = null;

  constructor(private message: NzMessageService, private api: ApiService) {}

  ngOnInit(): void {
    // Simulate fetching auditor list
    this.api.getUsersWithRole('AUDITOR').subscribe({
      next: (data) => {
        this.auditors = data;
      },
      error: () => {
        this.message.error('Failed to load auditors.');
      },
    });
  }

  onAuditorChange(auditorId: number): void {
    this.selectedAuditorId = auditorId;
    this.api.getAnswersByAuditor(auditorId).subscribe({
      next: (data) => {
        this.answers = data;
      },
      error: (error) => {
        console.error('Error fetching answers:', error);
      },
    });

    // Simulated data for now
    // if (auditorId === 1) {
    //   this.answers = [
    //     {
    //       id: 101,
    //       questionText: 'What is your role?',
    //       answerText: 'Developer',
    //     },
    //     {
    //       id: 102,
    //       questionText: 'How many audits completed?',
    //       answerText: '12',
    //     },
    //   ];
    // } else if (auditorId === 2) {
    //   this.answers = [
    //     { id: 201, questionText: 'Is process automated?', answerText: 'Yes' },
    //     {
    //       id: 202,
    //       questionText: 'Any challenges faced?',
    //       answerText: 'Some delays in reporting.',
    //     },
    //   ];
    // } else {
    //   this.answers = [];
    // }
  }

  acceptAnswer(ans: any): void {
    console.log('Accepting answer:', ans);
    ans.assignment.status = 'ACCEPTED';

    this.api.updateAnswerStatus(ans.answerId, ans).subscribe({
      next: () => {
        this.message.success(`Accepted answer for Question ID: ${ans.id}`);
      },
      error: () => {
        this.message.error(
          `Failed to accept answer for Question ID: ${ans.id}`
        );
      },
    });
  }

  rejectAnswer(ans: any): void {
    ans.assignment.status = 'REJECTED';
    this.api.updateAnswerStatus(ans.answerId, ans).subscribe({
      next: () => {
        this.message.success(`Rejected answer for Question ID: ${ans.id}`);
      },
      error: () => {
        this.message.error(
          `Failed to reject answer for Question ID: ${ans.id}`
        );
      },
    });
    // Call API here: this.reviewService.updateAnswerStatus(ans.id, 'REJECTED')
  }
}
