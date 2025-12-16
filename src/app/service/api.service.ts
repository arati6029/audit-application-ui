import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  // Helper to attach auth header
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Generic Methods
  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
      headers: this.getHeaders(),
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.getHeaders(),
    });
  }

  // User APIs
  getUsers(): Observable<any[]> {
    return this.get<any[]>('users');
  }

  addUser(userData: any): Observable<any> {
    return this.post<any>('users', userData);
  }

  deleteUser(userId: number): Observable<any> {
    return this.delete<any>(`users/${userId}`);
  }

  // Auth APIs
  login(data: any): Observable<any> {
    return this.post<any>('auth/login', data);
  }

  logout(): Observable<any> {
    return this.post<any>('auth/logout', {});
  }

  // Question APIs
  addQuestion(questionData: any): Observable<any> {
    return this.post<any>('questions', questionData);
  }

  getQuestions(): Observable<any[]> {
    return this.get<any[]>('questions');
  }

  getUsersWithRole(role: string): Observable<any[]> {
    return this.get<any[]>(`auth/user/byRole?role=${encodeURIComponent(role)}`);
  }

  assignQuestionToAuditor(
    questionId: number,
    auditorId: number
  ): Observable<any> {
    return this.post<any>(
      `questions/assign-question/${auditorId}/${questionId}`,
      {}
    );
  }
  getAnswersByAuditor(auditorId: number): Observable<any[]> {
    return this.get<any[]>(`questions/review-answers/${auditorId}`);
  }
  updateAnswerStatus(answerId: number, data: any): Observable<any> {
    return this.put<any>(`questions/answer/status/${answerId}`, data);
  }
  updateAnswer(answerId: number, data: any): Observable<any> {
    return this.put<any>(`questions/answer/${answerId}`, data);
  }
  // getQuestionAnswers(userId: number): Observable<any[]> {
  //   return this.get<any[]>(`questions/question-answers/${userId}`);
  // }
  getAssignedQuestionsByUser(userId: number): Observable<any[]> {
    return this.get<any[]>(`questions/assigned-questions/${userId}`);
  }
  getAllAssignments(): Observable<any[]> {
    return this.get<any[]>('questions/assignments');
  }
  submitAnswer(answerData: any, userId: number): Observable<any> {
    return this.post<any>(
      `questions/submit-answers/single/${userId}`,
      answerData
    );
  }
  createUser(userData: any): Observable<any> {
    return this.post<any>('auth/user', userData);
  }
  getUserById(userId: number): Observable<any> {
    return this.get<any>(`auth/user/${userId}`);
  }
}
