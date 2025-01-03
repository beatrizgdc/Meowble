import { Schema, Document } from 'mongoose';

export interface LojaDocument extends Document, Loja {}

export interface Loja {
    lojaID: "String";
    lojaNome: "String";
    lojaTipo: "String";
    disponivelNoEstoque: true;
    tempoDePreparo: number;
    latitude: "String";
    longitude: "String";
    codigoPostal: "String";
    numero: number;
    pais: "String";
    lojaTelefone: "String";
}

export const LojaSchema = new Schema({
    lojaID: { type: String, required: true },
    lojaNome: { type: String, required: true },
    lojaTipo: { type: String, required: true },
    disponivelNoEstoque: { type: Boolean, required: true },
    tempoDePreparo: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    numero: { type: Number, required: true },
    pais: { type: String, required: true },
    lojaTelefone: { type: String, required: true },
});
