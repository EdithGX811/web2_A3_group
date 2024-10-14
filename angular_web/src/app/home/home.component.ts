// Import Angular core and common modules, HttpClient for making HTTP requests, RouterModule for routing,
// Angular Material components for UI elements, and a custom DataService for data operations.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../data.service';

// Component decorator providing metadata for the HomeComponent.
@Component({
  selector: 'app-home', // Specifies the custom HTML tag to invoke this component.
  standalone: true, // Marks the component as standalone, enabling it to be used without an NgModule.
  imports: [ // Lists all the modules that this component depends on.
    CommonModule, HttpClientModule, RouterModule, MatButtonModule, MatCardModule
  ],
  templateUrl: './home.component.html', // Path to the HTML template file for this component.
  styleUrls: ['./home.component.css'] // Path to the CSS styles file for this component.
})
export class HomeComponent {
  fundraisers: any[] = []; // Array to store fundraisers fetched from the backend.

  // Constructor with the DataService injected for fetching data.
  constructor(private dataService: DataService) { }

  // Lifecycle hook that runs once the component initializes.
  ngOnInit(): void {
    // Calls a method to load active fundraisers from the backend when the component loads.
    this.loadActiveFundraisers();
  }

  // Method to fetch active fundraisers using the DataService.
  loadActiveFundraisers(): void {
    this.dataService.getActiveFundraisers().subscribe({
      next: (data) => {
        // Assigns the fetched data to the fundraisers array.
        this.fundraisers = data;
        // Logs the fetched fundraisers to the console for debugging.
        console.log(this.fundraisers);
      },
      error: (error) => {
        // Logs any errors to the console if the data fetch fails.
        console.error('Error:', error);
      }
    });
  }

  // Utility method to split an array into smaller arrays (rows) of a specified size.
  // Useful for arranging data into a grid or tabular format for display.
  splitIntoRows(arr: any[], size: number): any[][] {
    const rows = []; // Initializes an empty array to store the rows.
    for (let i = 0; i < arr.length; i += size) {
      // Slices the input array into chunks of the specified size and pushes them into the rows array.
      rows.push(arr.slice(i, i + size));
    }
    return rows; // Returns the array of rows.
  }
}