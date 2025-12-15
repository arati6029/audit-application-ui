import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-auditor-ui',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule, // ✅ Required for [nzInlineCollapsed]
    NzIconModule,
    NzButtonModule,
    NzCardModule,
  ],
  templateUrl: './auditor-ui.component.html',
  styleUrl: './auditor-ui.component.css',
})
export class AuditorUiComponent {
  isCollapsed = false; // ✅ this fixes your error
  role: string | null = null;
  userId: number = 0;
  userName: any;

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit() {
    this.userId = Number(sessionStorage.getItem('userId'));
    if (this.userId !== 0) {
      // Fetch user details or perform actions based on userId
      this.api.getUserById(this.userId).subscribe({
        next: (data) => {
          console.log('User data fetched successfully:', data);
          this.userName = data.name; // Example: store user name
        },
      });
    }
    this.role = sessionStorage.getItem('role');
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    sessionStorage.clear();
    this.router.navigate(['/pages/login']);
  }
}
