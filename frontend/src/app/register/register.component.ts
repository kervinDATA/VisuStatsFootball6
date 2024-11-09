import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = ''; // Propriété pour stocker l'email
  password: string = ''; // Propriété pour stocker le mot de passe
  errorMessage: string = ''; // Propriété pour afficher le message d'erreur
  successMessage: string = ''; // Propriété pour afficher le message de succès

  constructor(private authService: AuthService, private router: Router) {}

  // Méthode pour gérer l'inscription
  onRegister() {
    this.authService.register(this.email, this.password).subscribe({
      next: (response) => {
        this.successMessage = 'Inscription réussie !';
        setTimeout(() => {
          this.router.navigate(['/login']); // Rediriger vers la page de connexion après inscription
        }, 2000); // Rediriger après 2 secondes
      },
      error: (err) => {
        console.error('Erreur d\'inscription:', err);
        this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.'; // Afficher un message d'erreur
      }
    });
  }
}