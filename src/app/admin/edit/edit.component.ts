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
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,MatButtonModule,MatInputModule,MatFormFieldModule,MatSelectModule,HttpClientModule],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent {
  fundraiserForm: FormGroup;
  categories: any[] = [];
  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router,private route:ActivatedRoute) {
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
      // 获取表单数据
      const fundraiserData = this.fundraiserForm.value;
      console.log(fundraiserData);
      if (!fundraiserData.fundraise_id){
        alert("Please select the fundraising information you want to update!!!")
        return 
      }
      // 发送PUT请求更新现有的募捐活动
      this.http.put(`http://localhost:3000/api/fundraisers/${fundraiserData.fundraise_id}`, fundraiserData)
        .subscribe(
          response => {
            console.log('Fundraiser updated successfully', response);
            alert("Fundraiser updated successfully");
            // 编辑成功后重定向到列表页
            this.router.navigate(['/admin']);
          },
          error => {
            console.error('Error updating fundraiser', error);
            alert('Error updating fundraiser: ' + error);
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
