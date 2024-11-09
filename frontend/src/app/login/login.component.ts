import { Component, Inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importer FormsModule
import { AppComponent } from '../app.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corriger le nom ici
})
export class LoginComponent {
  email: string = ''; // Propriété pour stocker l'email
  password: string = ''; // Propriété pour stocker le mot de passe
  errorMessage: string = ''; // Propriété pour stocker le message d'erreur

  constructor(private authService: AuthService, private router: Router, @Inject(AppComponent) private appComponent: AppComponent) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.storeToken(response.token); // Stocker le token
        console.log('Connexion réussie !');
        this.appComponent.showNotification('Connexion réussie !');
        //this.router.navigate(['/user-page']); // Redirige vers "Votre Page" après connexion
        this.router.navigate(['/']); // Rediriger vers la page d'accueil
        this.errorMessage = ''; // Réinitialiser le message d'erreur en cas de succès
      },
      error: (err) => {
        console.error('Erreur de connexion:', err);
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }
}
