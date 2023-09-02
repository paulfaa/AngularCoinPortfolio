import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CryptoValueResponse } from '../types/cryptoValueResponse.type';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CryptoValueClientService {

  private baseUrl: string = "http://localhost:8080/";

  constructor(private http: HttpClient) { }

  public getCryptoValue(coinId: number, currency: string): Observable<CryptoValueResponse>{
    var params: HttpParams = new HttpParams();
    const cryptoValueUrl = this.buildGetValueUrl(coinId, currency);
    return this.http.get<CryptoValueResponse>(cryptoValueUrl);
  }

  public getCryptoValues(): Observable<CryptoValueResponse[]>{
    const allValuesUrl = this.baseUrl + "values"
    return this.http.get<CryptoValueResponse[]>(allValuesUrl);
  }

  private buildGetValueUrl(coinId: number, currency: string): string {
    return this.baseUrl + "value?id=" + coinId + "?currency=" + currency;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
