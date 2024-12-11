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

  // Méthode existante pour sauvegarder une analyse
  saveAnalysis(analysis: { name: string; charts: any[]; user_id: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/save`, analysis);
  }

  // Nouvelle méthode pour récupérer les analyses sauvegardées
  getSavedAnalyses(user_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/saved-analyses`, { params: { user_id } });
  }

  // Méthode pour modifier une analyse existante
  updateAnalysis(id: number, analysis: { name: string; charts: any[]; user_id: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, analysis);
  }

  // Méthode pour supprimer une analyse existante
  deleteAnalysis(analysisId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${analysisId}`);
  }

}
