import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const token = auth.getToken();

    const cloned = token  && !req.url.includes('/auth/login') && !req.url.includes('/auth/register') 
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

    return next(cloned)
    .pipe(catchError((err : HttpErrorResponse) => {
        if (err.status === 401) {
            auth.logout();
        }
        return throwError(() => err);
    }));
};