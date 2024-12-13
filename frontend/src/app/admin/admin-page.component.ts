import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';

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

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadStatistics();
    this.loadUsers();
  }

  // Charger les statistiques globales
  loadStatistics(): void {
    this.adminService.getStatistics().subscribe(
      (data) => {
        this.stats = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des statistiques :', error);
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
          this.loadUsers(); // Recharger la liste des utilisateurs
        },
        (error) => {
          console.error('Erreur lors de la suppression de l’utilisateur :', error);
        }
      );
    }
  }
}
