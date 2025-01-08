import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';

function formatStoreData(
    loja: LojaComDistancia,
    frete: any,
    distanciaKm: number,
    deliveryCost?: { estimatedTimeMin: number; totalCost: number }
) {
    return {
        name: loja.lojaNome,
        postalCode: loja.codigoPostal,
        lojaTipo: loja.lojaTipo,
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
            title: loja.lojaNome,
        },
    };
}

export default formatStoreData;
