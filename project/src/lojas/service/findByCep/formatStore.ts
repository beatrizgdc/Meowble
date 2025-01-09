import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';

function formatStoreData(
    loja: LojaComDistancia,
    frete: any,
    distanciaKm: number,
    deliveryCost?: { estimatedTimeMin: number; totalCost: number }
) {
    return {
        name: loja.storeName,
        postalCode: loja.postalCode,
        city: loja.city,
        type: loja.type,
        distance: `${distanciaKm.toFixed(0)} km`,
        value: frete.map((item: any) => ({
            prazo: item.prazo,
            codProdutoAgencia: item.codProdutoAgencia,
            price: item.precoAgencia,
            description: item.urlTitulo,
        })),
        delivery: deliveryCost
            ? {
                  estimatedTimeMin: deliveryCost.estimatedTimeMin,
                  totalCost: `R$ ${deliveryCost.totalCost.toFixed(2)}`,
              }
            : undefined,
        pins: {
            position: {
                lat: loja.latitude,
                lng: loja.longitude,
            },
            title: loja.storeName,
        },
    };
}

export default formatStoreData;
