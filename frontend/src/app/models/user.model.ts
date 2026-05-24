export interface User {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    role: 'CLIENT' | 'ADMIN';
}

export interface AuthResponse { token: string; user: User; }