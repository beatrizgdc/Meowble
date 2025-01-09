# Cenários de Teste do Serviço FindById

Este documento descreve os cenários de teste para o serviço `FindByIdService`.

## Visão Geral

O serviço `FindByIdService` é responsável por encontrar uma loja pelo seu ID no `LojaRepository`. Foram realizados testes para garantir sua correta funcionalidade em diferentes cenários.

## Casos de Teste

### Cenário 1: Loja Não Encontrada

**Descrição**: Verifica se o serviço retorna uma resposta apropriada quando a loja não é encontrada.

**Caso de Teste**: `deve retornar um array vazio se a loja não for encontrada`

**Passos**:

1. Configurar o método `findById` do `LojaRepository` para retornar `null`.
2. Chamar o método `findById` do `FindByIdService` com um ID de loja inválido (`'invalidId'`).
3. Verificar se o resultado é o seguinte:
    ```json
    {
        "lojas": [],
        "limite": 1,
        "offset": 0,
        "total": 0,
        "mensagem": "Loja com ID invalidId não encontrada."
    }
    ```
