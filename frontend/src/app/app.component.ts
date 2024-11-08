import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngIf

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
  notification: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  // Méthode pour gérer la connexion
  login() {
    this.authService.login();
    this.showNotification('Vous êtes connecté');
    this.router.navigate(['/user-page']); // Redirige vers "Votre Page" après connexion
  }

  // Méthode pour gérer la déconnexion
  logout() {
    this.authService.logout();
    this.showNotification('Vous êtes déconnecté');
    this.router.navigate(['/']); // Redirige vers la page d'accueil après déconnexion
  }

  showNotification(message: string) {
    this.notification = message;
    setTimeout(() => {
      this.notification = null;
    }, 3000); // Cache le message après 3 secondes
  }
}
