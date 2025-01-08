import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';
import { ServicoDeLogger } from '../../../utils/logger/logger';

export function categorizeStores(
    lojasMenor50Km: LojaComDistancia[],
    logger: ServicoDeLogger
) {
    // Log para verificar o número de lojas antes da filtragem
    logger.log(`Total de lojas recebidas: ${lojasMenor50Km.length}`);

    const tiposDeLojasMenor50Km = lojasMenor50Km.reduce<{
        [key: string]: LojaComDistancia[];
    }>(
        (acc, loja) => {
            if (loja && loja.lojaTipo) {
                const lojaTipo = loja.lojaTipo;
                if (lojaTipo === 'PDV') {
                    if (!acc['pdvs']) acc['pdvs'] = [];
                    acc['pdvs'].push(loja);
                } else if (lojaTipo === 'LOJA') {
                    if (!acc['lojas']) acc['lojas'] = [];
                    acc['lojas'].push(loja);
                } else {
                    logger.warn(`Tipo de loja desconhecido: ${lojaTipo}`);
                }
            } else {
                logger.warn(
                    `Loja inválida ou sem tipo: ${JSON.stringify(loja)}`
                );
            }
            return acc;
        },
        { pdvs: [], lojas: [] }
    );

    // Log para conferir os tipos de lojas categorizadas
    // logger.log(`Lojas categorizadas: ${JSON.stringify(tiposDeLojasMenor50Km)}`);
    return tiposDeLojasMenor50Km;
}
