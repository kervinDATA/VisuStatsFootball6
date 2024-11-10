import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { TeamService } from '../services/team.service';
import { SeasonService } from '../services/season.service';


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
  seasons: string[] = [];
  teams: any[] = [];

  constructor(private teamService: TeamService, private seasonService: SeasonService) {}


  ngOnInit() {
    this.loadSeasons();
    this.loadTeams();
  }

  selectFilter(type: 'saison' | 'equipe') {
    this.isSeasonSelected = type === 'saison';
    this.isTeamSelected = type === 'equipe';
  }

  loadSeasons() {
    this.seasonService.getSeasons().subscribe((data: { season_name: string }[]) => {
      this.seasons = data.map((season: { season_name: string }) => season.season_name);
    });
  }

  loadTeams() {
    this.teamService.getTeams().subscribe((data) => {
      this.teams = data;
    });
  }

  loadTeamStats() {
    // Logique de chargement des stats d'équipe
  }


  selectSeason(season: string) {
    this.isSeasonSelected = true;
    this.isTeamSelected = false;
    this.selectedSeasonName = season;
    this.loadSeasonData(season); // Charge les données de la saison
  }
  
  selectTeam(team: any) {
    this.isSeasonSelected = false;
    this.isTeamSelected = true;
    this.selectedTeamName = team.name;
    this.teamImageUrl = team.image; // Si l'image de l'équipe est disponible dans les données
    this.loadTeamData(team.id); // Charge les données de l'équipe
  }
  
  loadSeasonData(season: string) {
    // Appel au service pour récupérer les données spécifiques à cette saison
  }
  
  loadTeamData(teamId: number) {
    // Appel au service pour récupérer les données spécifiques à cette équipe
  }
  
}
