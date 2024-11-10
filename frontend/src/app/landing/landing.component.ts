import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ImageService } from '../image.service'; // Assurez-vous que le chemin est correct
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule], // Pas besoin de HttpClientModule ici
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  imageUrl: string | undefined;

  constructor(private imageService: ImageService) {}

  ngOnInit(): void {
    this.loadImage();
  }

  loadImage(): void {
    this.imageService.getImageUrl('photo_landing_under_header.jpeg').subscribe(
      (response) => {
        this.imageUrl = response.url;
      },
      (error) => {
        console.error('Erreur de chargement de l\'image:', error);
      }
    );
  }
}
