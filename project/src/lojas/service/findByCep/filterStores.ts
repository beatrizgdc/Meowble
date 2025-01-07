import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';
import { CorreiosService } from '../../../correios/correiosService';
import { CorreiosDto } from '../../../correios/correiosDTO';
import { ServicoDeLogger } from '../../../utils/logger/logger';
import { formatCep } from './formatCep';

function formatStoreData(
    loja: LojaComDistancia,
    frete: any,
    distanciaKm: number
) {
    return {
        name: loja.lojaNome,
        postalCode: loja.codigoPostal,
        type: loja.lojaTipo,
        distance: `${distanciaKm.toFixed(0)} km`,
        value: frete.map((item: any) => ({
            prazo: item.prazo,
            codProdutoAgencia: item.codProdutoAgencia,
            price: item.precoAgencia,
            description: item.urlTitulo,
        })),
        pins: {
            position: {
                lat: loja.latitude,
                lng: loja.longitude,
            },
            title: loja.lojaNome,
        },
    };
}

export async function filterStores(
    lojas: LojaComDistancia[],
    distanceLimit: number,
    correiosService: CorreiosService,
    logger: ServicoDeLogger,
    cepDestino: string,
    latDestino: string,
    longDestino: string
) {
    const lojasMenor50Km = lojas.filter(
        (loja) => loja.distanciaKm !== null && loja.distanciaKm < distanceLimit
    );

    const lojasMaiorIgual50Km: any[] = [];
    const lojasFiltradas = lojas.filter(
        (loja) =>
            loja.distanciaKm !== null &&
            loja.distanciaKm >= distanceLimit &&
            loja.lojaTipo !== 'PDV'
    );

    for (const loja of lojasFiltradas) {
        const correiosDto: CorreiosDto = {
            servico: '04014',
            cepOrigem: formatCep(loja.codigoPostal),
            cepDestino: formatCep(cepDestino),
            Peso: '1',
            Formato: '1',
            Comprimento: '20',
            Altura: '10',
            Largura: '15',
            Diametro: '0',
            MaoPropria: 'N',
            ValorDeclarado: '0',
            AvisoRecebimento: 'N',
        };

        console.log('Dados enviados para a API dos Correios:', correiosDto);

        try {
            const frete = await correiosService.obterPrecosEPrazos(correiosDto);
            loja.frete = frete;
            lojasMaiorIgual50Km.push(
                formatStoreData(loja, frete, loja.distanciaKm!)
            );
            console.log('sucesso!');
        } catch (error) {
            if (error instanceof Error) {
                console.error(
                    `Erro ao calcular o frete: ${error.message}`,
                    error
                );
            } else {
                console.error('Erro ao calcular o frete: tipo desconhecido');
            }
        }
    }

    lojasMenor50Km.sort((a, b) => a.distanciaKm! - b.distanciaKm!);
    lojasMaiorIgual50Km.sort((a, b) => a.distance - b.distance);

    return { lojasMenor50Km, lojasMaiorIgual50Km };
}
