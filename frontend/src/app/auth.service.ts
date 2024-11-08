import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false; // Défaut : non connecté

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  login(): void {
    this.loggedIn = true;
    // Dans un vrai contexte, cette méthode pourrait inclure une requête API
  }

  logout(): void {
    this.loggedIn = false;
  }
}


