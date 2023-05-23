## Descrição

Esse projeto possui apenas 1 endpoint, sendo ele um `POST` na rota `image/save`

```bash
POST BODY
{
    "image": "url.jpeg",
    "compress": 0.9
}
```

No caso de sucesso, a imagem original e uma versão reduzida e comprimida é salva na pasta public. Assim, as imagens podem ser acessadas pela API pela `url` passada na resposta.

Também é adicionado o EXIF do file `jpeg` no mongoDB e retornado na resposta.

```bash
{
    "localpath": {
        "original": "/path/to/original.jpg",
        "thumb": "/path/to/thumb.jpg",
    },
    "metadata": {
        "EXIF_KEY": "EXIF__VALUE"
    }
}
```

Em caso de erro a resposta retornada tem o padrão:

```bash
{
    errors: [
        {
            "code": "YOUR_CODE",
            "message": "YOUR_MESSAGE"
        }
    ]
}
```


## Instalação

Salve o projeto no diretório local e execute a instalação de dependências

```bash
$ npm i
```

## Adicionando MongoDB

Para o funcionamento do projeto é necessário uma conexão com o mongoDB, para isso crie um arquivo `.env` na raiz do projeto e adicione a variável `MONGODB_URL` com a url de conexão para sua database:

```bash
MONGODB_URL = 'mongodb://username:password@host:port/database?options...'
```

## Execução do servidor

Para executar o servidor:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Test


```bash
# unit tests
$ npm run test
```

