import { computed, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User, AuthResponse } from '../models/user.model';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/internal/operators/tap';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private readonly API = 'http://localhost:4000/api/auth';
    private readonly TOKEN_KEY = 'megabank_jwt_secret_megacampus_2026_dwfsd';
    private readonly USER_KEY = 'megabank_user';

    currentUser = signal<User | null> (null);
    isAuthenticated = computed(() => !!this.currentUser() !== null);
    isAdmin = computed(() => this.currentUser()?.role === 'ADMIN');

    constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { 
      this.currentUser.set(this.loadUser());
    }


    private loadUser(): User | null {
      if(!isPlatformBrowser(this.platformId)) return null;
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    }

    login(email: string, password: string) : Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.API}/login`, { email, password })
      .pipe(tap(res => this.persist(res))); 
          
    }

    register(nom: string, email: string,  password: string) : Observable<AuthResponse> {
      return this.http.post<AuthResponse>(`${this.API}/register`, { nom, email, password })
        .pipe(tap(res => this.persist(res)));
    }

    private persist(auth: AuthResponse) {
      if(!isPlatformBrowser(this.platformId)) return ;
      localStorage.setItem(this.TOKEN_KEY, auth.token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(auth.user));
      this.currentUser.set(auth.user);
    }

    getToken(): string | null {
      if(!isPlatformBrowser(this.platformId)) return null;
      return localStorage.getItem(this.TOKEN_KEY);
    }
    
    logout() {
         if(isPlatformBrowser(this.platformId)) {;
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      }
      this.currentUser.set(null);
      this.router.navigate(['/login']);
    }
  }
  