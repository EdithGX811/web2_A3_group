import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http'; // 确保导入 HttpClientModule
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HttpClientModule,RouterModule,MatButtonModule,MatCardModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  fundraisers: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadActiveFundraisers();
  }

  loadActiveFundraisers(): void {
    this.http.get<any[]>('http://localhost:3000/api/fundraisers/active')
      .subscribe({
        next: (data) => {
          this.fundraisers = data
          console.log(this.fundraisers)
        },
        error: (error) => console.error('Error:', error)
      });
  }
  splitIntoRows(arr: any[], size: number): any[][] {
    const rows = [];
    for (let i = 0; i < arr.length; i += size) {
      rows.push(arr.slice(i, i + size));
    }
    return rows;
  }
  
}
