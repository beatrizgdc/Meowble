# Testes do Serviço `FindByIdService`

## Índice

1. [Introdução](#introdução)
2. [Cenários de Teste](#cenários-de-teste)
    - [Cenário 1: Retornar uma lista vazia se a loja não for encontrada](#cenário-1-retornar-uma-lista-vazia-se-a-loja-não-for-encontrada)
    - [Cenário 2: Retornar os dados da loja se a loja for encontrada](#cenário-2-retornar-os-dados-da-loja-se-a-loja-for-encontrada)
3. [Conclusão](#conclusão)

## Introdução

Este documento descreve os cenários de teste para o serviço `FindByIdService`. O objetivo é garantir que o serviço funcione corretamente em diferentes situações, retornando as informações adequadas da loja ou mensagens de erro apropriadas.

## Cenários de Teste

### Cenário 1: Retornar uma lista vazia se a loja não for encontrada

-   **Descrição**: Verifica se o serviço retorna uma resposta apropriada quando a loja não é encontrada.
-   **Expectativa**:
    -   Mockar o método `findById` do `LojaRepository` para retornar `null`.
    -   Chamar o método `findById` do `FindByIdService` com um ID de loja inválido (`'invalidId'`).
    -   Verificar se o resultado do serviço retorna:
        ```json
        {
            "lojas": [],
            "limite": 1,
            "offset": 0,
            "total": 0,
            "mensagem": "Loja com ID invalidId não encontrada."
        }
        ```
    -   Verificar que o logger registra a mensagem de erro apropriada.

### Cenário 2: Retornar os dados da loja se a loja for encontrada

-   **Descrição**: Verifica se o serviço retorna os detalhes corretos da loja quando a loja é encontrada.
-   **Expectativa**:
    -   Mockar o método `findById` do `LojaRepository` para retornar um objeto de loja mockado.
    -   Chamar o método `findById` do `FindByIdService` com um ID de loja válido (`'123'`).
    -   Verificar se o resultado do serviço retorna:
        ```json
        {
            "lojas": [
                {
                    "nome": "Loja 1",
                    "endereco": "Endereco 1",
                    "telefone": "Telefone 1"
                }
            ],
            "limite": 1,
            "offset": 0,
            "total": 1
        }
        ```
    -   Verificar que o logger registra a mensagem de sucesso.
