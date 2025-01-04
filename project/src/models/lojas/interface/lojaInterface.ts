import { Document } from 'mongoose';

export interface LojaDocument extends Document, Loja {}

export interface Loja {
    lojaNome: "String";
    lojaTipo: "String";
    disponivelNoEstoque: boolean;
    tempoDePreparo: number;
    latitude: "String";
    longitude: "String";
    codigoPostal: "String";
    numero: number;
    pais: "String";
    lojaTelefone: "String";
}