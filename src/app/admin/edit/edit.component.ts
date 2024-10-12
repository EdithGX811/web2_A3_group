import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatSelectModule,HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  fundraiserForm: FormGroup;
  categories: any[] = [];

  constructor(private fb: FormBuilder, private dataService: DataService, private router: Router, private route: ActivatedRoute) {
    this.populateDropdown();
    this.fundraiserForm = this.fb.group({
      fundraise_id: [''],
      organizer: ['', Validators.required],
      caption: ['', Validators.required],
      target_fund: ['', Validators.required],
      current_fund: ['', Validators.required],
      city: ['', Validators.required],
      event: ['', Validators.required],
      category_id: ['', Validators.required],
      is_active: ['', Validators.required]
    });

    // 从路由中获取参数，并更新表单
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.fundraiserForm.patchValue({
        fundraise_id: params['fundraise_id'],
        organizer: params['organizer'],
        caption: params['caption'],
        target_fund: params['target_fund'],
        current_fund: params['current_fund'],
        city: params['city'],
        event: params['event'],
        category_id: Number(params['category_id']),
        is_active: Number(params['is_active'])
      });
    });
  }

  onSubmit() {
    if (this.fundraiserForm.valid) {
      const fundraiserData = this.fundraiserForm.value;
      console.log(fundraiserData);

      if (!fundraiserData.fundraise_id) {
        alert("Please select the fundraising information you want to update!!!");
        return;
      }

      // 发送PUT请求更新现有的募捐活动
      this.dataService.updateFundraiser(fundraiserData.fundraise_id, fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser updated successfully', response);
            alert("Fundraiser updated successfully");
            this.router.navigate(['/admin']);
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
}
