export interface Transaction {
    _id: string;
    reference: string;
    type: 'DEBIT' | 'CREDIT';
    montant: number;
    libelle: string;
    soldeApres: number;
    createdAt: string;
    compte: { numero: string; type: string };
    comptepartie? :{ numero: string};
}