import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';  
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../data.service';
import { NoNumbersDirective } from '../directive/no-numbers.directive';

@Component({
  selector: 'app-search-fun',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule, MatCheckboxModule, MatButtonModule,
     MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule,NoNumbersDirective],
  templateUrl: './search-fun.component.html',
  styleUrls: ['./search-fun.component.css']
})
export class SearchFunComponent {
  fundraisers: any[] = [];
  categories: any[] = [];
  searchParams: any = {
    city: '',
    organizer: '',
    categoryId: '',
    active:'1',
  };
  City: boolean = false;
  Organizer: boolean = false;
  Category: boolean = false;
  Active:boolean =false;

  constructor(private dataService: DataService) {}

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

    this.dataService.searchFundraisers(queryParams.toString()).subscribe({
      next: (data) => {        
        this.fundraisers = data;
        if (this.fundraisers.length === 0) {
          alert('No fundraisers found.');
        }
      },
      error: (error) => console.error('Error fetching search results:', error)
    });
  }

  fetchAndDisplayFundraisers(): void {
    this.dataService.getActiveFundraisers().subscribe({
      next: (data) => {
        this.fundraisers = data;
      },
      error: (error) => console.error('Error fetching fundraisers:', error)
    });
  }

  populateDropdown(): void {
    this.dataService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  clearSearchFields() {
    this.City = false;
    this.Category = false;
    this.Organizer = false;
    this.searchParams = {
      city: '',
      organizer: '',
      categoryId: '',
      active:'1'
    };
    this.fetchAndDisplayFundraisers();
  }
}
