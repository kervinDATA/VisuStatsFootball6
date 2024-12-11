import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SeasonService } from '../services/season.service';
import { UserPageService } from '../services/user-page.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgApexchartsModule],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  seasons: string[] = [];
  statTypes = [
    { label: 'Corners', route: 'stats/corners' },
    { label: 'Attacks', route: 'stats/attacks' },
    { label: 'Dangerous Attacks', route: 'stats/dangerous-attacks' },
    { label: 'Ball Possession %', route: 'stats/possession' },
    { label: 'Wins', route: 'stats/wins' },
    { label: 'Lost', route: 'stats/lost' },
    { label: 'Draw', route: 'stats/draw' },
    { label: 'Goals by Interval', route: 'scoring-intervals' },
  ];

  // Liste des graphiques
  charts: {
    selectedSeason: string;
    selectedStatType: string;
    chartData: any;
  }[] = [];

  // Nom de l’analyse à sauvegarder
  analysisName: string = '';

  // Liste des analyses sauvegardées
  savedAnalyses: { id: number; name: string; charts: any[] }[] = [];

  userId: string = ''; // Stocke l'identifiant de l'utilisateur connecté

  constructor(private seasonService: SeasonService, private userPageService: UserPageService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId() || ''; // Récupérer l'ID utilisateur depuis AuthService

    if (!this.userId) {
      console.error('Utilisateur non connecté !'); 
      this.router.navigate(['/login']); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
      return;
    }

    this.loadSeasons();
    this.addChart(); // Initialiser avec un graphique par défaut
    this.loadSavedAnalyses(); // Charger les analyses sauvegardées
  }

  loadSeasons(): void {
    this.seasonService.getSeasons().subscribe(
      (data) => {
        this.seasons = data.map((s: any) => s.season_name);
      },
      (error) => {
        console.error('Erreur lors du chargement des saisons :', error);
      }
    );
  }

  addChart(): void {
    if (this.charts.length >= 5) {
      console.warn('Vous ne pouvez pas ajouter plus de 5 graphiques.');
      return;
    }

    this.charts.push({
      selectedSeason: '',
      selectedStatType: '',
      chartData: null,
    });
  }

  removeChart(index: number): void {
    if (index >= 0 && index < this.charts.length) {
      this.charts.splice(index, 1);
    } else {
      console.warn('Index de graphique invalide:', index);
    }
  }

  updateChart(index: number): void {
    const chart = this.charts[index];

    if (!chart.selectedSeason || !chart.selectedStatType) {
      console.warn('Veuillez sélectionner une saison et un type de statistique.');
      return;
    }

    const selectedRoute = this.statTypes.find((type) => type.route === chart.selectedStatType)?.route;

    if (!selectedRoute) {
      console.warn('Type de statistique non reconnu.');
      return;
    }

    this.userPageService.getStatData(selectedRoute, {
      season_name: chart.selectedSeason,
    }).subscribe(
      (data) => {
        console.log('Données reçues pour le graphique :', data);

        if (!data || data.length === 0) {
          console.warn('Aucune donnée reçue pour ce filtre.');
          chart.chartData = null;
          return;
        }

        if (selectedRoute === 'scoring-intervals') {
          const teams: string[] = Array.from(
            new Set(data.map((item: any) => `${item.team_name} #${item.team_position || ''}`.trim()))
          );
          const intervals: string[] = Array.from(new Set(data.map((item: any) => item.interval_time)));

          const series = intervals.map((interval: string) => {
            return {
              name: interval,
              data: teams.map((team: string) => {
                const record = data.find(
                  (item: any) =>
                    `${item.team_name} #${item.team_position || ''}`.trim() === team &&
                    item.interval_time === interval
                );
                return record ? parseFloat(record.goals_percentage || 0) : 0;
              }),
            };
          });

          chart.chartData = {
            series: series,
            chart: {
              type: 'bar',
              stacked: true,
              stackType: '100%',
            },
            xaxis: {
              categories: teams,
            },
            yaxis: {
              title: {
                text: 'Percentage of Goals',
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
          };
        } else {
          const categories = data.map((item: any) =>
            `${item.team_name} ${item.team_position ? `#${item.team_position}` : ''}`.trim()
          );

          const seriesData = data.map((item: any) =>
            item.total_wins || item.total_lost || item.total_draw || item.count || 0
          );

          chart.chartData = {
            series: [
              {
                name: chart.selectedStatType,
                data: seriesData,
              },
            ],
            chart: { type: 'bar' },
            xaxis: {
              categories: categories,
            },
          };
        }
      },
      (error) => {
        console.error('Erreur lors du chargement des données du graphique :', error);
      }
    );
  }

  // Sauvegarder les graphiques actuels
  saveCurrentAnalysis(): void {
    if (!this.analysisName.trim()) {
      console.warn('Le nom de l’analyse est obligatoire.');
      return;
    }
  
    if (this.savedAnalyses.length >= 10) {
      console.warn('Vous ne pouvez pas sauvegarder plus de 10 analyses.');
      return;
    }
  
    const chartsWithSeason = this.charts.map((chart) => ({
      season: chart.selectedSeason,
      statType: chart.selectedStatType,
      chartData: chart.chartData
    }));
  
    const analysis = {
      name: this.analysisName,
      charts: chartsWithSeason,
      user_id: this.userId
    };
  
    this.userPageService.saveAnalysis(analysis).subscribe(
      (response) => {
        console.log('Analyse sauvegardée avec succès.');
        // Ajouter l'analyse sauvegardée avec l'ID retourné par le backend
        this.savedAnalyses.push({
          id: response.id, // Utiliser l'ID retourné
          name: response.name,
          charts: response.charts,
        });
        this.analysisName = ''; // Réinitialiser le champ
      },
      (error) => {
        console.error('Erreur lors de la sauvegarde de l’analyse :', error);
      }
    );
  }

  // Charger les analyses sauvegardées d'un utilisateur depuis le backend
  loadSavedAnalyses(): void {
  this.userPageService.getSavedAnalyses(this.userId).subscribe(
    (data) => {
      this.savedAnalyses = data;
    },
    (error) => {
      console.error('Erreur lors du chargement des analyses sauvegardées :', error);
    }
  );
}

// Charger une analyse sauvegardée spécifique par l'utilisateur
loadAnalysis(analysis: { id: number; name: string; charts: any[] }): void {
  this.charts = analysis.charts.map((chart) => ({
    selectedSeason: chart.season,
    selectedStatType: chart.statType,
    chartData: chart.chartData,
  }));
  this.analysisName = analysis.name; // Remplir le champ avec le nom actuel
  console.log(`Analyse "${analysis.name}" chargée avec succès.`);
}

// Modifier une analyse existante
editAnalysis(analysis: { id: number; name: string; charts: any[] }): void {
  if (!this.analysisName.trim()) {
    console.warn('Le nom de l’analyse est obligatoire pour la modification.');
    return;
  }

  const updatedCharts = this.charts.map((chart) => ({
    season: chart.selectedSeason,
    statType: chart.selectedStatType,
    chartData: chart.chartData,
  }));

  const updatedAnalysis = {
    id: analysis.id,
    name: this.analysisName,
    charts: updatedCharts,
    user_id: this.userId,
  };

  this.userPageService.updateAnalysis(updatedAnalysis.id, updatedAnalysis).subscribe(
    () => {
      console.log(`Analyse "${this.analysisName}" modifiée avec succès.`);
      this.loadSavedAnalyses(); // Recharger les analyses sauvegardées
    },
    (error) => {
      console.error('Erreur lors de la modification de l’analyse :', error);
    }
  );
}

// Supprimer une analyse
deleteAnalysis(analysisId: number): void {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette analyse ?')) {
    return;
  }

  this.userPageService.deleteAnalysis(analysisId).subscribe(
    () => {
      console.log(`Analyse avec ID ${analysisId} supprimée avec succès.`);
      // Supprimer localement pour éviter de recharger depuis le backend
      this.savedAnalyses = this.savedAnalyses.filter((a) => a.id !== analysisId);
    },
    (error) => {
      console.error('Erreur lors de la suppression de l’analyse :', error);
    }
  );
}

}