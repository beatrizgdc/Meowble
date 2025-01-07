import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';
import { ServicoDeLogger } from '../../../utils/logger/logger';

export function categorizeStores(
    lojasMenor50Km: LojaComDistancia[],
    logger: ServicoDeLogger
) {
    const tiposDeLojasMenor50Km = lojasMenor50Km.reduce<{
        [key: string]: LojaComDistancia[];
    }>(
        (acc, loja) => {
            const lojaTipo = loja.lojaTipo.valueOf();

            if (lojaTipo === 'PDV') {
                if (!acc['pdvs']) acc['pdvs'] = [];
                acc['pdvs'].push(loja);
            } else if (lojaTipo === 'LOJA') {
                if (!acc['lojas']) acc['lojas'] = [];
                acc['lojas'].push(loja);
            } else {
                logger.warn(`Tipo de loja desconhecido: ${loja.lojaTipo}`);
            }
            return acc;
        },
        { pdvs: [], lojas: [] }
    );

    return tiposDeLojasMenor50Km;
}
