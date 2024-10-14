import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';  
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table'; 
import { DataService } from 'src/app/data.service';
import { HttpClientModule } from '@angular/common/http';
import { NoNumbersDirective } from 'src/app/directive/no-numbers.directive';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatCheckboxModule, 
    MatButtonModule, MatInputModule, MatFormFieldModule, 
    MatSelectModule, MatTableModule,HttpClientModule,NoNumbersDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  fundraisers: any[] = [];
  categories: any[] = [];
  searchParams: any = {
    city: '',
    organizer: '',
    categoryId: '',
    active:'1',

  };
  displayedColumns: string[] = ['organizer', 'caption', 'target_fund', 'current_fund', 'city', 'event', 'category_id', 'is_active', 'operate'];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAndDisplayFundraisers();
    this.populateDropdown();
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
    if(this.searchParams.active){
      queryParams.append('active',this.searchParams.active);
    }

    if (!queryParams.toString().trim()) {
      alert('Please select at least one search criterion.');
      return;
    }

    this.dataService.searchFundraisers(queryParams.toString()).subscribe((data) => {
      this.fundraisers = data;
      if (this.fundraisers.length === 0) {
        alert('No fundraisers found.');
      }
    }, error => {
      console.error('Error fetching search results:', error);
    });
  }

  fetchAndDisplayFundraisers(): void {
    this.dataService.getActiveFundraisers().subscribe((data) => {
      this.fundraisers = data;
    }, error => {
      console.error('Error fetching fundraisers:', error);
    });
  }

  populateDropdown(): void {
    this.dataService.getCategories().subscribe((data) => {
      this.categories = data;
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }

  clearSearchFields() {
    this.searchParams = {
      city: '',
      organizer: '',
      categoryId: '',
      active:'1'
    };
    this.fetchAndDisplayFundraisers();
  }

  deleteFundraiser(fundraiseId: number) {
    if (confirm('Are you sure you want to delete this fundraiser?')) {
      this.dataService.deleteFundraiser(fundraiseId).subscribe(
        response => {
          console.log('Fundraiser deleted successfully', response);
          this.fundraisers = this.fundraisers.filter(fundraiser => fundraiser.FUNDRAISE_ID !== fundraiseId);
          alert('Fundraiser deleted successfully');
        },
        error => {
          console.error('Error deleting fundraiser', error);
          const errorMessage = error?.error?.messsage || error?.error?.message || 'Unknown error';
          alert('Error deleting fundraiser: ' + errorMessage);
        }
      );
    }
  }

  editFundraiser(fundraiser: any) {
    this.router.navigate(['/admin/edit'], {
      queryParams: {
        'fundraise_id': fundraiser.FUNDRAISE_ID,
        'organizer': fundraiser.ORGANIZER,
        'caption': fundraiser.CAPTION,
        'target_fund': fundraiser.TARGET_fund,
        'current_fund': fundraiser.CURRENT_fund,
        'city': fundraiser.CITY,
        'event': fundraiser.EVENT,
        'category_id': fundraiser.CATEGORY_ID,
        'is_active': fundraiser.IS_ACTIVE
      }
    });
  }
}
