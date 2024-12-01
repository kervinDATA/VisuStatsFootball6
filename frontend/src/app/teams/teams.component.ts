import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  selectedTeamDetails: any = null; // Stocke les détails d'une équipe sélectionnée
  selectedTeamStanding: any = null; // Classement de l'équipe sélectionnée pour une saison
  standingsBySeason: any[] = []; // Stocker les standings pour toutes les saisons

  // Listes de données
  seasons: { season_id: number, season_name: string }[] = [];
  teams: any[] = [];
  selectedSeasonStats: any;

  // Propriétés pour les statistiques
  totalGoals: number | null = null;
  intervalGoals: any = {};
  penaltyStats: any = {};

  // Images
  imageUrl: string | undefined;
  logoVisuStatsUrl: string | undefined;
  welcomeImageUrl: string | undefined;

  constructor(
    private teamService: TeamService,
    private seasonService: SeasonService,
    private imageService: ImageService
  ) {}

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

    this.loadSeasonData(String(seasonId));
  }

  selectTeam(team: any) {
    this.isSeasonSelected = false;
    this.isTeamSelected = true;
    this.selectedTeamName = team.name;
    this.teamImageUrl = team.image;
    this.selectedTeamDetails = null;
    this.standingsBySeason = []; // Réinitialisez la liste
  
    // Récupérer les détails de l'équipe
    this.teamService.getTeamDetails(team.team_id).subscribe({
      next: (details) => {
        console.log('Détails de l\'équipe récupérés :', details);
        this.selectedTeamDetails = details;
  
        // Charger le classement pour toutes les saisons
        this.teamService.getStandingsForAllSeasons(team.team_id).subscribe({
          next: (standings) => {
            console.log('Classements récupérés :', standings);
            this.standingsBySeason = standings;
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des standings :', err);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des détails de l\'équipe :', err);
      }
    });

    this.teamService.getTeamImage(team.team_id).subscribe({
      next: (response) => {
        this.teamImageUrl = response.image;
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de l'image de l'équipe :", err);
      }
    });
  }
  
  loadStandingsForTeam(teamId: number) {
    this.seasons.forEach((season) => {
      this.teamService.getTeamStandingForSeason(teamId, season.season_id).subscribe({
        next: (standing) => {
          if (standing && standing.position !== undefined) {
            this.standingsBySeason.push({
              season_name: season.season_name,
              position: standing.position,
              points: standing.points,
            });
          }
        },
        error: (err) => {
          console.error(`Erreur lors du chargement du classement pour la saison ${season.season_name} :`, err);
        }
      });
    });
  }


  loadSeasonData(seasonId: string) {
    this.seasonService.getSeasonStats(seasonId).subscribe(data => {
      this.selectedSeasonStats = data;
      console.log('Statistiques de la saison :', data);
    });

    // Charger d'autres statistiques de saison
    this.seasonService.getTotalGoals(this.selectedSeasonName).subscribe(data => {
      this.totalGoals = data.total_goals;
    });

    this.seasonService.getGoalsByInterval(this.selectedSeasonName).subscribe(data => {
      this.intervalGoals = data;
    });

    this.seasonService.getPenaltyStats(this.selectedSeasonName).subscribe(data => {
      this.penaltyStats = data;
    });

    this.seasonService.getSeasonStandings(seasonId).subscribe(standings => {
      console.log('Classement reçu :', standings);
      this.selectedSeasonStats = {
        ...this.selectedSeasonStats,
        classement: standings
      };
    });
  }

  loadTeamStanding(teamId: number, seasonId: number) {
    if (!teamId || !seasonId) {
      console.warn("Team ID ou Season ID manquant.");
      return;
    }
  
    this.teamService.getTeamStats(teamId, String(seasonId)).subscribe({
      next: (data) => {
        console.log('Classement de l\'équipe pour la saison récupéré :', data);
        this.selectedTeamStanding = data; // Stocker les données reçues
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du classement de l\'équipe :', err);
      }
    });
  }

  loadImage(): void {
    this.imageService.getImageUrl('logo_scottish_premiership.jpg').subscribe(
      (response) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement de l\'image :', error);
      }
    );

    this.imageService.getImageUrl('logo_VisuStatsFootball.jpg').subscribe(
      (response) => {
        this.logoVisuStatsUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement du logo VisuStatsFootball :', error);
      }
    );

    this.imageService.getImageUrl('analyste_stade.png').subscribe(
      (response) => {
        this.welcomeImageUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement de l\'image d\'accueil :', error);
      }
    );
  }

}
