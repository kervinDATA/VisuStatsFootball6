import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserPageService {
  private apiUrl = 'http://localhost:5002/user-analysis';

  constructor(private http: HttpClient) {}

  getStatData(route: string, params: { [key: string]: string }): Observable<any> {
    const url = `${this.apiUrl}/${route}`;
    const httpParams = new HttpParams({ fromObject: params });
    return this.http.get(url, { params: httpParams });
  }
}
