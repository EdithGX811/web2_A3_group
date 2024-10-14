// Import necessary modules from Angular framework and Angular Material library. 
// Also, import DataService for data handling and HttpClientModule for HTTP operations.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClientModule } from '@angular/common/http';

// Decorator to define the metadata for the EditComponent.
@Component({
  selector: 'app-edit', // The selector for using this component in HTML.
  standalone: true, // Marks the component as standalone, allowing it to be imported without an NgModule.
  imports: [ // List of modules imported by this component.
    CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, 
    MatFormFieldModule, MatSelectModule, HttpClientModule
  ],
  templateUrl: './edit.component.html', // Path to the HTML template for the component.
  styleUrls: ['./edit.component.css'] // Path to the CSS styles for the component.
})
export class EditComponent {
  fundraiserForm: FormGroup; // FormGroup object to manage the form controls.
  categories: any[] = []; // Array to store categories fetched from the backend.

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    // Initialize the form with predefined controls and validators.
    this.fundraiserForm = this.fb.group({
      fundraise_id: [''],
      organizer: ['', [Validators.required,noNumbersValidator()]], // Custom validator to prevent numbers only.
      caption: ['', Validators.required],
      target_fund: [0, [Validators.required, Validators.min(0)]], // Must be >= 0.
      current_fund: [0, [Validators.required, Validators.min(0)]], // Must be >= 0.
      city: ['', [Validators.required,noNumbersValidator()]], // Custom validator to prevent numbers only.
      event: ['', Validators.required],
      category_id: ['', Validators.required],
      is_active: ['', Validators.required]
    });
    
    // Fetch fundraiser details from the route's query parameters and populate the form.
    this.populateDropdown();
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.fundraiserForm.patchValue({
        // Patching the form values with the route parameters.
        fundraise_id: params['fundraise_id'],
        // 'Number()' is used to ensure 'category_id' and 'is_active' are treated as numbers.
        category_id: Number(params['category_id']),
        is_active: Number(params['is_active'])
      });
    });
  }

  // Method to handle form submission.
  onSubmit() {
    if (this.fundraiserForm.valid) {
      const fundraiserData = this.fundraiserForm.value; // Extract form data.
      console.log(fundraiserData);

      // Check if 'fundraise_id' is present before making update request.
      if (!fundraiserData.fundraise_id) {
        alert("Please select the fundraising information you want to update!!!");
        return;
      }

      // Call DataService to send a PUT request to update the fundraiser.
      this.dataService.updateFundraiser(fundraiserData.fundraise_id, fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser updated successfully', response);
            alert("Fundraiser updated successfully");
            this.router.navigate(['/admin']); // Navigate to admin page upon success.
          },
          error => {
            console.error('Error updating fundraiser', error);
            alert('Error updating fundraiser: ' + error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  // Fetch and populate category dropdown options.
  populateDropdown(): void {
    this.dataService.getCategories().subscribe(
      data => {
        this.categories = data;
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Utility method to generate appropriate error messages based on validation errors.
  getErrorMessage(field: string) {        
    const control = this.fundraiserForm.get(field);
    // Various checks for different error types and return corresponding messages.
    // ...
  }
}

// Custom validator function to check if the input value contains only numbers.
export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    //REGEX: Used to match strings that contain only one or more numbers
    if (value && /^\d+$/.test(value)) {
      return { noNumbers: true }; // Return error object if validation fails.
    }
    return null; // Return null if there are no errors.
  };
}