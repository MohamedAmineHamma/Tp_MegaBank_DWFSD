import {  Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Compte } from '../models/compte.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class CompteService {
    private API = 'http://localhost:4000/api';

    constructor(private http: HttpClient) { }

    list(): Observable<Compte[]> { return this.http.get<Compte[]>(`${this.API}/comptes`);}

    getOne(id: string): Observable<Compte> { return this.http.get<Compte>(`${this.API}/comptes/${id}`);}

    virement(payload: { compteSourceId: string, compteDestinationId: string, montant: number, libelle?: string }) {
        return this.http.post(`${this.API}/comptes/virements`, payload);
    }

}