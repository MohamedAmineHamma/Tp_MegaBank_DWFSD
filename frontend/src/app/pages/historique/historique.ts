import { Component, OnInit, signal } from '@angular/core';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../core/transaction.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './historique.html',
  styleUrl: './historique.css',
})
export class Historique  implements OnInit{

  items = signal<Transaction[]>([]);

  constructor( private transactionSvc: TransactionService) {}
  ngOnInit() {
    this.transactionSvc.history().subscribe(data => {
      this.items.set(data);
    });
  } 
}
