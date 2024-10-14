import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';

// Component decorator that defines metadata for the DonationComponent.
@Component({
  selector: 'app-donation', // The component's CSS selector.
  standalone: true, // Marks the component as standalone for use without an NgModule.
  imports: [ // Lists all the modules imported by this component.
    CommonModule, MatCardModule, MatButtonModule, MatInputModule, 
    MatFormFieldModule, FormsModule, MatSnackBarModule, HttpClientModule
  ],
  templateUrl: './donation.component.html', // Path to the HTML template file.
  styleUrls: ['./donation.component.css'] // Path to the CSS styles file.
})
export class DonationComponent {
  // Properties for managing the donation form's state.
  amount: number = 5; // Default donation amount.
  giver: string = ''; // Donor's name.
  fundraiser_organizer: string = ''; // Organizer's name.
  fundraiser_id: number = 0; // Fundraiser's ID.

  // Constructor to inject services for data handling, navigation, and displaying messages.
  constructor(private dataService: DataService, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {}

  // Lifecycle hook that runs once the component is initialized.
  ngOnInit() {
    // Subscribe to route parameters to fetch fundraiser details.
    this.route.queryParams.subscribe(params => {
      console.log(params); // Logging the received parameters.
      this.fundraiser_organizer = params['fundraiser_organizer']; // Set the organizer's name.
      this.fundraiser_id = params['fundraiser_id']; // Set the fundraiser's ID.
    });
  }

  // Method to handle donation form submission.
  submitDonation() {
    // Validation for minimum donation amount.
    if (this.amount < 5) {
      // Display a message if the amount is less than the minimum required.
      this.snackBar.open('The minimum donation amount is AUD 5', 'close', { duration: 3000 });
      return;
    }
    // Validation to check if a fundraiser is selected.
    if (this.fundraiser_id == 0 || !this.fundraiser_id) {
      // Display a message if no fundraiser is selected.
      this.snackBar.open('Please select a fundraiser', 'close', { duration: 3000 });
      return;
    }

    // Prepare the donation data for submission.
    const donationData = {
      amount: this.amount,
      giver: this.giver
    };

    // Submit the donation data using the DataService.
    this.dataService.submitDonation(this.fundraiser_id, donationData).subscribe({
      next: () => {
        // Display a success message and navigate to the fundraiser's details page.
        alert(`Successful donation, Thank you for your donation to ${this.fundraiser_organizer}`);
        this.router.navigate(['/fundraiser', this.fundraiser_id]);
      },
      error: () => {
        // Display an error message if the submission fails.
        this.snackBar.open('Submission failed, please try again later', 'close', { duration: 3000 });
      }
    });
  }
}