# tarefa-react-filminhos
> Projeto em React desenvolvido para a tarefa de fixação da linguagem, aplicando os conceitos aprendidos sobre componentização, rotas, consumo de API e autenticação, na construção de uma aplicação de avaliação de filmes inspirada no Letterboxd.

[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## Sobre o projeto

Este projeto é uma aplicação web (Film{IN}hos) que consome uma API externa de filmes, permitindo cadastro e login, pesquisa com filtros, favoritar e marcar filmes como assistidos, e criar, editar e excluir reviews com avaliação por estrelas.

---

## Estrutura

```
projeto/
├── public/                    # Arquivos estáticos (favicon)
├── src/
│   ├── assets/                # Logo e ícones de redes sociais
│   ├── components/            # Componentes reutilizáveis (Header, Footer, modais, cards, etc)
│   ├── contexts/              # Contexto de autenticação
│   ├── pages/
│   │   ├── Home/              # Carrossel de destaques, categorias e reviews
│   │   ├── Login/             # Autenticação
│   │   ├── Cadastro/          # Criação de conta
│   │   ├── Filme/             # Página individual do filme
│   │   ├── Pesquisa/          # Busca com filtros de gênero
│   │   ├── Favoritos/         # Filmes favoritados (paginado)
│   │   ├── Assistidos/        # Filmes assistidos (paginado)
│   │   ├── MinhasReviews/     # Reviews do usuário (editar/excluir)
│   │   ├── Perfil/            # Perfil público de outro usuário
│   │   └── MovieListPage/     # Base compartilhada por Favoritos e Assistidos
│   ├── services/              # Configuração do axios (api.ts)
│   ├── types/                 # Tipos TypeScript compartilhados da API
│   ├── App.tsx                # Definição das rotas
│   └── main.tsx               # Ponto de entrada
├── index.html
├── package.json               # Dependências do projeto
├── package-lock.json          # Versões travadas das dependências
├── tsconfig.json              # Configuração do compilador TypeScript
└── vite.config.ts             # Configuração do Vite
```

---

## Conteúdo

| Página | Funcionalidade |
|---|---|
| `Home` | Carrossel de destaques, carrosséis por categoria e lista de reviews aleatórias |
| `Login` / `Cadastro` | Autenticação de usuário via API |
| `Filme` | Banner, sinopse, favoritar, marcar como assistido e avaliar (modal com estrelas) |
| `Pesquisa` | Busca por texto em tempo real e filtros de gênero combináveis |
| `Favoritos` / `Assistidos` | Listagem paginada com busca por nome e remoção |
| `MinhasReviews` | Edição e exclusão de reviews com confirmação |
| `Perfil` | Visualização pública de favoritos, assistidos e reviews de qualquer usuário |

---

## Tecnologias utilizadas

| Ferramenta | Uso |
|---|---|
| `React` | Componentização e gerenciamento de estado da interface |
| `TypeScript` | Tipagem estática do projeto e dos dados da API |
| `Vite` | Build e ambiente de desenvolvimento |
| `React Router` | Roteamento entre páginas públicas e privadas |
| `Axios` | Consumo da API REST |
| `Swiper` | Carrosséis de filmes |
| `Lucide React` | Ícones |

---

## Como executar

### 1. Instale as dependências
```bash
npm install
```

### 2. Rode o ambiente de desenvolvimento
```bash
npm run dev
```

### 3. Gere o build de produção
```bash
npm run build
```

A aplicação consome a API pública [tarefaapi.onrender.com](https://tarefaapi.onrender.com/docs). Por estar hospedada em um plano gratuito do Render, a primeira requisição após um período de inatividade pode demorar alguns segundos (cold start).

---

## Autor

Desenvolvido individualmente para a Tarefa de React - Film{IN}hos.

- **Pedro Lucas Almeida dos Santos**
