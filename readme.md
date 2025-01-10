# **Meowble**

## **Descrição do Projeto**

Meowble-1 é uma aplicação desenvolvida utilizando o framework **NestJS**. O projeto tem como objetivo principal fornecer uma solução que localiza informações geográficas e endereços baseados em CEPs (Códigos de Endereçamento Postal). A funcionalidade `findByCEP` utiliza APIs externas para consultar dados de localização, além de realizar cálculos de distância e apresentar informações úteis ao usuário.

---

## **Principais Dependências**

A seguir estão listadas as principais dependências utilizadas no projeto, com suas respectivas funções:

### **DevDependencies**

- **@nestjs/platform-express**: Integração do NestJS com o framework Express.
- **@nestjs/testing**: Ferramentas para criação de testes automatizados no NestJS.
- **jest** e **@types/jest**: Framework de testes automatizados para JavaScript e TypeScript.
- **nodemon**: Monitoramento e reinicialização automática da aplicação durante o desenvolvimento.
- **typescript** e **ts-node**: Ferramentas para transpilação e execução de arquivos TypeScript.
- **ts-jest**: Integração do Jest com TypeScript.

### **Dependencies**

- **@nestjs/mongoose**: Integração do NestJS com o banco de dados MongoDB usando Mongoose.
- **@nestjs/axios**: Ferramentas para requisições HTTP usando o Axios dentro do NestJS.
- **@nestjs/config**: Gerenciamento de variáveis de ambiente.
- **dotenv**: Carregamento de variáveis de ambiente a partir de arquivos `.env`.
- **class-validator** e **class-transformer**: Validação e transformação de dados de entrada.
- **geolib**: Biblioteca para cálculos geográficos, como distâncias entre coordenadas.
- **hbs**: Motor de templates Handlebars para geração de visualizações.
- **mongoose**: ODM para modelagem de dados em MongoDB.
- **swagger-ui-express** e **@nestjs/swagger**: Geração e apresentação de documentação interativa para APIs.
- **winston**: Biblioteca de logging avançado para Node.js.

---

## **APIs Utilizadas**

O projeto integra as seguintes APIs externas para fornecer dados geográficos e de endereços:

### **1. Here Maps API**

- **Descrição**: Plataforma que oferece serviços de localização, mapas e cálculos de rotas.
- **Funcionalidade no Projeto**:
  - Cálculo de distâncias entre coordenadas geográficas.
  - Obtenção de informações geográficas detalhadas, como cidades e pontos de referência.

### **2. Correios API**

- **Descrição**: calcula frete e prazo.
- **Funcionalidade no Projeto**:
  - calculo de frete, pac e sedex.
  - calculo de prazo.

---

## **Uso e Execução**

### **Pré-requisitos**

- Node.js instalado na máquina.
- Configuração das variáveis de ambiente no arquivo `.env`:
  ```env
  MONGO_URI=
  HERE_API_KEY=
  ```

### **Iniciar o Projeto**

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Iniciar o servidor:
   ```bash
   npm run start
   ```

### **Testar a Funcionalidade `findByCEP`**

1. Fazer uma requisição para o endpoint (exemplo em REST):
   ```
   GET /api/location/findByCEP/:cep
   ```
2. Substituir `:cep` pelo CEP desejado.

---
