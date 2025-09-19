Readme Struct

Intro

 -App

 -How to Use it: req, installations

Stack used

 -choices (tech)

 -design

Improvments:

-SSR/SSG/CSR

- Basics: radix, rquery, i18n
- data: indexdb
- ui: labels, aria
- ux: click on label, skeleton


<h1 align="center" style="font-weight: Bold">:desktop_computer: Projeto Track App </h1>

Este Projeto é um aplicativo web para vizualição de dados 📈, neste caso estamos utilizando os dados em [Anexo](/src/assets)

* [Projeto](#projeto)
* [Instalação](#instalando-o-aplicativo)
* [Escolhas Tecnicas]
* [Teste & Uso]
* [Como configurar](#configurando-o-environment)
* [Como executar](#executando-o-aplicativo)
* [Testando](#testando-o-aplicativo)
* [Melhorias](#melhorias-futuras)

Além disso, o projeto esta *live* e está disponível [aqui](https://track-app-gamma.vercel.app/).

### Pré-Requisitos:

Para utilizar esta aplicação é nescessario ter instalado:

1. NodeJS e NPM (Testado nas Versões 22.12.0, 10.5.0 respectivamente) [vendor](https://nodejs.org/en/download).
2. Acesso a um banco de dados PostgreSQL:
   * Localmente: [vendor](https://www.postgresql.org/download).
   * ou uma solução online como [neon](https://neon.com/).

### Instalando & Rodando o aplicativo.

Uma vez que os pre-requistos estejam instalados, para instalar esta aplicação:

1. Clone este repositorio:

```Bash
git clone https://github.com/vtmattedi/TrackApp
```

2. Abra a pasta

```Bash
    cd <folder>
```

>[!WARNING] Npm recentemente teve o chain-supply infectado, recomenda-se testar em ambiente controlado.

3. Instale as dependencias:

```Bash
    npm install
```

4. Rodar em ambiente de desenvolvimento
```Bash
    npm run dev
```
#### Configurando o Environment

Para a aplicação funcionar corretamente, é nescessario criar o arquivo `.env` como o arquivo [exemplo](.example.env).

Para o correto funcionamento é nescessario que os seguintes dados estejam presentes:

* `JWT_SECRET`: String utilizar para gerar os tokens de acesso.
* `JWT_REFRESH_SECRET`: String utilizar para gerar os *refresh* tokens.
* `SCRYPT_SALT`: Salt para o hash das senhas (sugestão 128bits).
* `PGHOST`: Enderço do PostgreSQL (padrão pós instalção numa maquina local: `::1`).
* `PGDATABASE`: Nome do banco de dados (padrão pós instalção numa maquina local: `postgres`).
* `PGUSER`: Usuário do banco de dados (padrão pós instalção numa maquina local:  `postgres`).
* `PGPASSWORD`: Usuário do banco de dados (deve ter sido solicitado ao final da instalação).
* `PGPORT`: A porta do banco de dados (padrão PostgreSQL: 5432)
* `PGSSL`: `true` ou `false` determina se a conexão deve ser feita usando https.
* `JWT_ACCESS_TOKEN_EXPIRES`: Tempo para que o token de acesso seja válidos. Deve ser no formato 'num''unit' então algo como '72h' ou '15m'. (Sugestão: 15m).
* `JWT_REFRESH_TOKEN_EXPIRES`: Tempo para que o *refresh* token seja válido. Deve ser no formato 'num''unit' então algo como '72h' ou '15m'.(Sugestão: 72h).
* `NODE_ENV`: `production` ou `development`. Em *development* alguma informações extra são expostas tais como motivo da falha do login.
* `DONT_RECOVER_FROM_ERROR`: `false` ou `true`. Se for `true` erros *inesperados* encontrados durante a responsta não são tratados (são jogados novamente). Caso contrario, é jogado um erro http com codigo 500, capturado pelo NestJS.
* `LOG_ROUTING_ERRORS` = `true` ou `false`. Imprime os erros capturados durante o roteamento.
`
Para gerar um Salt ou JWT secret pode ser utilizado:

```Bash
node -p "require('crypto').randomBytes(128).toString('base64')"
```

```Bash
node -p "require('crypto').randomBytes(64).toString('base64')"
```

Se utilizar o neon, este dados podem ser obtidos seguindo os seguintes passos:

1. navegue até sua *dashboard*.
2. clique no banco de dados desejado.
3. selecione *overview* no painel de navegação à esquerda.
4. clique em *Connect* e escolha *Parameters only*

### Executando o aplicativo

Após a instalação e a correta configuração do `.env` voce pode rodar o aplicativo:

```Bash
    npm run start
```

ou com o watcher:

```Bash
    npm run start:dev
```

### Testando o Aplicativo

Uma vez que o aplicativo esteja executando, a documentação da API está disponivél em:

* `http://localhost:3000` ou `http://localhost:3000/api` (Swagger)

Para testar o aplicativo é nescessario algum aplicativo que posso enviar *Requests* com *body* e modificar os headers. Em geral o [insomnia](https://insomnia.rest/) ou [postman](https://www.postman.com/) são utiilizados mas tambem pode ser tulizado ferramentas como o curl.

Além disso o [aquivo](/Insomnia/Insomnia_2025-05-04) do insomnia pode ser importado no insomnia, nele o usuário pode testar todos os *endpoints*.
Este aquivo contém 1 documento no qual contém:

* A spec da api (importada do Swagger)
* 3 collections:
  * Basic: todas as rotas individualmente.
  * Misc: Rotas miscelâneas de uitlidade.
  * Flow: Conjunto de *requests* com flows para testar utilização da aplicação.

Para testar utilizando o insomnia:

* Caso não esteja rodando no `localhost:3000`:
  * Configure as variaveis de ambiente, a `base_url` deve conter a url da apricação rodado e a variavel `protocol` deve conter http ou https. Isso está pré configurado para localhost:3000
  * Para a aplicação live, disponivel em: https://todoproject-6an2.onrender.com/:
  * `base_url`: todoproject-6an2.onrender.com
  * `porotcol`: https
* Testar Request individuais na pasta *Basic* ou clicar com o botão direito em uma das pastas *Flow* e clicar em executar coleção.

As requisições foram feitas de tal forma que usam das variavéis de ambiente para automaticamente configurar o `accessToken` e o `refreshToken` ao fazer um `login` ou `register`. Além disso ao criar uma tarefa, o ID dela também é configurado para as requisições de `edit` e `delete`.

As requisições também tem testes do codigo de resultado e, em algum casos, dos dados recebidos.

Sem o insomnia ou postman: uma vez que o aplicativo esteja executando, para testar precisamos primeiramente registrar ou fazer o login com um usuário.

<details>
<summary>Show</summary>

* Criar conta:

```Bash
curl -X 'POST' \
  'http://localhost:3000/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "john_doe",
  "email": "name@provider.com",
  "password": "password123"
}'
```

ou

* Login:

```Bash
curl -X 'POST' \
  'http://localhost:3000/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "name@provider.com",
  "password": "password123"
}'
```

</details>

Disto receberemos dois tokens um `accessToken`e um `refreshToken` e precisamos utilizarlos para acessar o resto da aplicação.

Para ver, editar, criar e deletar as tarefas, precisamos enviar na requisição, um *header* `authorization` com valor: `Bearer <acessToken>`.

Caso a resposta tenha status 401 podemos enviar uma requisição contendo um *header* `authorization` com valor: `Bearer <refreshToken>`
para `/auth/token` e receberemos um novo `accessToken`caso nosso `refreshToken` seja válidos, e podemos continuar manipulando as tarefas deste usuário.

Após isso é possivel deslogar, ou apagar a conta criada, novamente enviando um header com seu `refreshToken`

<details>
<summary>Show</summary>

* Criar conta:

```Bash
curl -X 'POST' \
  'http://localhost:3000/auth/logout' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d ''
```

ou

* Apagar conta:

```Bash
curl -X 'DELETE' \
  'http://localhost:3000/auth/closeaccount' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer <token>'\
  -d '{
  "email": "name@provider.com",
  "password": "password123"
}'
```

</details>

### Projeto

O projeto foi desenvolvido utilizando o framework NestJS e foi escolhido trabalhar com o PostgreSQL pois existe uma ferramenta que permite pequenos bancos de dados gratuitos perfeitos para este tipo de testes, o [neon](https://neon.com). Durante o desenvolvimento foi testado tanto no banco de dados local quanto usando o neon.

Como estamos no NestJS e para manter uma boa escalabilidade, foi decido por utilizar o [TypeORM](https://docs.nestjs.com/recipes/sql-typeorm).

Aplicação foi desenvolvida em 4 módulos:

* Auth: responsável pelas rotas e logica de controle de acesso, incluindo controle de tokens.
* Users: contém o serviço para a manipulação de usuários no banco de dados.
* Tasks: responsável pelas rotas de manipulação de tarefas e a manipulação das mesmas no banco de dados.
* Misc: apenas um *controller* utilizado para uma rota de vida e um redirecionamento da página incial para a documentação da api do Swagger.

Para a documentação da api foi utilizado o o modulo do Swagger do NestJS.

Na parte de [autenticação](#autenticação) foi utilizada uma estrategia de tokens de acceso e de sessão como pode ser visto mais abaixo. Para proteger as rotas devidamente foi feito dois *middlewares* um que permite apenas `accessToken` válidos acesso as rotas do manipulação de tarefas. Ele checa o token e caso seja válido insere o ID do usuário no corpo da requisição. O outro *middleware* protege as rotas de autenticação, exeto pela rota de login e cadastro. Ele faz a mesma coisa e além de inserir o id do usuário, ele insere também o token em sí no corpo.

Para a validação dos dados recebidos pela aplicação, onde foi possivél, é utilizado o pacote `class-validator`, porém onde era nescessario algo mais especifico ou uma transformação dos dados, foi implementados *class trasforms* própios, dessa forma todos os dados chegam já tratados nos *controllers*.

Como é utilizado o `class-validator` e seus pipes foi feito a escolha de responder em padronizar os erros (respostas sem código 2xx) baseado na resposta dele, desta forma, toda requisição inválida tem uma resposta com o formato:

```c
{
    error: string,
    message: string[],
    statusCode: int  
}
```

Além disso, quando estamos em ambiente de desenvolvimento (`NODE_ENV: 'development'`) temos mensagens especificas dos erros de login ou dos erros de autenticação, porém em produção apenas uma mensagem de erro generica é enviada ao usuário para evitar vazar informações que possam ajudar agentes mal intencionados.

Durante a manipulação de tarefas, a requisção passa pelo *middleware* ou seja ele contém um `accessToken` válido, entretanto, o *controller* ainda é responsavél por checar se aquele usuário pode manipular aquela tarefa.

Como estamos utilizando o TypeORM, desde que não haja tabelas com os nomes `refreshtokens`, `users` e `tasks` no *database* utilizado o própio TypeORM as cria porém caso elas existam isso causará um erro que deve ser manualmente resolvido, pois não faz sentido fazer uma *migration* que drop tabelas que não sabemos o conteúdo. Além disso o *schema* das tabelas esta disponível [aqui](/src/model/schema.sql).

Nesta aplicação as tarefas podem ser apagadas e restauradas, para isso foi criado um campo `deleteAt` que marca quando elas foram deletadas e caso seja `null` significa que elas não foram deletadas (ou foram restauradas) permitindo um *soft delete* nas tarefas e *restore*. Isso foi implementado manualmente e não utilizando o `softDelete` do própio typeORM.

Além disso o campo `dueDate`, que determina a data limite de cada tarefa, porém ela pode ser `null` significando uma tarefa sem limite temporal que pode ser útil para o usuário.

##### Autenticação

Para autenticação foi utilizada uma estrategia de `accessToken` e `refreshToken` onde o usuário recebe ao fazer login um token de cada. O `accessToken` é um JWT de curta duração que permite que o usuário acesse o banco de dados até o fim da duração delete. Enquanto isso o `refreshToken` atua quase que como um token de sessão, ele tem duração bem mais alta e permite que o usuário gere novos `accessToken` e que faça operações de logout ou de fechar a conta.

Apesar de ambos serem JWT's `accessToken` e `refreshToken` não são intercambiaveis e **DEVEM** ter chaves privadas distintas usar um no lugar do outro é o mesmo que usar uma string aleatória.

Toda vez que um `refreshToken` é gerado, ele é armazenado no banco de dados e toda vez que ele é utilizado em uma operação ele é, além de verificado a assinatura do JWT em sí, também é verificado se ele estar no banco de dados. permitindo que um usuário se conecte de mais de um dispositivo ao mesmo tempo.

Ao fazer um logout com `?everywhere=true` todos os `refreshToken` deste usuário são deletados, o que significa que após o `accessToken` de outras sessões expirarem (a.k.a outros `refreshToken` do mesmo usuário), eles teram que fazer o login novamente para poder continuar acessando a API.

Isto também ocorre caso o usuário decida fechar sua conta (porém as *tasks* são permanentemente deletadas no fechamento da conta automaticamente). Para fechar a conta o usuário precisa reenviar suas credenciais, diminuindo o dano que pode ser causado por um *session hijack*.

##### Lógica de Negocios

Para criar uma conta, o usuário precia informar senha, email e nome e o email não pode já esta cadatrado. Após registrar com sucesso, ele será logado.

Para fazer login o usuário precisa enviar email e senha. Se ele forem credenciais válidas no sistema, o usuário recebera um  `accessToken` e `refreshToken` além de seu ID.
Ele pode com o `refreshToken` gerar novos `acessToken`.

Para manipular as tarefas, o usuário precisa de um `accessToken`, mas além disso, ele precisa que o token tenha sido emitido com o ID igual ao dono da tarefa ao qual ele esta tentando manipular caso contrario ele recebera uma resposta http *Forbbiden*.

Um usuário ver todas suas tarefas (com um filtro opcional sobre o status dela) ou todas suas tarefas deletadas.

Um usuário pode criar uma tarefa enviando o titulo e a descrição e pode ou não enviar a data de termino da tarefa no formato `string` que vai ser parseada pelo `new Date()` do js, porém caso esta esteja presente ele tem que ser uma data [válida](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date) e não pode ser no passado.

Um usuário pode editar tarefas utilizando ID da mesma e passando status, titulo, descrição ou data de termino(mesmas regras de criação se aplicam a data), nenhuma dessas opções é obrigatoria mas ao menos uma precisa estar presente

Um usuário pode deletar uma tarefa utilizando o ID da mesma. Neste caso a tarefa é marcada como deletada e não apareca em futuras buscas de tarefas do usuário (e aparecera nas buscas por tarefas deletadas).

Um usuário pode restaurar uma tarefa que foi anteriormente deleta utilizando o ID da mesma.

Um usuário pode fechar sua propia conta fornecendo seu `refreshToken` e suas novamente suas credenciais.

### Melhorias futuras:

Para este projeto temos algumas melhorias que podem ser feitas:
* Adicionar válidação de email para cadastro de usuários.
* Adicionar mais filtros possiveis para buscar tarefas (e as deletadas), especialmente para que retorne um numero especifico de tarefas começando de um offset.
* Criar CronJob para retirar refreshTokens invalidos do banco de dados.
* Criar CronJob para deletar permanentemente tarefas marcadas como deletadas no banco de dados e alterar o status para `late` de tarefas atrasadas.
* Implementar um usúario admin que tenha acesso a outros usuários e tarefas.
* ~~Fora do escopo de backend mas implementar um front, mesmo que, simples para que possa ser testado o aplicativo diretamete.~~
* Escrever os testes unitarios pra as unidades mais importantes.
* Transformar os refreshTokens em cookies ~~este era o projeto inicial mas não esteva funcionando com o insomnia apesar de funcionar no postman~~.
