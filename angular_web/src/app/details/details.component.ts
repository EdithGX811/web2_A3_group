import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../data.service';
@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatButtonModule, MatCardModule,  MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  fundraiser: any;
  errorMessage: string | null = null;
  donations: any;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const fundraiserId = this.route.snapshot.paramMap.get('id');
    if (!fundraiserId) {
      this.errorMessage = 'Fundraiser ID is missing in the URL.';
      return;
    }

    // Call the getFundraiserDetails method in DataService
    this.dataService.getFundraiserDetails(fundraiserId).subscribe({
      next: (data: any) => {
        this.fundraiser = data.fundraiser;
        this.donations = data.donations;
        console.log(data);
      },
      error: () => this.errorMessage = 'Error loading fundraiser details.'
    });
  }

  onDonateClick(): void {
    this.router.navigate(['/donation'], { queryParams: { 'fundraiser_id': this.fundraiser.FUNDRAISE_ID, 'fundraiser_organizer': this.fundraiser.ORGANIZER } });
  }
}
