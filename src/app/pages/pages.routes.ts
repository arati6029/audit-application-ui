import { Routes } from '@angular/router';
import { AdminUiComponent } from './admin-ui/admin-ui.component';
import { AuditorUiComponent } from './auditor-ui/auditor-ui.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { QuestionListComponent } from './question/question-list/question-list.component';
import { AddQuestionComponent } from './question/add-question/add-question.component';
import { ReviewAnswerComponent } from './review-answer/review-answer.component';
import { QuestionAnsComponent } from './question-ans/question-ans.component';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login', // default route under /pages
  },

  //   {
  //     path: 'admin',
  //     loadChildren: () =>
  //       import('./admin-ui/admin-ui.routes').then((m) => m.ADMIN_ROUTES),
  //   },

  { path: 'admin-ui', component: AdminUiComponent },
  { path: 'audit-ui', component: AuditorUiComponent },
  { path: 'questions-list', component: QuestionListComponent },
  { path: 'add-question', component: AddQuestionComponent },
  { path: 'review-answers', component: ReviewAnswerComponent },
  { path: 'question-answers', component: QuestionAnsComponent },
];
