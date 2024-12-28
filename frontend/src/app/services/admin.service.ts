import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:5002/admin';
  private readonly ADMIN_USER_ID = '305956eb-2063-4da9-aa83-6851b336c832';

  constructor(private http: HttpClient, private authService: AuthService) {}

  isAuthorizedAdmin(): boolean {
    const userId = this.authService.getUserId();
    console.log('Current user ID:', userId);
    console.log('Admin ID:', this.ADMIN_USER_ID);
    console.log('Is authorized?', userId === this.ADMIN_USER_ID);
    return userId === this.ADMIN_USER_ID;
  }

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