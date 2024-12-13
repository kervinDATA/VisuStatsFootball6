import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5002/admin';

  constructor(private http: HttpClient) {}

  // Obtenir les statistiques globales
  getStatistics(): Observable<{ totalUsers: number; totalAnalyses: number }> {
    return this.http.get<{ totalUsers: number; totalAnalyses: number; activeSessions: number }>(`${this.baseUrl}/statistics`);
  }

  // Obtenir la liste des utilisateurs
  getUsers(): Observable<{ id: string; email: string; role: string }[]> {
    return this.http.get<{ id: string; email: string; role: string }[]>(`${this.baseUrl}/users`);
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${userId}`);
  }

  // Modifier un utilisateur (à implémenter si nécessaire)
  updateUser(userId: string, userData: { email?: string; role?: string }): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/users/${userId}`, userData);
  }
}
