import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule], // Import nécessaire pour routerLink
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'] // Corrige 'styleUrl' en 'styleUrls'
})
export class LandingComponent {}

