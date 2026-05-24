import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  loading = signal(false);
  error = signal('');
  form; 
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) { 
  this.form = this.fb.group({
    email: ['', Validators.required, Validators.email],
    password: ['', Validators.required, Validators.minLength(6)],
  });
}


  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () =>  this.router.navigate(['/dashboard']),
      error: (err) => { this.error.set(err.error?.message || 'ERREUR '); this.loading.set(false);
      },
      complete: () => this.loading.set(false)
    });
  
  }

}
