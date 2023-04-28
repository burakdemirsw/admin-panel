import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IyzicoService {
  private apiUrl = 'https://sandbox-api.iyzipay.com';
  private apiKey = 'iZrjQ9HJGTmD2SDWO6Sha9452TSrFk5T';
  private securityKey = 'dyPkS1EbelzI6J7t9opC4661UGePWw7U';

  constructor(private http: HttpClient) {}

  public makePayment(paymentData:any): Observable<any> {
    const url = `${this.apiUrl}/payment/auth`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `IYZWS ${this.apiKey}:${this.securityKey}`
    });
    return this.http.post(url, paymentData, { headers });
  }
}
