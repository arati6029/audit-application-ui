import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTableModule } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-user-list',
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    RouterModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  loading = false;
  users = [
    { name: 'Arati Chavan', email: 'arati@example.com', role: 'ADMIN' },
    { name: 'Akshaya Jadhav', email: 'akshaya@example.com', role: 'AUDITOR' },
  ];
}
