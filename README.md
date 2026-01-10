# Tech Challenge – Projeto 4 (Mobile)

**Autor:** Gabriel Machado – RM362607  

---

## Visão Geral

O **Projeto 4** do Tech Challenge teve como objetivo a criação de uma **aplicação mobile** utilizando **React Native com Expo**, consumindo as APIs desenvolvidas no **Tech Challenge 2-3** (back-end em Node.js com MongoDB).

A aplicação funciona como uma plataforma de posts educacionais, com **controle de autenticação e autorização**, permitindo diferentes níveis de acesso para **professores** e **alunos**, além de telas administrativas completas para gestão de usuários e conteúdos.

O foco do projeto foi entregar uma aplicação funcional, organizada e integrada ao back-end existente, respeitando os requisitos do enunciado.

---

## 🎯 Objetivos do Projeto

- Desenvolver um **front-end mobile** em React Native
- Integrar a aplicação aos **endpoints REST** do back-end
- Implementar **autenticação com JWT**
- Garantir **controle de permissões** entre professores e alunos
- Criar telas administrativas para gerenciamento de dados
- Fornecer uma experiência clara e funcional no mobile

---

## Perfis de Usuário

### Aluno
- Realiza login com email e senha
- Pode visualizar a lista de posts
- Pode ler posts em detalhe
- Não possui permissão para criar, editar ou excluir conteúdos, porém pode ler

### Professor
- Realiza login com email e senha
- Pode visualizar e ler posts
- Pode criar, editar e excluir posts
- Possui acesso às telas administrativas
- Pode criar, editar e excluir professores e alunos
- Não pode excluir o próprio usuário logado

---

## ✅ Funcionalidades Implementadas

### Autenticação e Autorização
- Login com email e senha
- Autenticação baseada em **JWT**
- Token armazenado no app e enviado via header `Authorization`
- Rotas protegidas conforme perfil do usuário

### Posts
- Listagem de posts
- Busca por palavra-chave
- Leitura completa de post
- Criação de post (apenas professor)
- Edição de post (apenas professor)
- Exclusão de post (apenas professor)

### Professores
- Listagem paginada
- Criação de professor
- Edição de professor
- Exclusão de professor (exceto o usuário logado)

### Alunos
- Listagem paginada
- Criação de aluno
- Edição de aluno
- Exclusão de aluno

### Conta
- Exibição dos dados do usuário logado
- Logout seguro

---

## Arquitetura da Aplicação

- **React Native + Expo**
- Navegação com **React Navigation**
- Separação por camadas:
  - `api/` – comunicação com o back-end (Axios)
  - `screens/` – telas da aplicação
  - `navigation/` – stacks e tabs
  - `context/` – controle de autenticação
  - `ui/` – componentes reutilizáveis
- Comunicação com API via Axios
- Gerenciamento de estado local com hooks (`useState`, `useEffect`)

---

## Tecnologias Utilizadas

### Front-end Mobile
- React Native
- Expo
- React Navigation
- Axios
- JavaScript (ES6+)

### Infraestrutura
- MongoDB Atlas
- Render (deploy do back-end)
- GitHub

---

## Fluxo da Aplicação

1. Usuário acessa a aplicação mobile
2. Tela inicial de login é exibida
3. Usuário realiza login como professor ou aluno
4. Token JWT é armazenado e utilizado nas requisições
5. A navegação é liberada conforme o perfil:
   - Aluno: leitura de posts
   - Professor: administração completa
6. Usuário pode acessar a tela de conta e realizar logout

---

## Setup do Projeto

### Pré-requisitos
- Node.js
- Expo CLI
- Back-end do Tech Challenge 2-3 em funcionamento

### Instalação
```bash
npm install