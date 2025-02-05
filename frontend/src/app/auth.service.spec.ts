import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http'; // Ajouté pour HttpClient
import { AuthService } from './auth.service';

describe('AuthService', () => { // ✅ Tout doit être dans ce `describe`
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(), // Fournit HttpClient pour le test
        provideHttpClientTesting() // Permet de simuler les requêtes HTTP
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ✅ Correctement placé DANS `describe`
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve token correctly', () => {
    service.storeToken('mockToken123');
    expect(localStorage.getItem('token')).toBe('mockToken123');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should remove token on logout', () => {
    localStorage.setItem('token', 'mockToken123');
    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should handle login error', () => {
    service.login('test@example.com', 'wrongpassword').subscribe(
      () => fail('should have failed with 401 error'),
      (error) => {
        expect(error.status).toBe(401);
      }
    );

    const req = httpMock.expectOne('http://localhost:5002/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });
});
