import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importer CommonModule pour *ngIf
import { ImageService } from './image.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  notification: string | null = null;
  imageUrl: string | undefined; // Variable pour l'URL du logo

  // Propriétés pour stocker l'email et le mot de passe
  email: string = '';
  password: string = '';

  constructor(public authService: AuthService, private router: Router, private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadLogo();
  }

  loadLogo(): void {
    this.imageService.getImageUrl('logo_VisuStatsFootball.jpg').subscribe(
      (response) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.error("Erreur de chargement du logo :", error);
      }
    );
  }
  

  // Méthode pour gérer la connexion
  login() {
    //this.authService.login(this.email, this.password).subscribe({
      //next: (response) => {
        //this.authService.storeToken(response.token); // Stocker le token
        //this.showNotification('Vous êtes connecté');
        //this.router.navigate(['/user-page']); // Redirige vers "Votre Page" après connexion
      //},
      //error: (err) => {
        //console.error('Erreur de connexion:', err);
      //}
    //});
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

  goToRegister() {
    console.log("Navigating to register"); // Ajoute un message pour vérifier si la méthode est appelée
    this.router.navigate(['/register']);
  }

  // Nouvelle méthode pour naviguer vers la page de connexion
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
