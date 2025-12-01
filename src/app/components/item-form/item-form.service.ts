import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemFormService {

  constructor(private http: HttpClient) { }

  getItemInfo(url: any): Observable<any> {
    return this.http.get(environment.apiUrl + url);
  }
  getItemInfoPost(url: any, body: any): Observable<any> {
    return this.http.get(environment.apiUrl + url, body);
  }
  getItemInfoPostReal(url: any, body: any): Observable<any> {
    return this.http.post(environment.apiUrl + url, body);
  }
  createNewItem(url: any, body: any): Observable<any> {
    return this.http.post(environment.apiUrl + url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  }
  editItem(url: any, body: any): Observable<any> {
    return this.http.post(environment.apiUrl + url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    });
  }
}
