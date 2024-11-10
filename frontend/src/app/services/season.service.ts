import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private baseUrl = 'http://localhost:5002/seasons';

  constructor(private http: HttpClient) {}

  getSeasons(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }
}
