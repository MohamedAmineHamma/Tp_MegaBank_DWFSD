import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './core/auth.guard';

export const routes: Routes = [

    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login)},
    {path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.Register)},
    {path: 'dashboard', canActivate: [authGuard], loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard)},
    {path: 'virement', canActivate: [authGuard], loadComponent: () => import('./pages/virement/virement').then(m => m.Virement)},
    {path: 'historique', canActivate: [adminGuard], loadComponent: () => import('./pages/historique/historique').then(m => m.Historique)},
    {path : '**', redirectTo: 'login'}

];
