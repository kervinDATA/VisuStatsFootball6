import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token de localStorage
    const token = localStorage.getItem('token');

    // Cloner la requête pour ajouter le nouvel en-tête
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Ajouter le token à l'en-tête Authorization
        }
      });
    }

    return next.handle(req); // Passer la requête modifiée au prochain handler
  }
}
