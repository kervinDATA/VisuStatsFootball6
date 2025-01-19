import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SeasonService } from '../services/season.service';
import { AnalysisService } from '../services/analysis.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [NgApexchartsModule, CommonModule, FormsModule, RouterModule],
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css'],
})
export class AnalysisComponent implements OnInit {
  seasons: { season_id: string; season_name: string }[] = []; // Liste des saisons
  selectedSeasonName: string = '2023/2024'; // Saison sélectionnée par défaut
  ballPossessionStats: any[] = []; // Données pour possession et classement
  dangerousAttackStats: any[] = []; // Données pour attaques dangereuses, buts et classement
  chartOptionsPossession: any; // Configuration du graphique Possession
  chartOptionsDangerousAttacks: any; // Configuration du graphique Attaques Dangereuses
  chartOptionsCeltic: any; // Configuration du graphique pour Celtic
  chartOptionsRangers: any; // Configuration du graphique pour Rangers

  constructor(
    private seasonService: SeasonService,
    private analysisService: AnalysisService
  ) {}

  ngOnInit() {
    // Charger les saisons dès l'initialisation du composant
    this.seasonService.getSeasons().subscribe({
      next: (data) => {
        this.seasons = data;
        console.log('Saisons disponibles :', this.seasons);
      },
      error: (err) => console.error('Erreur lors de la récupération des saisons :', err),
    });

    // Charger les deux analyses pour la saison par défaut
    this.loadStatsForSeason(this.selectedSeasonName);
    this.loadDangerousAttackStats(this.selectedSeasonName);

    // Charger la répartition des buts par intervalle pour la saison par défaut
    this.loadGoalsIntervalDistribution(this.selectedSeasonName);
  }

  // Gérer la sélection d'une saison
  selectSeason(seasonName: string) {
    this.selectedSeasonName = seasonName;
    console.log('Saison sélectionnée :', this.selectedSeasonName);
    this.loadStatsForSeason(seasonName);
    this.loadDangerousAttackStats(seasonName);
    this.loadGoalsIntervalDistribution(seasonName);
  }

  // Charger les données pour la première analyse (Possession vs Classement)
  loadStatsForSeason(seasonName: string) {
    this.analysisService.getStatsForSeason(seasonName).subscribe({
      next: (data) => {
        this.ballPossessionStats = data;
        console.log('Données pour Possession :', this.ballPossessionStats);
        this.updatePossessionChartOptions();
      },
      error: (err) =>
        console.error('Erreur lors de la récupération des statistiques :', err),
    });
  }

  // Charger les données pour la deuxième analyse (Attaques Dangereuses vs Buts)
  loadDangerousAttackStats(seasonName: string) {
    this.analysisService.getDangerousAttacksStats(seasonName).subscribe({
      next: (data) => {
        this.dangerousAttackStats = data;
        console.log('Données pour Attaques Dangereuses :', this.dangerousAttackStats);
        this.updateDangerousAttackChartOptions();
      },
      error: (err) =>
        console.error('Erreur lors de la récupération des statistiques :', err),
    });
  }

  // méthode pour charger les données de répartition des buts
  loadGoalsIntervalDistribution(seasonName: string) {
    this.analysisService.getGoalsIntervalDistribution(seasonName).subscribe({
      next: (data) => {
        console.log('Données de répartition des buts :', data);
        this.updatePieCharts(data); // Appeler la méthode pour mettre à jour les graphiques
      },
      error: (err) =>
        console.error('Erreur lors de la récupération des répartitions des buts :', err),
    });
  }

