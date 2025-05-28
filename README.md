# 🧠 Backend - Real-Time Chat

Este é o backend do sistema de chat em tempo real, construído com **NestJS** e **Prisma**, utilizando WebSockets para comunicação em tempo real e JWT para autenticação.

---

## 🚀 Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — Framework Node.js para aplicações escaláveis
- [Prisma ORM](https://www.prisma.io/) — ORM moderno para PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) — Banco de dados relacional
- [Socket.IO](https://socket.io/) — Comunicação em tempo real
- [JWT](https://jwt.io/) — Autenticação baseada em token
- [Swagger](https://swagger.io/) — Documentação automática da API
- [Docker Compose](https://docs.docker.com/compose/) — Ambientes consistentes para dev

---

## ⚙️ Variáveis de Ambiente `.env`

```env
DATABASE_URL="postgresql://postgres:realTimeChatPassword@localhost:5433/realTimeChat?schema=public"
BCRYPT_SALT_ROUNDS=10
JWT_SECRET="secret_token"
```

---

## 🥪 Execução Local

1. Instale as dependências:

```bash
npm install
```

2. Gere o cliente Prisma:

```bash
npx prisma generate
```

3. Execute as migrações:

```bash
npx prisma migrate dev
```

4. Inicie o projeto:

```bash
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

Documentação Swagger: `http://localhost:3000/api`

---

## 🐳 Execução com Docker Compose

### Requisitos

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Comando

```bash
docker compose -f docker-compose.dev.yml up --build
```

A aplicação estará disponível em:

- **API**: `http://localhost:3000`
- **PostgreSQL**: `localhost:5433`
- **Swagger**: `http://localhost:3000/api`

---

## 📃 Arquitetura do Banco de Dados

> ![image](https://github.com/user-attachments/assets/bbcf79fb-8615-4d4b-a324-fae56632e974)


---

## 📄 Swagger - Documentação da API

> 🖼️ *Interface Swagger acessível em **`/api`**.*
![image](https://github.com/user-attachments/assets/2f7275ee-26bb-437c-b1c6-318bf3a95107)


---

## 📡 WebSocket (Socket.IO)

Namespace usado: `/messages`

### Eventos Recebidos do Cliente

| Evento        | Payload                        | Ação                                              |
| ------------- | ------------------------------ | ------------------------------------------------- |
| `sendMessage` | `{ roomId, content, userId }`  | Cria mensagem, persiste e emite `messageReceived` |
| `joinRoom`    | `{ roomId }`                   | Cliente entra em uma sala                         |
| `leaveRoom`   | `{ roomId }`                   | Cliente sai de uma sala                           |
| `*`           | `qualquer evento desconhecido` | Loga todos os eventos recebidos (debug)           |

### Eventos Emitidos para o Cliente

| Evento            | Emitido Quando                      | Payload                       |
| ----------------- | ----------------------------------- | ----------------------------- |
| `messageReceived` | Após o recebimento de `sendMessage` | Objeto da mensagem persistida |

### Exemplo de fluxo básico

```text
1. Cliente envia `joinRoom` com ID da sala
2. Cliente envia `sendMessage`
3. Backend grava a mensagem e emite `messageReceived` para todos os membros da sala
4. Cliente envia `leaveRoom` para sair
```

---

## ✅ Scripts úteis

| Comando              | Descrição                        |
| -------------------- | -------------------------------- |
| `npm run start:dev`  | Inicia o servidor em modo dev    |
| `npm run build`      | Compila a aplicação              |
| `npm run start:prod` | Executa em modo produção         |
| `npx prisma studio`  | Abre visualizador do banco local |
| `npm run test`       | Executa os testes unitários      |
| `npm run test:e2e`   | Executa os testes e2e            |
| `npm run lint`       | Ajusta formatação e lint         |

---
