import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiBaseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // 获取分类数据
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/categories`);
  }

  // 提交募捐信息
  addFundraiser(fundraiserData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/fundraisers`, fundraiserData);
  }

  // 更新募捐信息
  updateFundraiser(fundraise_id: string, fundraiserData: any): Observable<any> {
    return this.http.put(`${this.apiBaseUrl}/fundraisers/${fundraise_id}`, fundraiserData);
  }

  // 获取活跃的筹款活动
  getActiveFundraisers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/fundraisers/active`);
  }

  // 搜索筹款活动
  searchFundraisers(queryParams: string): Observable<any[]> {
    console.log('搜索筹款活动');
    
    return this.http.get<any[]>(`${this.apiBaseUrl}/fundraisers/search?${queryParams}`);
  }

  // 删除筹款活动
  deleteFundraiser(fundraiseId: number): Observable<any> {
    return this.http.delete(`${this.apiBaseUrl}/fundraisers/${fundraiseId}`);
  }
  // 获取筹款活动详情
  getFundraiserDetails(fundraiserId: string): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/fundraisers/${fundraiserId}`);
  }
   // 提交捐赠
   submitDonation(fundraiserId: number, donationData: any): Observable<any> {
    return this.http.post(`${this.apiBaseUrl}/fundraisers/${fundraiserId}/donations/`, donationData);
  }

}
