# Coral Hymn

> **Menos pasta. Mais música.**
>
> Site conceitual e documentação visual de um produto digital para organização de hinos, repertórios e ensaios de corais de igreja.

[![Status](https://img.shields.io/badge/status-protótipo%20visual-c05a4f?style=flat-square)](#status-do-projeto)
[![Interface](https://img.shields.io/badge/interface-responsiva-344c43?style=flat-square)](#experiência-e-funcionalidades)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?style=flat-square&logo=typescript&logoColor=white)](#tecnologias)
[![React](https://img.shields.io/badge/React-19-149eca?style=flat-square&logo=react&logoColor=white)](#tecnologias)
[![License](https://img.shields.io/badge/license-MIT-718371?style=flat-square)](LICENSE)

## Sobre o projeto

O Coral Hymn é uma proposta de aplicação mobile e web para ajudar corais de igreja a organizar seu repertório. A ideia é substituir pastas físicas, arquivos espalhados e buscas demoradas por uma biblioteca centralizada, simples de usar durante ensaios e cultos.

Este repositório contém a **primeira versão do site de apresentação do produto**. O site transforma o plano de desenvolvimento em uma experiência editorial responsiva. Ele comunica o problema, apresenta o MVP, explica a arquitetura recomendada e mostra um roteiro de evolução do nível iniciante ao avançado.

A aplicação completa de biblioteca de hinos, autenticação, banco de dados e sincronização offline ainda não está implementada neste repositório. O README separa essas duas camadas para que a evolução do projeto seja clara.

## Objetivos do produto

O produto final deverá permitir que cada coralista consiga:

- pesquisar um hino por número, título ou trecho;
- consultar coleções de hinos autorizadas;
- selecionar seu naipe vocal;
- visualizar ou destacar sua parte quando houver material separado;
- marcar hinos como favoritos;
- criar listas para ensaios e cultos;
- definir a ordem de apresentação;
- acessar a biblioteca mesmo sem conexão;
- ajustar o tamanho do texto e usar o modo noturno;
- consultar tonalidade, áudio ou playback quando esses materiais estiverem disponíveis e licenciados.

O foco não é criar uma rede social para músicos. O foco é oferecer uma ferramenta rápida, confiável e discreta para o momento em que o coral precisa encontrar e cantar um hino.

## Status do projeto

### Implementado neste site

- Landing page responsiva para desktop, tablet e celular.
- Navegação por âncoras entre Visão, MVP, Arquitetura e Roteiro.
- Hero com apresentação do produto e mockup visual da biblioteca.
- Seção de visão do produto e proposta de valor.
- Seção com os três pilares: biblioteca, naipe vocal e programação.
- Seção detalhada do escopo do MVP.
- Explicação visual da estratégia online/offline.
- Apresentação da stack técnica recomendada.
- Roteiro de desenvolvimento em três níveis.
- Seção sobre licenciamento de textos, partituras, áudios e arranjos.
- Pesquisa interna por termos como `offline`, `tenor`, `MVP` e `biblioteca`.
- Alternância entre modo claro e modo escuro.
- Menu responsivo para telas pequenas.
- Microinterações, estados de hover e respeito a `prefers-reduced-motion`.
- Ativo visual editorial aplicado ao hero.

### Ainda não implementado

- Cadastro, login e perfis de coralistas.
- Biblioteca real de hinos.
- Importação de Harpa Cristã, Cantor Cristão ou Salmos.
- API, banco de dados e painel administrativo.
- Busca textual conectada a dados persistidos.
- Download real de conteúdo para uso offline.
- Sincronização entre dispositivos.
- Partituras, cifras e linhas vocais reais.
- Reprodução de áudio e playback por naipe.
- Transposição de tonalidade.
- Publicação como aplicativo nativo para Android e iOS.

## Experiência e funcionalidades do site

### Hero e posicionamento

O primeiro bloco apresenta o produto com a frase **“Menos pasta. Mais música.”**. O lado esquerdo concentra a mensagem, os botões principais e os benefícios imediatos. O lado direito usa um mockup de biblioteca de hinos sobre uma textura editorial, reforçando a relação entre tradição musical e produto digital.

### Pesquisa interna

O botão de pesquisa abre uma caixa de diálogo com resultados filtráveis. A pesquisa consulta as seções do próprio site e encontra assuntos por título, seção e palavras-chave. Essa interação funciona como uma demonstração da experiência de busca que será necessária na futura biblioteca de hinos.

### Modo claro e modo escuro

A interface possui dois temas. O modo claro usa papel marfim, vinho coral, verde musgo e detalhes em dourado. O modo escuro preserva a mesma identidade visual com fundos castanhos profundos e contraste adequado para leitura em ambientes com pouca luz.

### Roteiro por níveis

A seção de roteiro divide a construção do produto em três etapas:

1. **Iniciante — Provar o fluxo:** interface, dados locais, busca, favoritos e listas.
2. **Intermediário — Conectar o coral:** autenticação, PostgreSQL, API, perfis e offline real.
3. **Avançado — Aprofundar o ensaio:** playback, transposição, metrônomo, anotações e escala.

Essa divisão reduz o risco de começar por funcionalidades complexas antes de validar o uso principal.

## Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| React 19 | Construção da interface e composição de componentes |
| TypeScript | Tipagem estática e segurança durante o desenvolvimento |
| Vite | Servidor de desenvolvimento e build do frontend |
| Tailwind CSS 4 | Utilitários de estilo e responsividade |
| Lucide React | Ícones consistentes da interface |
| Wouter | Roteamento client-side disponível no template |
| Framer Motion | Dependência disponível para futuras animações avançadas |
| Sonner | Sistema de notificações disponível no template |
| Express | Servidor estático usado no build de produção do template |
| Prettier | Formatação de código |
| pnpm | Gerenciamento de dependências |

### Arquitetura recomendada para a aplicação completa

O site atual é frontend-first e não possui backend de produto. Para transformar a proposta em uma aplicação completa, a arquitetura recomendada é:

```text
Aplicação mobile
  Expo + React Native + TypeScript

Aplicação web
  React + Vite + PWA

API
  Node.js + tRPC

Banco principal
  PostgreSQL

Armazenamento de mídia
  S3 ou storage compatível

Persistência local
  SQLite no mobile
  IndexedDB na web
```

O PostgreSQL deve ser a fonte principal dos dados. O SQLite e o IndexedDB devem manter uma cópia local da biblioteca selecionada, dos favoritos e das programações necessárias para o uso offline.

## Como executar localmente

### Pré-requisitos

Instale os seguintes recursos antes de começar:

- Node.js 20 ou superior;
- pnpm 10 ou compatível;
- Git;
- um navegador moderno com suporte a módulos JavaScript e CSS moderno.

### Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd coral-hymn-site
```

Instale as dependências:

```bash
pnpm install
```

Inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

O Vite exibirá a URL local no terminal. O comando `dev` usa `vite --host`, permitindo que a prévia seja acessada na rede configurada pelo ambiente de desenvolvimento.

### Outros comandos

```bash
# Verificar tipos TypeScript sem gerar arquivos
pnpm check

# Formatar os arquivos do projeto
pnpm format

# Gerar a versão de produção
pnpm build

# Servir a versão de produção localmente
pnpm start

# Abrir uma prévia Vite do build, quando necessário
pnpm preview
```

Antes de abrir um pull request, execute pelo menos `pnpm check` e `pnpm build`.

## Estrutura de pastas

```text
coral-hymn-site/
├── client/
│   ├── index.html             # HTML base, metadados e fontes
│   ├── public/                # Arquivos públicos pequenos
│   └── src/
│       ├── App.tsx            # Tema, providers e roteamento
│       ├── index.css          # Tokens visuais, temas e estilos globais
│       ├── main.tsx            # Ponto de entrada do React
│       ├── components/        # Componentes compartilháveis e UI
│       ├── contexts/          # Contextos, incluindo tema
│       ├── hooks/             # Hooks reutilizáveis
│       ├── lib/               # Utilitários do frontend
│       └── pages/
│           ├── Home.tsx       # Página principal do Coral Hymn
│           └── NotFound.tsx    # Página de rota não encontrada
├── server/
│   └── index.ts               # Servidor Express do build
├── shared/
│   └── const.ts               # Constantes compartilhadas do template
├── package.json               # Scripts e dependências
├── pnpm-lock.yaml             # Versões travadas das dependências
├── tsconfig.json              # Configuração TypeScript do frontend
├── vite.config.ts             # Configuração do Vite
└── README.md                  # Esta documentação
```

## Direção visual

A interface segue uma direção de **hinário editorial contemporâneo**. Ela combina referências de papel, livros e partituras com componentes de produto digital.

### Princípios visuais

- **Tipografia:** `DM Serif Display` para títulos expressivos e `Manrope` para texto funcional.
- **Paleta:** marfim e papel envelhecido como base, vinho coral para ações, verde musgo para estabilidade e sálvia para elementos de apoio.
- **Textura:** granulação suave e imagem editorial no hero para evitar uma aparência genérica e excessivamente plana.
- **Espaçamento:** blocos amplos e respiro entre seções para manter a leitura confortável.
- **Interação:** transições curtas, elevação sutil em cartões e estados de foco visíveis.
- **Acessibilidade:** contraste, navegação por teclado, atributos `aria-label` e suporte a redução de movimento.

Para alterar a identidade visual, comece pelos tokens em `client/src/index.css`. Evite espalhar valores de cor diretamente pelos componentes quando um token semântico puder representar a intenção.

## Diretrizes de desenvolvimento

### Componentes e páginas

A página principal está concentrada em `client/src/pages/Home.tsx` porque o projeto atual é uma landing page. À medida que a aplicação crescer, extraia blocos repetidos para `client/src/components/` e transforme fluxos independentes em páginas próprias.

Uma possível evolução seria:

```text
client/src/pages/
├── Home.tsx
├── Library.tsx
├── HymnDetails.tsx
├── Setlists.tsx
├── Profile.tsx
└── AdminContent.tsx
```

### Dados e conteúdo

Não coloque hinos completos, partituras, áudios ou arranjos no frontend sem confirmar os direitos de uso. No produto final, o conteúdo deve vir de uma fonte autorizada e possuir metadados que indiquem origem e status da licença.

### Responsividade

A experiência principal deve ser pensada primeiro para uma tela estreita. A pessoa pode estar segurando o celular durante um ensaio ou culto. Botões importantes devem ter área de toque confortável, texto legível e poucos passos até a leitura do hino.

### Interações futuras

Controles que ainda não possuem implementação real devem informar claramente seu estado. Não apresente uma ação visual como se ela tivesse salvo, sincronizado ou reproduzido algo quando ainda não há backend ou arquivo disponível.

## Modelo inicial de dados para a aplicação futura

As entidades abaixo são uma base para a próxima etapa do produto:

| Entidade | Responsabilidade |
|---|---|
| `users` | Identidade, perfil e tipo de voz do coralista |
| `choirs` | Igrejas ou grupos de coral |
| `choir_members` | Associação de usuários a corais e permissões |
| `collections` | Coleções de hinos e informações de origem |
| `hymns` | Número, título, letra, tonalidade e metadados |
| `hymn_voice_parts` | Partes vocais, partituras e áudios por naipe |
| `setlists` | Programações de culto ou ensaio |
| `setlist_items` | Hinos e ordem dentro de cada programação |
| `favorites` | Hinos salvos por cada coralista |
| `sync_operations` | Fila de alterações feitas durante o uso offline |

## Plano de evolução

### Fase 1 — Validar a experiência

O objetivo é confirmar se a navegação e a hierarquia de informação fazem sentido para um coralista. Use dados de teste ou um pequeno acervo autorizado. Valide principalmente a busca, a leitura e a criação de uma programação.

### Fase 2 — Criar a biblioteca real

Adicione a API, o banco de dados, o painel de conteúdo e as permissões. O administrador deve conseguir publicar e atualizar hinos sem editar código.

### Fase 3 — Implementar offline

Baixe de forma seletiva a biblioteca que o usuário deseja levar para o culto. Grave favoritos e listas localmente. Sincronize as mudanças quando a conexão voltar e trate conflitos de forma explícita.

### Fase 4 — Adicionar recursos musicais

Inclua linhas por naipe, áudios, playback, metrônomo e transposição somente quando a representação do arranjo e as licenças estiverem bem definidas.

### Fase 5 — Publicar e operar

Faça testes em dispositivos reais, revise acessibilidade, adicione monitoramento, configure backups e publique a política de privacidade antes de abrir o produto para vários corais.

## Direitos autorais e licenciamento

A utilização de coletâneas completas, letras, partituras, gravações e arranjos exige atenção individual ao status de cada material. O fato de um hino ser tradicional ou conhecido não significa automaticamente que qualquer edição, arranjo, gravação ou partitura possa ser redistribuído.

Antes de publicar conteúdo real:

1. identifique a edição e a fonte do material;
2. verifique quem detém os direitos da letra, arranjo, partitura e gravação;
3. registre a licença ou autorização no cadastro da coleção;
4. impeça a publicação de itens sem status confirmado;
5. mantenha um processo para remover ou substituir conteúdo quando necessário.

O site atual usa apenas conteúdo demonstrativo e não deve ser interpretado como uma autorização para distribuir as coletâneas mencionadas na proposta.

## Contribuição

Contribuições são bem-vindas, especialmente para melhorar acessibilidade, arquitetura de informação e experiência mobile.

Antes de enviar uma alteração:

1. crie uma branch com um nome descritivo;
2. mantenha o escopo da mudança pequeno;
3. preserve os tokens e os padrões visuais existentes;
4. execute `pnpm check` e `pnpm build`;
5. descreva no pull request o problema resolvido e como a alteração foi validada.

Sugestões de nomes de branch:

```text
feat/biblioteca-hinos
fix/menu-mobile
refactor/componentes-home
docs/licenciamento-conteudo
```

## Licença

O projeto está marcado como **MIT** no `package.json`. Essa licença cobre o código deste repositório, mas não concede automaticamente direitos sobre letras, partituras, áudios, imagens ou outros conteúdos musicais inseridos futuramente.

Consulte o arquivo `LICENSE` quando ele estiver presente no repositório e mantenha os avisos de terceiros exigidos pelas respectivas licenças.

## Referências

[1]: https://react.dev/ "React Documentation"

[2]: https://www.typescriptlang.org/docs/ "TypeScript Documentation"

[3]: https://vite.dev/guide/ "Vite Guide"

[4]: https://tailwindcss.com/docs/installation "Tailwind CSS Documentation"

[5]: https://docs.expo.dev/ "Expo Documentation"

[6]: https://www.postgresql.org/docs/ "PostgreSQL Documentation"

[7]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps "Progressive Web Apps — MDN Web Docs"

[8]: https://www.wipo.int/copyright/en/ "Copyright — World Intellectual Property Organization"
