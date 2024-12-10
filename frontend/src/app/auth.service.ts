import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5002/auth'; // URL de l'API

  constructor(private http: HttpClient) {}

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // Vérifie si le token existe dans localStorage
  }

  // Connexion de l'utilisateur
  login(email: string, password: string) {
    return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Login error', error);
        return throwError(error);
      })
    );
  }

  // Stocker le token dans localStorage
  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    localStorage.removeItem('token'); // Retire le token du localStorage
  }

  register(email: string, password: string) {
    return this.http.post<{ message: string }>('http://localhost:5002/auth/register', { email, password }).pipe(
      catchError((error) => {
        console.error('Erreur d\'inscription', error);
        return throwError(error);
      })
    );
  }

  // Stocker les informations de l'utilisateur dans localStorage
  storeUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
  }
  
  // Récupérer l'ID de l'utilisateur depuis localStorage
  getUserId(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }


}