  // Mettre à jour les options pour le graphique Possession vs Classement
  updatePossessionChartOptions() {
    const categories = this.ballPossessionStats.map(
      (item) => `${item.team_name} (#${item.team_position})`
    );
    const seriesData = this.ballPossessionStats.map((item) =>
      parseFloat(item.ball_possession.replace('%', ''))
    );

    this.chartOptionsPossession = {
      series: [
        {
          name: 'Ball Possession %',
          data: seriesData,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        foreColor: '#ffffff',
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Équipes et Classement',
        },
        labels: {
          style: {
            colors: '#ffffff', // Étiquettes axe X en blanc
          },
        },
      },
      yaxis: {
        title: {
          text: 'Ball Possession %',
        },
        labels: {
          style: {
            colors: '#ffffff', // Étiquettes axe Y en blanc
          },
        },
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val.toFixed(1)}%`,
        },
      },
      title: {
        text: `Ball Possession % vs Équipes (${this.selectedSeasonName})`,
        align: 'center',
        style: {
        colors: '#ffffff',
        },
      },
    };
  }

  // Mettre à jour les options pour le graphique Attaques Dangereuses
  updateDangerousAttackChartOptions() {
    const categories = this.dangerousAttackStats.map(
      (item) => `${item.team_name} (#${item.team_position})`
    );
    const seriesDangerousAttacks = this.dangerousAttackStats.map((item) => item.dangerous_attacks);
    const seriesGoals = this.dangerousAttackStats.map((item) => item.goals_scored);

    this.chartOptionsDangerousAttacks = {
      series: [
        {
          name: 'Dangerous Attacks',
          type: 'column' , // barres pour les attaques dangereuses
          data: seriesDangerousAttacks,
        },
        {
          name: 'Goals Scored',
          type: 'line' , // ligne pour les goals
          data: seriesGoals,
        },
      ],
      chart: {
        height: 350,
        type: 'line', // Type combiné
        foreColor: '#ffffff',
      },
      stroke: {
        width: [0, 2], // Largeur : 0 pour les barres, 2 pour la ligne
      },
      xaxis: {
        categories: categories,
        title: {
          text: 'Équipes et Classement',
        },
        labels: {
          style: {
            colors: '#ffffff', // Étiquettes axe X en blanc
          },
        },

      },
      yaxis: [
        {
          title: {
            text: 'Dangerous Attacks',
          },
          labels: {
            style: {
              colors: '#ffffff', // Étiquettes axe Y en blanc
            },
          },
  
        },
        {
          opposite: true, // Place l'axe Y des buts sur la droite
          title: {
            text: 'Goals Scored',
          },
          labels: {
            style: {
              colors: '#ffffff', // Étiquettes axe Y en blanc
            },
          },
  
        },
      ],
      tooltip: {
        shared: true, // Regroupe les info-bulles
        intersect: false,
      },
      title: {
        text: `Dangerous Attacks & Goals (${this.selectedSeasonName})`,
        align: 'center',
        style: {
          colors: '#ffffff',
          },
  
      },
    };

    console.log('Options ApexCharts configurées (combiné) :', this.chartOptionsDangerousAttacks);
  }


  updatePieCharts(data: any[]) {
    console.log('Mise à jour des graphiques avec la saison :', this.selectedSeasonName);
    const celticData = data.filter((item) => item.team_name === 'Celtic');
    const rangersData = data.filter((item) => item.team_name === 'Rangers');

    console.log('Données pour Celtic :', celticData);
    console.log('Données pour Rangers :', rangersData);

    this.chartOptionsCeltic = {
      series: celticData.map((item) => parseFloat(item.goals_percentage)),
      chart: {
        type: 'pie',
        height: 350,
        foreColor: '#ffffff',
        zoom: { enabled: false }, // Désactiver le zoom
        animations: { enabled: false }, // Désactiver les animations
      },
      labels: celticData.map((item) => item.interval_time),
      title: {
        text: `Répartition des buts - Celtic (${this.selectedSeasonName})`,
        align: 'center',
      },
    };

    this.chartOptionsRangers = {
      series: rangersData.map((item) => parseFloat(item.goals_percentage)),
      chart: {
        type: 'pie',
        height: 350,
        foreColor: '#ffffff',
        zoom: { enabled: false }, // Désactiver le zoom
        animations: { enabled: false }, // Désactiver les animations
      },
      labels: rangersData.map((item) => item.interval_time),
      title: {
        text: `Répartition des buts - Rangers (${this.selectedSeasonName})`,
        align: 'center',
      },
    };

    console.log('Options pour Celtic :', this.chartOptionsCeltic);
    console.log('Options pour Rangers :', this.chartOptionsRangers);
  }
}
