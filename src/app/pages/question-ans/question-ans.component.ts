import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-question-ans',
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
  templateUrl: './question-ans.component.html',
  styleUrl: './question-ans.component.css',
})
export class QuestionAnsComponent {
  questionAnswers: any[] = [];
  userId: number = 0;
  questionWithAnswers: any[] = [];
  constructor(private api: ApiService) {
    // Sample data
  }
  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    // Fetch or initialize data here
    this.loadQuestionAnswers();
  }

  loadQuestionAnswers(): void {
    this.api.getAssignedQuestionsByUser(this.userId).subscribe({
      next: (data) => {
        this.questionAnswers = data;
        this.api.getAnswersByAuditor(this.userId).subscribe({
          next: (data) => {
            this.questionWithAnswers = data;
            this.questionAnswers.forEach((question) => {
              const answer = this.questionWithAnswers.find(
                (ans) =>
                  ans.assignment.question.questionId === question.questionId
              );
              question.answerText = answer ? answer.answerText : '';
              question.status = answer ? answer.assignment.status : 'PENDING';
              question.answerId = answer ? answer.answerId : null;
            });
          },
          error: (error) => {
            console.error('Error fetching question answers:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error fetching question answers:', error);
      },
    });
  }
  submitAnswer(ans: any): void {
    console.log('Submitted answer:', ans);
    // TODO: call your service method to save the answer
    if (ans.answerId != null) {
      this.api.updateAnswer(ans.answerId, ans).subscribe({
        next: () => {
          console.log('Answer updated successfully');
          // Optionally, you can refresh the question answers or show a success message
          this.loadQuestionAnswers();
        },
        error: (error) => {
          console.error('Error updating answer:', error);
        },
      });
    } else {
      this.api.submitAnswer(ans, this.userId).subscribe({
        next: () => {
          console.log('Answer submitted successfully');
          // Optionally, you can refresh the question answers or show a success message
          this.loadQuestionAnswers();
        },
        error: (error) => {
          console.error('Error submitting answer:', error);
        },
      });
    }
  }
}
