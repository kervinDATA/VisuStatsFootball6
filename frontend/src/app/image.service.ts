import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://localhost:5002/api/images';

  constructor(private http: HttpClient) {}

  // Méthode pour obtenir l'URL d'une image en fonction de son nom
  getImageUrl(imageName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/image-url/${imageName}`);
  }
}
