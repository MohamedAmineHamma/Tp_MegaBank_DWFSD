export interface Compte {
    _id: string;
    numero: string;
    type: 'COURANT' | 'EPARGNE';
    solde: number;
    devise: string;
    proprietaire: { _id: number; nom: string; email: string };
}