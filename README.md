<h1 align="center">Desafio Crawler</h1>

## Pré-requisitos

- Node.js (Version: >= 20.x)
- PostgreSQL
- npm
- [cheerio](https://cheerio.js.org/) ==> "The fast, flexible & elegant library for parsing and manipulating HTML and XML."
- [prisma](https://www.prisma.io/) (ORM para interagir com o banco de dados PostgreSQL)
- cron (para que a aplicação posso ficar executando o crawler de tempos em tempos)
- [fastify](https://fastify.dev/) (Framework web rápido e de baixo custo, para Node.js)

# Deploy em Ambiente Linux

## 1. Preparação do Ambiente

- Instale as dependências iniciais

```bash
sudo apt-get install \
apt-transport-https \
ca-certificates \
curl \
gnupg \
lsb-release
```

### 1.1 Instalar o Node.js

```bash
sudo apt update
```

- Instalar o node via `nvm` (Node Version Manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

- Resolução de Problemas

  Após rodar o script se o comando `nvm: command not found` ou `nvm -v` não executar corretamente, feche o terminal e abra novamente, caso o erro persista execute o seguinte comando `source ~/.bashrc`

- Fechar o terminal e abra novamente

- instalar o npm global no sistema operacional

```bash
sudo apt install npm
```

- Listar as versões do Node Remoto

```bash
nvm ls-remote
```

- Escolha uma versão para instalar

```bash
nvm install v20.11.0
```

- Verifique a versão do Node que foi instalada com o comando

```bash
node -v
```

### 1.2 Instalar Docker e Docker Compose (Ubuntu LTS)

- Adicione a chave pública do repositório Docker em sua máquina

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

- Adicione o repositório remoto na lista do apt

```bash
echo \
"deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### Instale o Docker no Linux

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io
```

- Adicione seu usuário ao grupo de usuários Docker

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
newgrp docker
```

- Inicie o Daemon do Docker

```bash
sudo systemctl status docker
```

- caso o comando acima retorno o status `inactive` ou `stop/waiting` rode o comando start

```bash
sudo systemctl start docker
```

- Agora, vamos habilitar o daemon do Docker para iniciar durante o boot:

```bash
sudo systemctl enable docker
```

### Instale o Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

- Permissão de execução

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

- Verifique a instalação

```bash
docker-compose --version
# Docker Compose version v2.24.0
```

## 2. Processo de Deploy

## Clonando o projeto

1. Clone o projeto do [Git hub](https://github.com/cleveira/desafio-crawler-typescript)

```sh
git clone https://github.com/cleveira/desafio-crawler-typescript.git
```

2. Instale as dependencias do projeto

```sh
cd desafio-crawler-typescript
npm install
```

3. Inicie o banco de dados PostgreSQL através do conteiner docker

```sh
docker compose up -d
```

4. Configure o arquivo `.env` com as variaveis de ambiente

- copie o arquivo `.env.example` para `.env`

```sh
# Porta para iniciar a API
PORT=

# Endereço do banco de dados
DATABASE_URL=

# Cron job será executado a cada 1 hora
CRON_JOB_CRAWLER="* * 1 * * *"
```

5. Rodar os comandos para criar o banco de dados e as migrations

```sh
npx prisma generate
npx prisma migrate deploy
```

6. Rodar a aplicação

```sh
npm run start
```

7. para fazer uma chamada para api, pode utilizar o browser ou quaquer outra ferramenta de sua escolha, como: `Insomnia, Postman, curl`

```sh
localhost:3333/crawlers
```

8. O aplicativo conta com um CronJob que pode ser configurado para de tempos em tempos

```sh
arquivo .env

# Cron job será executado a cada 1 hora
CRON_JOB_CRAWLER="* * 1 * * *"
```

## 3. Manutenção e Monitoramento

- Para monitoramento da aplicação podemos utilizar varias estratégias

  > healtcheck

  > pm2

  > New Relic

  > Prometheus

  > DataDog

## 4. Automatização e Melhores Prática

- Para o banco de dados já utilizo um conteiner docker
- Pode sem implementado tbm para a aplicação, alem disso podemos adicionar uma camada com nginx para proxy reverso e balanceamento de carga, caso haja necessidade de alocar mais instancias da aplicação
- Hospedar a aplicação em algum cloud com AWS
- Implementação de CI/CD para tornar facil a atualização de novas funcionalidade ou correções de bugs
