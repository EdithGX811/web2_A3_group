// Importing required modules and objects from Angular core and rxjs library.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment'; // Importing environment configuration to access API base URL.

// Decorator marking DataService class as available to be provided and injected as a dependency.
@Injectable({
  providedIn: 'root', // Specifies that this service should be provided in the root injector.
})
export class DataService {
  private apiBaseUrl = environment.apiBaseUrl; // Storing API base URL from environment configuration.

  // Injecting HttpClient service to make HTTP requests.
  constructor(private http: HttpClient) { }

  // Method to fetch categories data from the backend.
  getCategories(): Observable<any[]> {
    // Returns an Observable that emits the requested data when the HTTP GET request is successful.
    return this.http.get<any[]>(`${this.apiBaseUrl}/categories`);
  }

  // Method to submit new fundraiser information to the backend.
  addFundraiser(fundraiserData: any): Observable<any> {
    // Performs HTTP POST request to submit fundraiser data, returns Observable for response.
    return this.http.post(`${this.apiBaseUrl}/fundraisers`, fundraiserData);
  }

  // Method to update existing fundraiser information.
  updateFundraiser(fundraise_id: string, fundraiserData: any): Observable<any> {
    // Performs HTTP PUT request to update fundraiser data by ID, returns Observable for response.
    return this.http.put(`${this.apiBaseUrl}/fundraisers/${fundraise_id}`, fundraiserData);
  }

  // Method to fetch active fundraisers from the backend.
  getActiveFundraisers(): Observable<any[]> {
    // Returns Observable containing active fundraisers data on successful HTTP GET request.
    return this.http.get<any[]>(`${this.apiBaseUrl}/fundraisers/active`);
  }

  // Method to search for fundraisers based on provided query parameters.
  searchFundraisers(queryParams: string): Observable<any[]> {
    // Logs 'searching fundraisers' to the console.
    console.log('搜索筹款活动');
    // Performs HTTP GET request with query parameters to search for fundraisers, returns Observable for response.
    return this.http.get<any[]>(`${this.apiBaseUrl}/fundraisers/search?${queryParams}`);
  }

  // Method to delete a specific fundraiser by ID.
  deleteFundraiser(fundraiseId: number): Observable<any> {
    // Performs HTTP DELETE request to remove a fundraiser by ID, returns Observable for response.
    return this.http.delete(`${this.apiBaseUrl}/fundraisers/${fundraiseId}`);
  }

  // Method to fetch details of a specific fundraiser by ID.
  getFundraiserDetails(fundraiserId: string): Observable<any> {
    // Returns Observable containing fundraiser details on successful HTTP GET request.
    return this.http.get<any>(`${this.apiBaseUrl}/fundraisers/${fundraiserId}`);
  }

  // Method to submit a donation to a specific fundraiser.
  submitDonation(fundraiserId: number, donationData: any): Observable<any> {
    // Performs HTTP POST request to submit donation data for a specific fundraiser, returns Observable for response.
    return this.http.post(`${this.apiBaseUrl}/fundraisers/${fundraiserId}/donations/`, donationData);
  }
}