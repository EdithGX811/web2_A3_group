import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule,HttpClientModule],
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  fundraiserForm: FormGroup;
  categories: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) {
    this.fundraiserForm = this.fb.group({
      organizer: ['', Validators.required],
      caption: ['', Validators.required],
      target_fund: [0, Validators.required],
      current_fund: [0, Validators.required],
      city: ['', Validators.required],
      event: ['', Validators.required],
      category_id: [null, Validators.required],
      is_active: [1, Validators.required]
    });
    this.populateDropdown();
  }

  onSubmit() {
    if (this.fundraiserForm.valid) {
      // 发送POST请求
      const fundraiserData = this.fundraiserForm.value;
      console.log(fundraiserData);
      
      this.http.post('http://localhost:3000/api/fundraisers', fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser added successfully', response);
            alert("Fundraiser added successfully")
            this.router.navigate(['/admin']);
            // 处理成功的操作，例如重定向到列表页
          },
          error => {
            console.error('Error adding fundraiser', error);
            alert('Error adding fundraiser'+error)
            // 处理错误
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }
  populateDropdown(): void {
    this.http.get<any[]>('http://localhost:3000/api/categories').subscribe((data) => {
      this.categories = data;
    }, error => {
      console.error('Error fetching categories:', error);
    });
  }
}
