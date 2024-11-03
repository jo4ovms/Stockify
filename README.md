# Stockify - Gerenciamento de Estoque para E-commerce

## Descrição do Projeto
Stockify é uma aplicação para o gerenciamento eficiente de estoque voltada para e-commerce, desenvolvida com uma API robusta em Java/Spring Boot, uma interface de usuário em React, e banco de dados PostgreSQL local.

## Índice
- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Repositório](#estrutura-do-repositório)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Contribuição](#contribuição)

## Visão Geral
Este projeto visa facilitar o controle de estoque para e-commerce, permitindo o registro, atualização e exclusão de itens, com interface amigável e operação fluida. Está estruturado em um backend (API) e frontend que se comunicam através de contêineres Docker.

## Tecnologias
- **Backend:** Java com Spring Boot
- **Frontend:** React, Material UI, Framer Motion
- **Banco de Dados:** PostgreSQL local
- **Contêineres:** Docker, Docker Compose

## Estrutura do Repositório
- `API/`: Contém o código da API em Java (Spring Boot).
- `FRONT/`: Contém o código do front-end em React.

## Instalação

### Pré-requisitos
- [Java 17](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Passo a Passo
1. **Clone o repositório:**
```bash
git clone https://github.com/jo4ovms/Stockify.git
```
2. **Entre na pasta raiz do repositório:**
```
cd Stockify
```
3. **Inicie o projeto com Docker Compose:**
```
docker-compose up --build
```
4. **Acesse a aplicação:**
- Backend (API): http://localhost:8081
- Frontend: http://localhost:4173

## Como usar:
1. Crie uma conta.
2. Registro de Fornecedores, Produtos e Estoques: Acesse a página de Fornecedores para começar a gerenciar e criar produtos.

### Contribuição
1. Faça um fork do repositório.
2. Crie uma branch para sua feature (git checkout -b feature/MinhaFeature).
3. Envie um Pull Request após realizar os testes e revisões.
