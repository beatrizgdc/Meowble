import mongoose, { Schema, Document, model } from 'mongoose';
import { LojaDocument } from '../interface/lojaInterface';

export const LojaSchema = new Schema({
    lojaNome: { type: String, required: true },
    lojaTipo: { type: String, required: true },
    disponivelNoEstoque: { type: Boolean, required: true },
    tempoDePreparo: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    codigoPostal: { type: String, required: true },
    numero: { type: Number, required: true },
    uf: { type: String, required: true },
    pais: { type: String, required: true },
    lojaTelefone: { type: String, required: true },
});

export const LojaModel = model<LojaDocument>('Loja', LojaSchema);
export type { LojaDocument };
