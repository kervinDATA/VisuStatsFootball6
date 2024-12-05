import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SeasonService } from '../services/season.service';
import { UserPageService } from '../services/user-page.service';

@Component({
  selector: 'app-user-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgApexchartsModule],
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css'],
})
export class UserPageComponent implements OnInit {
  seasons: string[] = [];
  selectedSeason: string = '';
  selectedStatType: string = ''; // Type de statistique sélectionné
  chartData: any = null; // Données pour le graphique

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

  constructor(private seasonService: SeasonService, private userPageService: UserPageService) {}

  ngOnInit(): void {
    this.loadSeasons();
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

  updateChart(): void {
    if (!this.selectedSeason || !this.selectedStatType) {
      console.warn('Veuillez sélectionner une saison et un type de statistique.');
      return;
    }
  
    const selectedRoute = this.statTypes.find((type) => type.route === this.selectedStatType)?.route;
  
    if (!selectedRoute) {
      console.warn('Type de statistique non reconnu.');
      return;
    }
  
    this.userPageService.getStatData(selectedRoute, {
      season_name: this.selectedSeason,
    }).subscribe(
      (data) => {
        console.log('Données reçues pour le graphique :', data);
  
        if (!data || data.length === 0) {
          console.warn('Aucune donnée reçue pour ce filtre.');
          this.chartData = null;
          return;
        }
  
        if (selectedRoute === 'scoring-intervals') {
          // Logique spécifique pour un graphique empilé
          const teams: string[] = Array.from(new Set(data.map((item: any) => 
            `${item.team_name} #${item.team_position || ''}`.trim()
        )));
          const intervals: string[] = Array.from(new Set(data.map((item: any) => item.interval_time)));
        
          const series = intervals.map((interval: string) => {
            return {
              name: interval, // L'intervalle de temps comme nom de la série
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
        
          this.chartData = {
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
          // Logique pour les autres types de graphiques
          const categories = data.map((item: any) =>
            `${item.team_name} ${item.team_position ? `#${item.team_position}` : ''}`.trim()
          );

          const seriesData = data.map((item: any) =>
            item.total_wins || item.total_lost || item.total_draw || item.count || 0
          );

          this.chartData = {
            series: [
              {
                name: this.selectedStatType,
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
}