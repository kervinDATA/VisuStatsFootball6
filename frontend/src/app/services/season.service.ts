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

  getSeasonStandings(seasonId: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5002/standings/season/${seasonId}`);
  }

  // Méthode pour récupérer les statistiques d'une saison spécifique
  getSeasonStats(season: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`, { params: { season_name: season } });
  }

  getTotalGoals(seasonName: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5002/fact-teams4/total-goals`, { params: { season_names: seasonName } });
  }

  // Méthode pour obtenir les buts par intervalle de temps pour une saison spécifique
  getGoalsByInterval(seasonName: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5002/fact-teams3/goals-per-15min`, { params: { season_names: seasonName } });
  }

  getPenaltyStats(seasonName: string): Observable<any> {
    return this.http.get<any>(`http://localhost:5002/fact-teams5/penalty-stats`, { params: { season_names: seasonName } });
  }

}
