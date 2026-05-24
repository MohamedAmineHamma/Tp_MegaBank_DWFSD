import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated())  return true;
    router.navigate(['/login']);
    return false;
}


export const adminGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    
    if (auth.isAdmin())  return true;
    router.navigate(['/dashboard']);
    return false;
}