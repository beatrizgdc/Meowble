import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';
import { CorreiosService } from '../../../correios/correiosService';
import { ServicoDeLogger } from '../../../utils/logger/logger';
import { HereMapsServiceDelivery } from '../../../hereMaps/calculoDelivery/service/hereMapsDeliveryService';
import formatStoreData from './formatStore';
import { getDeliveryCost } from './getDeliveryCost';
import { getFrete } from './getFrete';

export async function filterStores(
    lojas: LojaComDistancia[],
    distanceLimit: number,
    correiosService: CorreiosService,
    logger: ServicoDeLogger,
    cepDestino: string,
    latDestino: string,
    longDestino: string,
    hereMapsServiceDelivery: HereMapsServiceDelivery
) {
    const lojasMenor50Km: any[] = [];
    const lojasMaiorIgual50Km: any[] = [];

    // Categorizar e filtrar as lojas antes de calcular delivery/frete
    const lojasFiltradas = lojas.filter(
        (loja) => loja.distanciaKm != null && !isNaN(loja.distanciaKm)
    );

    for (const loja of lojasFiltradas) {
        if (
            loja.distanciaKm != null &&
            parseFloat(loja.distanciaKm.toString()) < distanceLimit
        ) {
            // Calcular delivery para lojas < 50km (todos os tipos)
            try {
                const deliveryCost = await getDeliveryCost(
                    parseFloat(loja.latitude),
                    parseFloat(loja.longitude),
                    parseFloat(latDestino),
                    parseFloat(longDestino),
                    loja.distanciaKm!,
                    hereMapsServiceDelivery,
                    logger
                );
                lojasMenor50Km.push(
                    formatStoreData(loja, [], loja.distanciaKm!, deliveryCost)
                );
            } catch (error) {
                logger.error('Erro ao calcular o custo de delivery', error);
            }
        } else if (loja.lojaTipo === 'LOJA') {
            try {
                const frete = await getFrete(
                    loja.codigoPostal,
                    cepDestino,
                    correiosService,
                    logger
                );
                loja.frete = frete;
                lojasMaiorIgual50Km.push(
                    formatStoreData(loja, frete, loja.distanciaKm!)
                );
            } catch (error) {
                logger.error('Erro ao calcular o frete', error);
            }
        }
    }

    // Ordenar por distância
    lojasMenor50Km.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );
    lojasMaiorIgual50Km.sort(
        (a, b) => parseFloat(a.distance) - parseFloat(b.distance)
    );

    return { lojasMenor50Km, lojasMaiorIgual50Km };
}
