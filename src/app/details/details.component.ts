import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // 确保导入 HttpClientModule

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule,HttpClientModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent {
  fundraiser: any;
  errorMessage: string | null = null;
  donations:any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const fundraiserId = this.route.snapshot.paramMap.get('id');
    if (!fundraiserId) {
      this.errorMessage = 'Fundraiser ID is missing in the URL.';
      return;
    }

    this.http.get(`http://localhost:3000/api/fundraisers/${fundraiserId}`)
      .subscribe({
        next: (data:any) => {
          this.fundraiser = data.fundraiser
          this.donations = data.donations
          console.log(data)
        },
        error: () => this.errorMessage = 'Error loading fundraiser details.'
      });
  }

  onDonateClick(): void {
    alert('This feature is under construction');
  }
}
