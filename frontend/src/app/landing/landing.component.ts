import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageService } from '../image.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  imageUrl: string | undefined;

  constructor(
    private imageService: ImageService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.loadImage();
    this.setupKeyboardNavigation();
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

  // Gère la navigation clavier pour améliorer l'accessibilité
  setupKeyboardNavigation(): void {
    const elements = this.el.nativeElement.querySelectorAll('[tabindex="0"]');

    elements.forEach((element: HTMLElement) => {
      this.renderer.listen(element, 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          element.click();
        }
      });
    });
  }
}
