import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,FormsModule,MatCheckboxModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  fundraisers: any[] = [];
  categories: any[] = [];
  searchParams: any = {
    city: '',
    organizer: '',
    categoryId: ''
  };
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchAndDisplayFundraisers('http://localhost:3000/api/fundraisers/active');
    this.populateDropdown('http://localhost:3000/api/categories');
  }

  onSearch() {
    const queryParams = new URLSearchParams();

    if (this.searchParams.city.trim()) {
      queryParams.append('city', this.searchParams.city);
    }
    if (this.searchParams.organizer.trim()) {
      queryParams.append('organizer', this.searchParams.organizer);
    }
    if (this.searchParams.categoryId) {
      queryParams.append('categoryId', this.searchParams.categoryId);
    }

    if (!queryParams.toString().trim()) {
      alert('Please select at least one search criterion.');
      return;
    }

    this.http
      .get<any[]>(`http://localhost:3000/api/fundraisers/search?${queryParams}`)
      .subscribe((data) => {
        this.fundraisers = data;
        if (this.fundraisers.length === 0) {
          alert('No fundraisers found.');
        }
      }, error => {
        console.error('Error fetching search results:', error);
      });
  }

  fetchAndDisplayFundraisers(apiUrl: string): void {
    this.http.get<any[]>(apiUrl).subscribe((data) => {
      this.fundraisers = data;
    }, error => {
      console.error('Error fetching fundraisers:', error);
    });
  }

  populateDropdown(apiUrl: string): void {
    this.http.get<any[]>(apiUrl).subscribe((data) => {
      this.categories = data;
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }

  clearSearchFields() {
    this.searchParams = {
      city: '',
      organizer: '',
      categoryId: ''
    };
    this.fetchAndDisplayFundraisers('http://localhost:3000/api/fundraisers/active');
  }
}
