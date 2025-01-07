import { getDistance } from 'geolib';
import { LojaDocument } from '../../schema/lojaSchema';
import { ServicoDeLogger } from '../../../utils/logger/logger';

export function calculateDistances(
    lojasData: LojaDocument[],
    coordenadas: any,
    logger: ServicoDeLogger
) {
    return lojasData.map((loja: LojaDocument) => {
        const lojaLatitude = parseFloat(loja.latitude);
        const lojaLongitude = parseFloat(loja.longitude);

        if (isNaN(lojaLatitude) || isNaN(lojaLongitude)) {
            logger.error(
                `Coordenadas inválidas para a loja ${loja.lojaNome}: Latitude ${loja.latitude}, Longitude ${loja.longitude}`,
                new Error(`Invalid coordinates for store ${loja.lojaNome}`)
            );
            return {
                ...loja.toObject(),
                distanciaKm: null,
            };
        }

        const distanceInMeters = getDistance(
            {
                latitude: coordenadas.latitude,
                longitude: coordenadas.longitude,
            },
            { latitude: lojaLatitude, longitude: lojaLongitude }
        );

        return {
            ...loja.toObject(),
            distanciaKm: distanceInMeters / 1000, // Converte para km
        };
    });
}
