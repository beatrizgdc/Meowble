# Testes do Serviço `CreateLojaService`

## Índice

1. [Introdução](#introdução)
2. [Configuração do Teste](#configuração-do-teste)
3. [Cenários de Teste](#cenários-de-teste)
    - [Cenário 1: Criar uma loja com sucesso](#cenário-1-criar-uma-loja-com-sucesso)
    - [Cenário 2: Lançar um erro se a criação falhar](#cenário-2-lançar-um-erro-se-a-criação-falhar)
4. [Conclusão](#conclusão)

## Introdução

Este documento descreve os testes unitários para o serviço `CreateLojaService` utilizando o framework Jest. O objetivo é garantir que o serviço crie uma nova loja corretamente e trate adequadamente os casos em que a criação falha.

## Configuração do Teste

-   **Serviço**: `CreateLojaService`
-   **Dependências Mockadas**:
    -   `LojaRepository`: Mock para o repositório de lojas.
    -   `ServicoDeLogger`: Mock para o serviço de logger.

## Cenários de Teste

### Cenário 1: Criar uma loja com sucesso

-   **Descrição**: Verifica se o serviço cria uma nova loja com sucesso e retorna os dados corretamente.
-   **Expectativa**: O serviço deve retornar os dados da loja criada e logar mensagens de sucesso.

### Cenário 2: Lançar um erro se a criação falhar

-   **Descrição**: Verifica se o serviço lança um erro adequado quando a criação de uma nova loja falha.
-   **Expectativa**: O serviço deve lançar um erro e logar mensagens de erro apropriadas.
