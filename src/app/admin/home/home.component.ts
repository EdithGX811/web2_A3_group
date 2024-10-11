import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatTableModule } from '@angular/material/table'; 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterModule,HttpClientModule,FormsModule,MatCheckboxModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule,MatTableModule],
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
  displayedColumns: string[] = ['organizer', 'caption', 'target_fund', 'current_fund', 'city', 'event', 'category_id', 'is_active', 'operate'];

  constructor(private http: HttpClient,private router:Router) {}

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
   // 删除方法
   deleteFundraiser(fundraiseId: number) {
    const url = `http://localhost:3000/api/fundraisers/${fundraiseId}`;
    if (confirm('Are you sure you want to delete this fundraiser?')) {
      this.http.delete(url).subscribe(
        response => {
          console.log('Fundraiser deleted successfully', response);
          // 从 fundraisers 数组中移除被删除的筹款
          this.fundraisers = this.fundraisers.filter(fundraiser => fundraiser.FUNDRAISE_ID !== fundraiseId);
          alert('Fundraiser deleted successfully')
        },
        error => {
          console.error('Error deleting fundraiser', error);
          alert('Error deleting fundraiser'+error.message)
        }
      );
    }
  }
  editFundraiser(fundraiser:any){
    this.router.navigate(['/admin/edit'], 
    {
      queryParams:{
        'fundraise_id':fundraiser.FUNDRAISE_ID,
        'organizer':fundraiser.ORGANIZER,
        'caption':fundraiser.CAPTION,
        'target_fund':fundraiser.TARGET_fund,
        'current_fund':fundraiser.CURRENT_fund,
        'city':fundraiser.CITY,
        'event':fundraiser.EVENT,
        'category_id':fundraiser.CATEGORY_ID,
        'is_active':fundraiser.IS_ACTIVE}
    })
  }
}
