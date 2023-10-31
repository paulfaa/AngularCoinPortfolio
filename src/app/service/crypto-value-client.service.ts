import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Rate } from '../types/rate.type';

@Injectable({
  providedIn: 'root'
})
export class CryptoValueClientService {

  private baseUrl: string = "http://localhost:8080/values";

  constructor(private http: HttpClient) { }

  public getCryptoValues(currency: string, ids: number[]): Observable<Rate[]>{
    if(ids.length !>= 1){
      console.log("no ids in request")
      return of<Rate[]>([]);
    }
    var requestParams: HttpParams = new HttpParams();
    requestParams.set('currency', currency);
    requestParams.set('requestIds', ids.join(','))
    return this.http.get<Rate[]>(this.baseUrl, {params: requestParams});
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