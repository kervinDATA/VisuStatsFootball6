import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private baseUrl = 'http://localhost:5002/api/analysis'; // URL de base des routes Analysis

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer toutes les saisons
  getSeasons(): Observable<{ season_id: string; season_name: string }[]> {
    return this.http.get<{ season_id: string; season_name: string }[]>(
      `${this.baseUrl}/seasons`
    );
  }

  // Méthode pour récupérer les statistiques d'une saison
  getStatsForSeason(seasonName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/stats`, {
      params: { season_name: seasonName },
    });
  }

  // Méthode pour récupérer les statistiques des attaques dangereuses, buts et classement
  getDangerousAttacksStats(seasonName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/dangerous-attacks-stats`, {
      params: { season_name: seasonName },
    });
  }

  // Méthode pour récupérer les statistiques des goals intervalles
  getGoalsIntervalDistribution(seasonName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/goals-interval-distribution`, {
      params: { season_name: seasonName },
    });
  }
}
