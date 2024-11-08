import { Route } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { TeamsComponent } from './teams/teams.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { UserPageComponent } from './user-page/user-page.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';

export const routes: Route[] = [
  { path: '', component: LandingComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'analysis', component: AnalysisComponent },
  { path: 'user-page', component: UserPageComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent }
];

