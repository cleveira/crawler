<h1 align="center">Desafio Crawler</h1>

## Pré-requisitos

-- Node.js (Version: >= 20.x)
-- PostgreSQL
-- npm

## Clonando o projeto

1. Clone o projeto [Git hub](https://github.com/cleveira/desafio-crawler-typescript)
   `git clone https://github.com/cleveira/desafio-crawler-typescript.git`
2. Acessar o diretorio onde o projeto foi criado (desafio-crawler-typescript)
   `cd desafio-crawler-typescript`
3. Instale as dependencias do projeto
   `npm install`
4. Inicie o conteiner docker para subir o banco de dados PostgreSQL e Redis
   `docker compose up -d`
5. Rodar os comandos para criar o banco de dados e as migrations
   `npx prisma migrate dev`
   `npx prisma deploy`
6.
