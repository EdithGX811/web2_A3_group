import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
=======
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
>>>>>>> master

@Component({
  selector: 'app-donation',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule,MatCardModule,MatButtonModule,MatInputModule,MatFormFieldModule,FormsModule],
=======
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, HttpClientModule, MatSnackBarModule],
>>>>>>> master
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent {
<<<<<<< HEAD

=======
  amount: number = 5;
  giver: string = '';
  fundraiser_organizer: string = '';
  fundraiser_id:number= 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router,private route:ActivatedRoute) { }
  ngOnInit(){
    this.route.queryParams.subscribe(params=>{
      console.log(params);
      this.fundraiser_organizer = params['fundraiser_organizer']   
      this.fundraiser_id =params['fundraiser_id']
    })
  }

  submitDonation() {
    if (this.amount < 5) {
      this.snackBar.open('The minimum donation amount is AUD 5', 'close', { duration: 3000 });
      return;
    }
    if(this.fundraiser_id==0||!this.fundraiser_id){
      this.snackBar.open('Please select a fundraiser','close',{duration:3000})
      return
    }

    const donationData = {
      amount: this.amount,
      giver: this.giver
    };

    // 调用API以提交捐赠数据
    this.http.post(`http://localhost:3000/api/fundraisers/${this.fundraiser_id}/donations/`, donationData).subscribe({
      next: () => {
        alert(`Successful donation,Thank you for your donation to David${this.fundraiser_organizer}`);
        this.router.navigate(['/details',this.fundraiser_id]);

      },
      error: error => {
        //提交失败，请稍后再试
        this.snackBar.open('Submission failed, please try again later', 'close', { duration: 3000 });
      }
    });

  }
>>>>>>> master
}
