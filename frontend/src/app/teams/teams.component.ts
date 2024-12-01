import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TeamService } from '../services/team.service';
import { SeasonService } from '../services/season.service';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  // Propriétés d'état pour la sélection
  isSeasonSelected: boolean = false;
  isTeamSelected: boolean = false;

  // Propriétés pour stocker les informations sélectionnées
  selectedSeasonName: string = '';
  selectedTeamName: string = '';
  seasonImageUrl: string = '';
  teamImageUrl: string = '';
  selectedTeamSeason: string = '';

  // Listes de données
  seasons: { season_id: number, season_name: string }[] = [];
  teams: any[] = [];
  selectedSeasonStats: any;

  // Propriété pour les statisques
  totalGoals: number | null = null;
  intervalGoals: any = {};
  penaltyStats: any = {};

  imageUrl: string | undefined;
  logoVisuStatsUrl: string | undefined;
  welcomeImageUrl: string | undefined;

  constructor(private teamService: TeamService, private seasonService: SeasonService, private imageService: ImageService) {}

  ngOnInit() {
    this.loadSeasons();
    this.loadTeams();
    this.loadImage();
  }

  selectFilter(type: 'saison' | 'equipe') {
    this.isSeasonSelected = type === 'saison';
    this.isTeamSelected = type === 'equipe';
  }

  loadSeasons() {
    this.seasonService.getSeasons().subscribe((data: { season_id: number, season_name: string }[]) => {
      this.seasons = data;
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe((data) => {
      this.teams = data;
    });
  }

  selectSeason(seasonId: number) {
    this.isSeasonSelected = true;
    this.isTeamSelected = false;
    const selectedSeason = this.seasons.find(season => season.season_id === seasonId);
    this.selectedSeasonName = selectedSeason ? selectedSeason.season_name : '';

    // Appel avec conversion en string si requis
    this.loadSeasonData(String(seasonId));

  }

  selectTeam(team: any) {
    this.isSeasonSelected = false;
    this.isTeamSelected = true;
    this.selectedTeamName = team.name;
    this.teamImageUrl = team.image;
    this.loadTeamData(team.id);
  }


  loadSeasonData(seasonId: string) {
    this.seasonService.getSeasonStats(seasonId).subscribe(data => {
      this.selectedSeasonStats = data;
      console.log("Statistiques de la saison :", data);
    });

    // Charger le nombre total de buts
    this.seasonService.getTotalGoals(this.selectedSeasonName).subscribe(data => {
      this.totalGoals = data.total_goals;
    });

    // Charger les buts par intervalle de temps pour la saison sélectionnée
    this.seasonService.getGoalsByInterval(this.selectedSeasonName).subscribe(data => {
      this.intervalGoals = data;
    });

    // Charger les statistiques de penalties pour la saison sélectionnée
    this.seasonService.getPenaltyStats(this.selectedSeasonName).subscribe(data => {
      this.penaltyStats = data;
    });


    // Charger le classement pour la saison sélectionnée
    this.seasonService.getSeasonStandings(seasonId).subscribe(standings => {
      console.log("Classement reçu :", standings);
      this.selectedSeasonStats = {
        ...this.selectedSeasonStats,
        classement: standings
      };
    });
  }

  loadImage(): void {
    this.imageService.getImageUrl('logo_scottish_premiership.jpg').subscribe(
      (response) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement de l\'image:', error);
      }
    );

    this.imageService.getImageUrl('logo_VisuStatsFootball.jpg').subscribe(
      (response) => {
        this.logoVisuStatsUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement du logo VisuStatsFootball:', error);
      }
    );

    this.imageService.getImageUrl('analyste_stade.png').subscribe(
      (response) => {
        this.welcomeImageUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement de l\'image d\'accueil:', error);
      }
    );
  }


  loadTeamData(teamId: number) {
    // Ici, ajoutez la logique pour charger les données spécifiques à une équipe
  }
}

