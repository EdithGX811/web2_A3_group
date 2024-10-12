import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { DataService } from '../data.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-donation',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule, MatSnackBarModule,HttpClientModule],
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent {
  amount: number = 5;
  giver: string = '';
  fundraiser_organizer: string = '';
  fundraiser_id: number = 0;

  constructor(private dataService: DataService, private snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params);
      this.fundraiser_organizer = params['fundraiser_organizer'];
      this.fundraiser_id = params['fundraiser_id'];
    });
  }

  submitDonation() {
    if (this.amount < 5) {
      this.snackBar.open('The minimum donation amount is AUD 5', 'close', { duration: 3000 });
      return;
    }
    if (this.fundraiser_id == 0 || !this.fundraiser_id) {
      this.snackBar.open('Please select a fundraiser', 'close', { duration: 3000 });
      return;
    }

    const donationData = {
      amount: this.amount,
      giver: this.giver
    };

    // 使用 DataService 提交捐赠数据
    this.dataService.submitDonation(this.fundraiser_id, donationData).subscribe({
      next: () => {
        alert(`Successful donation, Thank you for your donation to ${this.fundraiser_organizer}`);
        this.router.navigate(['/fundraiser', this.fundraiser_id]);
      },
      error: () => {
        this.snackBar.open('Submission failed, please try again later', 'close', { duration: 3000 });
      }
    });
  }
}
