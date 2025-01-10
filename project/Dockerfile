# Etapa 1: Usar uma imagem base do Node.js para build
FROM node:18-alpine AS builder

# Definir diretório de trabalho no contêiner
WORKDIR /project

# Copiar arquivos de configuração e dependências
COPY package*.json ./
COPY .env ./

# Copiar o arquivo tsconfig.json também
COPY tsconfig.json ./

# Instalar todas as dependências, incluindo de desenvolvimento
RUN npm install

# Copiar as views para o contêiner
COPY ./src/public/views /app/src/public/views

# Copiar o restante do código da aplicação
COPY . . 

# Compilar o projeto TypeScript para JavaScript
RUN npm run build

# Etapa 2: Criar a imagem final para produção
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /project

# Copiar apenas as dependências de produção
COPY package*.json ./
RUN npm ci --production

# Instalar o NestJS CLI globalmente (apenas para o ambiente de produção)
RUN npm install -g @nestjs/cli

# Copiar o build compilado do estágio anterior
COPY --from=builder /project/dist ./dist
COPY .env ./
# Copiar o tsconfig.json para a imagem final também
COPY tsconfig.json ./

# Expor a porta usada pelo NestJS
EXPOSE 3000

# Comando para iniciar o servidor (usando a instalação local do NestJS)
CMD ["npm", "run", "start"]
