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

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule,HttpClientModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  fundraiserForm: FormGroup;
  categories: any[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router) {
    this.fundraiserForm = this.fb.group({
      organizer: ['', [Validators.required,noNumbersValidator()]],
      caption: ['', Validators.required],
      target_fund: [0, [Validators.required, Validators.min(0)]], // 大于等于0
      current_fund: [0, [Validators.required, Validators.min(0)]], // 大于等于0
      city: ['', [Validators.required,noNumbersValidator()]],
      event: ['', Validators.required],
      category_id: [null, Validators.required],
      is_active: [1, Validators.required]
    });
    this.populateDropdown();
  }

  onSubmit() {
    if (this.fundraiserForm.valid) {
      const fundraiserData = this.fundraiserForm.value;
      console.log(fundraiserData);
      
      this.dataService.addFundraiser(fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser added successfully', response);
            alert("Fundraiser added successfully");
            this.router.navigate(['/admin']);
          },
          error => {
            console.error('Error adding fundraiser', error);
            alert('Error adding fundraiser: ' + error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

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
  getErrorMessage(field: string) {        
    const control = this.fundraiserForm.get(field);
    if (control?.hasError('required')) {
      return 'This field cannot be empty';
    } else if (control?.hasError('min')) {
      if (field === 'current_fund' || field==='target_fund') {
        return 'Current fund must be greater than or equal to zero';
      }
      
    }else if(field==='noNumbers'){        
      return 'cannot contain only numbers'
    }
    return '';
  }
  
}

export function noNumbersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value && /^\d+$/.test(value)) {
      return { noNumbers: true }; // 返回错误类型
    }
    return null; // 没有错误
  };
}