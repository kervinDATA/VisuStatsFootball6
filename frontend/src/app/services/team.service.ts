import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private baseUrl = 'http://localhost:5002/teams'; // Base URL pour l'API des équipes

  constructor(private http: HttpClient) {}

  // Récupérer la liste de toutes les équipes
  getTeams(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  // Récupérer les informations détaillées d'une équipe (nom, stade, ville, capacité, etc.)
  getTeamDetails(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${teamId}/details`);
  }

  // Récupérer les statistiques de l'équipe pour une saison spécifique
  getTeamStats(teamId: number, season: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${teamId}/stats`, { params: { season } });
  }

  //méthode pour récupérer le classement d'une équipe pour une saison
  getTeamStandingForSeason(teamId: number, seasonId: number): Observable<any> {
    const url = `http://localhost:5002/standings/team/${teamId}/season/${seasonId}`;
    return this.http.get<any>(url);
  }

  getStandingsForAllSeasons(teamId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5002/standings/team/${teamId}/standings`);
  }

  getTeamImage(teamId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${teamId}/image`);
  }
}
