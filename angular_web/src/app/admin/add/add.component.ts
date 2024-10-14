// Importing necessary Angular core, common, forms, material components, and services.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClientModule } from '@angular/common/http';

// Component decorator to define metadata for the AddComponent.
@Component({
  selector: 'app-add', // Specifies the custom HTML tag to invoke this component.
  standalone: true, // Marks the component as standalone, enabling it to be used without an NgModule.
  imports: [ // Lists all the modules that this component imports.
    CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, 
    MatFormFieldModule, MatSelectModule, HttpClientModule
  ],
  templateUrl: './add.component.html', // Path to the component's HTML template.
  styleUrls: ['./add.component.css'] // Path to the component's CSS styles.
})
export class AddComponent {
  fundraiserForm: FormGroup; // Declares a FormGroup to manage the form.
  categories: any[] = []; // Array to store categories fetched from the backend.

  // Constructor to inject FormBuilder, DataService, and Router services.
  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    // Initializes the fundraiser form with controls and validators.
    this.fundraiserForm = this.fb.group({
      organizer: ['', [Validators.required,noNumbersValidator()]], // Organizer field with required validation and custom noNumbersValidator.
      caption: ['', Validators.required], // Caption field with required validation.
      target_fund: [0, [Validators.required, Validators.min(0)]], // Target fund field with required validation and minimum value check.
      current_fund: [0, [Validators.required, Validators.min(0)]], // Current fund field with required validation and minimum value check.
      city: ['', [Validators.required,noNumbersValidator()]], // City field with required validation and custom noNumbersValidator.
      event: ['', Validators.required], // Event field with required validation.
      category_id: [null, Validators.required], // Category ID field with required validation.
      is_active: [1, Validators.required] // Is Active field with required validation.
    });
    // Call to populate categories dropdown on component initialization.
    this.populateDropdown();
  }

  // Method to handle form submission.
  onSubmit() {
    // Check if the form is valid.
    if (this.fundraiserForm.valid) {
      const fundraiserData = this.fundraiserForm.value; // Extracts form data.
      console.log(fundraiserData); // Logs the form data for debugging.
      
      // Calls DataService to add a new fundraiser.
      this.dataService.addFundraiser(fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser added successfully', response); // Logs success response.
            alert("Fundraiser added successfully"); // Shows success alert.
            this.router.navigate(['/admin']); // Navigates to the admin route.
          },
          error => {
            console.error('Error adding fundraiser', error); // Logs error.
            alert('Error adding fundraiser: ' + error); // Shows error alert.
          }
        );
    } else {
      console.log('Form is invalid'); // Logs if the form is invalid.
    }
  }

  // Method to fetch and set categories for the category dropdown.
  populateDropdown(): void {
    this.dataService.getCategories().subscribe(
      data => {
        this.categories = data; // Sets the categories array.
      },
      error => {
        console.error('Error fetching categories:', error); // Logs fetching error.
      }
    );
  }

  // Method to generate error messages based on validation errors.
  getErrorMessage(field: string) {        
    const control = this.fundraiserForm.get(field);
    // Checks for 'required' and 'min' validation errors and returns appropriate messages.
    // ...
  }
  
}

// Custom validator function to check for numeric-only values.
export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    //REGEX
    if (value && /^\d+$/.test(value)) {
      return { noNumbers: true }; // Returns error type if value is numeric-only.
    }
    return null; // No errors.
  };
}