import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  stats: { totalUsers: number; totalAnalyses: number } | null = null; // Supprimer activeSessions
  users: { id: string; email: string; role: string }[] = [];
  notificationMessage: string | null = null; // Message de notification
  notificationType: 'success' | 'error' = 'success'; // Type de notification

  constructor(private adminService: AdminService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      console.log('User not logged in');
      this.showNotification('Vous devez être connecté pour accéder à cette page.', 'error');
      this.router.navigate(['/']);
      return;
    }

    const userId = this.authService.getUserId();
    console.log('Current user trying to access admin:', userId);

    if (!this.adminService.isAuthorizedAdmin()) {
      console.log('User not authorized for admin');
      this.showNotification('Vous n\'êtes pas autorisé à accéder à cette page.', 'error');
      this.router.navigate(['/']);
      return;
    }

    console.log('Access granted to admin page');
    this.loadStatistics();
    this.loadUsers();
  }

  // Afficher une notification
  showNotification(message: string, type: 'success' | 'error' = 'success'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    setTimeout(() => {
      this.notificationMessage = null; // Efface la notification après 3 secondes
    }, 3000);
  }

  // Charger les statistiques globales
  loadStatistics(): void {
    this.adminService.getStatistics().subscribe(
      (data) => {
        this.stats = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques :', error);
        this.showNotification('Erreur lors du chargement des statistiques.', 'error');
      }
    );
  }

  // Charger la liste des utilisateurs
  loadUsers(): void {
    this.adminService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs :', error);
        this.showNotification('Erreur lors du chargement des utilisateurs.', 'error');
      }
    );
  }

  // Modifier un utilisateur
  editUser(userId: string): void {
    console.log(`Modifier l'utilisateur avec ID : ${userId}`);
    // Implémentation à ajouter (par exemple, afficher un formulaire de modification)
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.adminService.deleteUser(userId).subscribe(
        () => {
          console.log(`Utilisateur avec ID ${userId} supprimé.`);
          this.showNotification('Utilisateur supprimé avec succès.', 'success');
          this.loadUsers(); // Recharger la liste des utilisateurs
        },
        (error) => {
          console.error('Erreur lors de la suppression de l’utilisateur :', error);
          this.showNotification('Erreur lors de la suppression de l’utilisateur.', 'error');
        }
      );
    }
  }
}
