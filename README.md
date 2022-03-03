# Store Manager

## Contexto

Store Manager é uma REST API de um sistema de gerenciamento de vendas, onde é possível criar, visualizar, deletar e atualizar produtos e vendas. Feito em TDD usando a arquitetura MSC.

## Tecnologias Usadas

Back-End:

> NodeJS, Express, Joi

Banco de dados:

> MySQL

Testes:

> Mocha, Chai, Sinon

## Variáveis de ambiente

- MYSQL_HOST=\<nome do host mysql\>
- MYSQL_USER=\<nome do usuário mysql\>
- MYSQL_PASSWORD=\<senha do mysql\>
- PORT=\<porta onde roda a aplicação>

## Executando a Aplicação

1. Crie o schema do arquivo `StoreManager.sql`

2. Instale as dependências

   ```bash
   npm install
   ```

3. Inicie o servidor http

   ```bash
   npm start
   ```

## Executando os testes

1. Instale as dependências

   ```bash
   npm install
   ```

2. Rode o comando de cobertura dos testes

   ```bash
   npm run test:mocha
   ```

3. \*Para testar um arquivo específico use a variável de ambiente NAME

   ```bash
   NAME=validateProduct npm run test:mocha
   ```

## Endpoints

### Produtos

- GET /products

  > Retorna todos os produtos do banco de dados

- GET /products/{id}

  > Retorna um produto com o id especificado

- POST /products

  > Cadastra um novo produto

  Exemplo de body:

  ```json
  {
    "name": "melancia",
    "quantity": 2002
  }
  ```

- PUT /products/{id}

  > Atualiza um produto com o id especificado

  Exemplo de body:

  ```json
  {
    "name": "melancia",
    "quantity": 20
  }
  ```

- DELETE /products/{id}

  > Deleta um produto com o id especificado

### Vendas

- GET /sales

  > Retorna todos as vendas do banco de dados

- GET /sales/{saleId}

  > Retorna as vendas com o saleId especificado

- POST /sales

  > Cadastra uma nova venda

  Exemplo de body:

  ```json
  [
    {
      "productId": 1,
      "quantity": 8
    },
    {
      "productId": 2,
      "quantity": 12
    }
  ]
  ```

- PUT /sales/{saleId}

  > Atualiza uma venda com o saleId especificado

  Exemplo de body:

  ```json
  [
    {
      "productId": 1
      "quantity": 2,
    }
  ]
  ```

- DELETE /sales/{saleId}

  > Deleta uma(s) venda(s) com o saleId especificado
