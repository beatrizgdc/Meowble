import { Document } from 'mongoose';

export interface LojaDocument extends Document, Loja {}

export interface Loja {
    lojaNome: string;
    lojaTipo: string;
    disponivelNoEstoque: boolean;
    tempoDePreparo: number;
    latitude: string;
    longitude: string;
    codigoPostal: string;
    numero: number;
    uf: string;
    pais: string;
    lojaTelefone: string;
}
