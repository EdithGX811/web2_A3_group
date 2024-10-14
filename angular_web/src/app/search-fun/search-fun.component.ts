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

// Component decorator defining the component metadata.
@Component({
  selector: 'app-search-fun', // The component's CSS selector.
  standalone: true, // Marks the component as standalone for use without an NgModule.
  imports: [ // Lists all modules used by this component.
    CommonModule, RouterModule, HttpClientModule, FormsModule, MatCheckboxModule, MatButtonModule,
     MatInputModule, MatFormFieldModule, MatSelectModule, MatCardModule, NoNumbersDirective
  ],
  templateUrl: './search-fun.component.html', // Path to the component's HTML template.
  styleUrls: ['./search-fun.component.css'] // Path to the component's CSS file.
})
export class SearchFunComponent {
  // Properties for storing fundraiser data, categories, and search parameters.
  fundraisers: any[] = [];
  categories: any[] = [];
  searchParams: any = {
    city: '',
    organizer: '',
    categoryId: '',
    active:'1',
  };
  // Boolean flags to indicate which search fields are active.
  City: boolean = false;
  Organizer: boolean = false;
  Category: boolean = false;
  Active:boolean =false;

  // Constructor to inject DataService for fetching data.
  constructor(private dataService: DataService) {}

  // ngOnInit lifecycle hook to load active fundraisers and categories on component initialization.
  ngOnInit(): void {
    this.fetchAndDisplayFundraisers();
    this.populateDropdown();
  }

  // Method to handle search operation based on the defined search parameters.
  onSearch() {
    // Constructing query parameters for the search.
    const queryParams = new URLSearchParams();
    // Appending non-empty parameters to the query string.
    if (this.searchParams.city.trim()) queryParams.append('city', this.searchParams.city);
    if (this.searchParams.organizer.trim()) queryParams.append('organizer', this.searchParams.organizer);
    if (this.searchParams.categoryId) queryParams.append('categoryId', this.searchParams.categoryId);
    if (this.searchParams.active) queryParams.append('active', this.searchParams.active);
    // Alert if no search criteria are provided.
    if (!queryParams.toString().trim()) {
      alert('Please select at least one search criterion.');
      return;
    }
    // Fetching fundraisers based on the search criteria.
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

  // Method to fetch and display active fundraisers.
  fetchAndDisplayFundraisers(): void {
    this.dataService.getActiveFundraisers().subscribe({
      next: (data) => {
        this.fundraisers = data;
      },
      error: (error) => console.error('Error fetching fundraisers:', error)
    });
  }

  // Method to populate the categories dropdown with data fetched from the backend.
  populateDropdown(): void {
    this.dataService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => console.error('Error fetching categories:', error)
    });
  }

  // Method to clear search fields and reset search parameters.
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
    // Fetching and displaying all active fundraisers after clearing search fields.
    this.fetchAndDisplayFundraisers();
  }

  // Utility method to split an array into smaller arrays of a specified size.
  // Useful for arranging data into rows for display.
  splitIntoRows(arr: any[], size: number): any[][] {
    const rows = [];
    for (let i = 0; i < arr.length; i += size) {
      rows.push(arr.slice(i, i + size));
    }
    return rows;
  }
}