import { LojaComDistancia } from '../../interface/lojaComDistanciaInterface';

export function filterStores(lojas: LojaComDistancia[], distanceLimit: number) {
    const lojasMenor50Km = lojas.filter(
        (loja) => loja.distanciaKm !== null && loja.distanciaKm < distanceLimit
    );

    const lojasMaiorIgual50Km = lojas.filter(
        (loja) => loja.distanciaKm !== null && loja.distanciaKm >= distanceLimit
    );

    lojasMenor50Km.sort((a, b) => a.distanciaKm! - b.distanciaKm!);
    lojasMaiorIgual50Km.sort((a, b) => a.distanciaKm! - b.distanciaKm!);

    return { lojasMenor50Km, lojasMaiorIgual50Km };
}
