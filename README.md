# QuizLab IF - Frontend

Este é o repositório do frontend do **QuizLab IF**, uma plataforma de quizzes gamificados em tempo real desenvolvida para o Instituto Federal de Sergipe (IFS).

## 🚀 Sobre o Projeto

O **QuizLab IF** tem como objetivo proporcionar uma experiência interativa e gamificada para professores e alunos da Rede Federal. O projeto foca em:

- **Tempo Real:** Interatividade instantânea durante os quizzes.
- **Gamificação:** Estilo "Kahoot" para engajamento dos alunos.
- **Escalabilidade:** Funciona perfeitamente em dispositivos móveis e desktops.
- **Open-Source:** Código aberto para colaboração.

Este repositório contém a aplicação web desenvolvida com **Next.js**. O backend (API) é desenvolvido separadamente em AdonisJS.

## 🛠️ Stack Tecnológica

- **Framework:** Next.js (App Router)
- **Estilização:** Tailwind CSS + shadcn/ui
- **Linguagem:** TypeScript
- **Comunicação:** WebSockets (Socket.io) e REST JSON

## 🎨 Identidade Visual (Padrão IFS)

O projeto segue as cores oficiais do IFS:
- **Verde Principal:** `#32A041`
- **Vermelho Destaque:** `#C8191E`

---

## 🚦 Iniciando o Desenvolvimento

Primeiro, instale as dependências:

```bash
npm install
```

Em seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando o arquivo `app/page.tsx`. A página será atualizada automaticamente conforme você edita.

## 🏗️ Estrutura do Projeto

O QuizLab é dividido em dois repositórios principais:
- `/quizlab-api` -> Backend AdonisJS.
- `/quizlab-app` -> Frontend Next.js (este repositório).

---

## Saiba Mais

Para aprender mais sobre o Next.js, confira os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo.

