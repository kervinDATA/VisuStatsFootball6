import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppComponent } from '../app.component';

class MockAuthService {
  login = jasmine.createSpy().and.returnValue(of({ token: 'mockToken', user: { id: '1', email: 'test@example.com' } }));
  storeToken = jasmine.createSpy();
  storeUser = jasmine.createSpy();
}

class MockRouter {
  navigate = jasmine.createSpy();
}

class MockAppComponent {
  showNotification = jasmine.createSpy();
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: MockAuthService;
  let router: MockRouter;
  let appComponent: MockAppComponent;

  beforeEach(async () => {
    authService = new MockAuthService();
    router = new MockRouter();
    appComponent = new MockAppComponent();

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: AppComponent, useValue: appComponent }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password fields', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should require a valid email', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalidEmail');
    expect(emailControl?.valid).toBeFalse();
    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should require a password with at least 6 characters', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    expect(passwordControl?.valid).toBeFalse();
    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should call AuthService login and store token on success', () => {
    component.loginForm.setValue({ email: 'test@example.com', password: 'password123' });
    component.onLogin();

    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(authService.storeToken).toHaveBeenCalledWith('mockToken');
    expect(authService.storeUser).toHaveBeenCalledWith({ id: '1', email: 'test@example.com' });
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(appComponent.showNotification).toHaveBeenCalledWith('Connexion réussie !');
  });

  it('should show an error message if login fails', () => {
    authService.login.and.returnValue(throwError(() => new Error('Erreur de connexion')));

    component.loginForm.setValue({ email: 'test@example.com', password: 'wrongpassword' });
    component.onLogin();

    expect(component.errorMessage).toBe('Email ou mot de passe incorrect');
  });
});
