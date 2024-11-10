import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:5002/teams'; // Assurez-vous que ce port est correct

  constructor(private http: HttpClient) {}

  getTeams(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  getTeamStats(teamId: number, season: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${teamId}/stats`, { params: { season } });
  }
}
