import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators , FormBuilder, FormGroup} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Compte } from '../../models/compte.model';
import { CompteService } from '../../core/compte.service';


@Component({
  selector: 'app-virement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './virement.html',
  styleUrl: './virement.css',
})
export class Virement implements OnInit {

  mesComptes = signal<Compte[]>([]);
  loading = signal(false);
  error = signal('');
  succes = signal('');

  form! : FormGroup;

  constructor( private fb : FormBuilder , private compteSvc : CompteService,  private router: Router) {

    this.form = this.fb.group({
    sourceId: ['', Validators.required],
    destinationId: ['', Validators.required],
    montant: [0,  [Validators.required, Validators.min(0.01)]],
    libelle: ['']
  });
   }

  ngOnInit()  { this.compteSvc.list().subscribe(c => this.mesComptes.set(c)); }
  
  submit() {
    if (this.form.invalid) return;
    
    this.loading.set(true);
    this.error.set('');
    this.succes.set('');

    this.compteSvc.virement(this.form.value as any ).subscribe({
      next: (res : any) => {
        this.succes.set('Virement effectué - Ref : '+ res.reference);
          this.loading.set(false);
          setTimeout(() => this.router.navigate(['/dashboard']), 2000);
        }, 
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors du virement.');
        this.loading.set(false);
      }
    });
  }
}
