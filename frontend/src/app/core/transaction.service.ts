import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Transaction } from '../models/transaction.model';


@Injectable({
  providedIn: 'root',
})

export class TransactionService {
    constructor(private http: HttpClient) { }

    history(){ return this.http.get<Transaction[]>(`http://localhost:4000/api/transactions`);}

}