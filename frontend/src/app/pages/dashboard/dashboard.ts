import { Component, OnInit, signal } from '@angular/core';
import { Compte } from '../../models/compte.model';
import { AuthService } from '../../core/auth.service';
import { CompteService } from '../../core/compte.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  comptes = signal<Compte[]>([]);
  loading = signal(true);

  constructor(public auth: AuthService, private compteSvc: CompteService) { }

  ngOnInit() {
    this.compteSvc.list().subscribe({
      next: (data) => { this.comptes.set(data), this.loading.set(false) },
      error: () => this.loading.set(false)
    });
  }

}
