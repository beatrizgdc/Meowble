import { HereMapsServiceDelivery } from '../../../hereMaps/calculoDelivery/service/hereMapsDeliveryService';
import { GetDeliveryCustoDto } from '../../../hereMaps/calculoDelivery/dto/hereMapsCustoDeliveryDtos';
import { ServicoDeLogger } from '../../../utils/logger/logger';

export async function getDeliveryCost(
    lojaLatitude: number,
    lojaLongitude: number,
    latDestino: number,
    longDestino: number,
    distanciaKm: number,
    hereMapsServiceDelivery: HereMapsServiceDelivery,
    logger: ServicoDeLogger
) {
    const deliveryDto: GetDeliveryCustoDto = {
        origemLatitude: lojaLatitude,
        origemLongitude: lojaLongitude,
        destinoLatitude: latDestino,
        destinoLongitude: longDestino,
        distanciaKm,
    };

    try {
        const deliveryCost = await hereMapsServiceDelivery.getDeliveryCost(
            deliveryDto
        );
        // logger.log('Custo de delivery calculado com sucesso!');
        return deliveryCost;
    } catch (error) {
        if (error instanceof Error) {
            logger.error(
                `Erro ao calcular o custo de delivery: ${error.message}`,
                error
            );
        } else {
            logger.error(
                'Erro ao calcular o custo de delivery: tipo desconhecido',
                error
            );
        }
        throw error;
    }
}
