# Testes do Serviço `findByCepServiceService`

## Índice

1. [Introdução](#introdução)
2. [Critérios de Teste](#critérios-de-teste)
    - [Cenário 1: Mockar coordenadas de latitude e longitude](#cenário-1-mockar-coordenadas-de-latitude-e-longitude)
    - [Cenário 2: Mockar dados das lojas e suas distâncias](#cenário-2-mockar-dados-das-lojas-e-suas-distâncias)
    - [Cenário 3: Mockar os métodos](#cenário-3-mockar-os-métodos)
    - [Cenário 4: Verificar o resultado do serviço](#cenário-4-verificar-o-resultado-do-serviço)
    - [Cenário 5: Verificar que o logger registra a mensagem de sucesso](#cenário-5-verificar-que-o-logger-registra-a-mensagem-de-sucesso)
3. [Conclusão](#conclusão)

## Introdução

Este documento descreve os critérios e cenários de teste para garantir que o serviço `findByCepServiceService` retorne as lojas categorizadas corretamente com distâncias a menos e mais de 50km. Além disso, verifica-se se o serviço loga mensagens de sucesso adequadamente.

## Critérios de Teste

### Cenário 1: Mockar coordenadas de latitude e longitude

-   **Descrição**: O método `getCoordinates` deve retornar coordenadas específicas.
-   **Mock**:
    ```javascript
    { latitude: -23.5489, longitude: -46.6388 }
    ```

### Cenário 2: Mockar dados das lojas e suas distâncias

-   **Descrição**: O método `calculateDistances` deve retornar uma lista de lojas com suas respectivas distâncias.
-   **Mock**:
    ```javascript
    [
        { id: 1, name: 'Loja 1', distancia: 30 },
        { id: 2, name: 'Loja 2', distancia: 60 },
    ];
    ```

### Cenário 3: Mockar os métodos

-   **Descrição**: Mockar os métodos `getCoordinates`, `calculateDistances`, `filterStores` e `categorizeStores` para retornarem dados específicos.
-   **Mock**:
    -   `getCoordinates` retorna `{ latitude: -23.5489, longitude: -46.6388 }`
    -   `calculateDistances` retorna uma lista de lojas com distâncias
    -   `filterStores` retorna lojas divididas em `lojasMenor50Km` e `lojasMaiorIgual50Km`
        ```javascript
        {
            lojasMenor50Km: [{ id: 1, name: 'Loja 1', distancia: 30 }],
            lojasMaiorIgual50Km: [{ id: 2, name: 'Loja 2', distancia: 60 }],
        }
        ```
    -   `categorizeStores` retorna `{ tipoA: [], tipoB: [] }`

### Cenário 4: Verificar o resultado do serviço

-   **Descrição**: Verificar que o serviço `findByCep` retorna as lojas categorizadas corretamente.
-   **Resultado Esperado**:
    ```javascript
    {
        stores: {
            menor50Km: { tipoA: [], tipoB: [] },
            maiorIgual50Km: [{ id: 2, name: 'Loja 2', distancia: 60 }],
        },
        limit: 10,
        offset: 0,
        total: 2,
    }
    ```

### Cenário 5: Verificar que o logger registra a mensagem de sucesso

-   **Descrição**: Após a execução do serviço, o logger deve registrar uma mensagem de sucesso.
-   **Resultado Esperado**:
    ```javascript
    'Busca de lojas por CEP concluída com sucesso.';
    ```
