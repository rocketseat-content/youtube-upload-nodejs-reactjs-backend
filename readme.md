[![rocket.jpg](https://i.postimg.cc/SRHcRS29/rocket.jpg)](https://postimg.cc/5QqXkMm9)

<h2 style="text-align: center;">Upload file Mutter + s3</h2>

### Tutorial BLOG Rocketseat:

> Link para o post no blog da Rocketseat -> [Upload de imagens no S3 da AWS com Node.js](https://blog.rocketseat.com.br/upload-de-imagens-no-s3-da-aws-com-node-js/ "Rocket")

### Descrição:

Vamos implementar uma API em Node.js que irá fazer upload de imagens em uma pasta temporária no servidor local e também no serviço S3 (Simple Storage Service) da AWS (Amazon Web Services). Iremos utilizar o MongoDB para armazenar os Posts que contém informações referente a imagem que será salva. Vamos disponibilizar as rotas para que o front end consuma a API.

S3 da AWS é um serviço altamente escalável e barato, que nos motiva utiliza-lo para arquivos estáticos. Custa menos dinheiro colocar arquivos no S3 do que no servidor em uma pasta temporária que consome o disco — Heroku, Digital Ocean, Umbler, entre outros.

Todavia, para um app de teste, claro que compensa manter nesses serviços.

Hoje já vamos aprender como usar S3, pode ser necessário para apps profissionais.

### Usando

- Comando para Clonar o repositorio

`$ git clone https://github.com/rocketseat-content/youtube-upload-nodejs-reactjs-backend.git `

- Entre dentro da pastar clonada

`$ cd youtube-upload-nodejs-reactjs-backend`

- Rode o comando yarn, caso não tenha o yarn instalado [clique aqui e instale seguindo essa dica!](https://www.youtube.com/watch?v=JvsGQnGE-xg "Clique aqui e instale seguindo essa dica !")

`$ yarn`

- Configure seu **mongoose**, adicione seu **.env**, **depois** rode esse comando.

`$ node src/index.js`

- Sevidor vai iniciar com a seguinte mensagem, **Obs** a porta e o ip e configurado pelo seu **.env**:

`Servidor rodando com o IP: XXX.XXX.XXX PORT: XXXX`

## Exemplos de .env

    # Se hospedar sua aplicação em algum lugar, seu ip deverar ser 0.0.0.0
    #Define o IP:
    APP_IP=127.0.0.1
    #Defina a PORTA:
    APP_PORT=3000

    # s3: para produção
    # local: em desenvolvimento
    STORAGE_TYPE=

    # Pegue esses dados no site S3 AWS
    # Defina seu bucket name
    BUCKET_NAME=
    # Defina seu bucket Access Key ID
    AWS_ACCESS_KEY_ID=
    # Defina sua Secret Acess Key
    AWS_SECRET_ACCESS_KEY=
    # Defina sua Região
    AWS_DEFAULT_REGION=

    # Pode ser da sua máquina local ou Mongo Atlas
    MONGO_URL=

# 1 Error:

**Se caso ao usar o serviço s3 e lhe imprima o seguinte error:**

> **Status do error: 500, (Internal server error)**

**Descrição:**

> Algo parecido com -> **[this.client.send() is not a function]**

**Possivel solução:**

**Verifique as versões das dependencias necessarias no arquivo package.json**

    "dependencies": {
    "aws-sdk": "^2.390.0",
    "multer": "^1.4.1",
    "multer-s3": "^2.9.0"
    }

Caso alguma dependencia esteja com versões diferente das citadas acima, mesmo em versões mais atualizadas,
edite seu arquivo **package.json** e troque as vesões das dependencias, **Deleta a pasta node_modules ** então rode o comando:

> `$ yarn`

**Possível causa:**

> Algumas versões mais recentes dessas dependencias, estão causando esse bug.

# 2 Error:

**Caso ao startar o sevidor, seja imprimido no terminal as seguintes mensagens:**

    (node:19040) Warning: Accessing non-existent property 'count' of module exports inside circular dependency
    (Use `node --trace-warnings ...` to show where the warning was created)
    (node:19040) Warning: Accessing non-existent property 'findOne' of module exports inside circular dependency
    (node:19040) Warning: Accessing non-existent property 'remove' of module exports inside circular dependency
    (node:19040) Warning: Accessing non-existent property 'updateOne' of module exports inside circular dependency

**Remova o mongoose**

`$ yarn remove mongoose`

**Depois re-instale**

`$ yarn add mongoose`

**Possível causa:**

> Versão da dependencia mongoose e antiga!
