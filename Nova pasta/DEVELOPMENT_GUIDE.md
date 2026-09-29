# Guia de Desenvolvimento - Coral Hymn App

Um guia completo para entender e estender o aplicativo de organização de hinos para corais evangélicos.

---

## 📚 Índice

1. [Nível Iniciante](#nível-iniciante)
2. [Nível Intermediário](#nível-intermediário)
3. [Nível Avançado](#nível-avançado)
4. [Arquitetura Geral](#arquitetura-geral)
5. [Fluxo de Dados](#fluxo-de-dados)

---

## Nível Iniciante

### O que você vai aprender

Neste nível, você entenderá a estrutura básica do projeto, como executar o aplicativo e fazer pequenas personalizações visuais.

### Pré-requisitos

- Node.js 18+ instalado
- Conhecimento básico de React e TypeScript
- Familiaridade com linha de comando

### Começando

#### 1. Instalar dependências

```bash
cd /home/ubuntu/coral-hymn-app
pnpm install
```

#### 2. Executar o servidor de desenvolvimento

```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

#### 3. Entender a estrutura de pastas

```
coral-hymn-app/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas principais
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── contexts/      # Context API para estado global
│   │   ├── lib/           # Utilitários e configuração tRPC
│   │   ├── App.tsx        # Roteador principal
│   │   └── index.css      # Estilos globais
│   └── public/            # Arquivos estáticos
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # Definição de procedimentos tRPC
│   ├── db.ts              # Funções de banco de dados
│   └── _core/             # Configuração interna
├── drizzle/               # Schema do banco de dados
│   └── schema.ts          # Definição de tabelas
└── package.json           # Dependências do projeto
```

### Tarefas Iniciantes

#### Tarefa 1: Alterar cores do tema

**Objetivo**: Personalizar a paleta de cores do aplicativo.

**Arquivo**: `client/src/index.css`

**O que fazer**:

1. Abra o arquivo `index.css`
2. Procure pela seção `:root` (tema claro)
3. Modifique as variáveis CSS:

```css
:root {
  --primary: 147 51% 34%;        /* Roxo profundo */
  --accent: 38 92% 50%;          /* Ouro quente */
  --background: 0 0% 100%;       /* Branco */
  --foreground: 280 10% 15%;     /* Cinza escuro */
}
```

**Dica**: Use [Tailwind Color Generator](https://uicolors.app/) para gerar paletas de cores.

#### Tarefa 2: Adicionar um novo hino manualmente

**Objetivo**: Inserir um hino no banco de dados.

**Como fazer**:

1. Conecte-se ao banco de dados (veja seção de banco de dados)
2. Execute o SQL:

```sql
INSERT INTO hymns (number, title, source, lyrics, tonality, composer, author)
VALUES (
  11,
  'Novo Hino',
  'harpa_crista',
  'Letra do hino aqui...',
  'C',
  'Compositor',
  'Autor'
);
```

#### Tarefa 3: Modificar o layout da página inicial

**Objetivo**: Personalizar a página Home.

**Arquivo**: `client/src/pages/Home.tsx`

**O que fazer**:

1. Abra o arquivo `Home.tsx`
2. Modifique o conteúdo dentro da `<div className="container">`
3. Use componentes do shadcn/ui para manter consistência

**Exemplo**:

```tsx
<div className="container">
  <h1 className="text-5xl font-bold text-center mb-8">
    Bem-vindo ao Coral Hymn
  </h1>
  <p className="text-lg text-center text-muted-foreground">
    Seu novo texto aqui
  </p>
</div>
```

---

## Nível Intermediário

### O que você vai aprender

Neste nível, você aprenderá a:
- Criar novas páginas e rotas
- Trabalhar com o banco de dados
- Implementar novas funcionalidades com tRPC
- Escrever testes

### Conceitos-chave

#### 1. Sistema de Roteamento

O aplicativo usa **Wouter** para roteamento. Adicionar uma nova rota é simples:

**Arquivo**: `client/src/App.tsx`

```tsx
import NovaPage from "./pages/NovaPage";

function Router() {
  return (
    <Switch>
      <Route path={"/nova-pagina"} component={NovaPage} />
      {/* ... outras rotas */}
    </Switch>
  );
}
```

#### 2. Trabalhar com tRPC

tRPC é um framework para criar APIs type-safe. Cada operação é um "procedimento".

**Exemplo de procedimento no servidor** (`server/routers.ts`):

```ts
export const appRouter = router({
  hymns: router({
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const hymn = await db.select().from(hymns).where(eq(hymns.id, input));
        return hymn[0];
      }),
  }),
});
```

**Usar no cliente** (`client/src/pages/HymnDetail.tsx`):

```tsx
const { data: hymn } = trpc.hymns.getById.useQuery(hymnId);
```

#### 3. Schema do Banco de Dados

O banco de dados é definido em `drizzle/schema.ts`. Cada tabela é uma função:

```ts
export const hymns = mysqlTable("hymns", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  // ... mais colunas
});
```

### Tarefas Intermediárias

#### Tarefa 1: Criar uma nova página

**Objetivo**: Adicionar uma página "Sobre" ao aplicativo.

**Passos**:

1. Crie o arquivo `client/src/pages/About.tsx`:

```tsx
export default function About() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-6">Sobre o Coral Hymn</h1>
      <p className="text-lg text-muted-foreground">
        Conteúdo sobre o aplicativo...
      </p>
    </div>
  );
}
```

2. Adicione a rota em `client/src/App.tsx`:

```tsx
import About from "./pages/About";

// Dentro de <Switch>:
<Route path={"/about"} component={About} />
```

3. Adicione um link na navegação (em `Home.tsx` ou `DashboardLayout.tsx`):

```tsx
<Link href="/about">Sobre</Link>
```

#### Tarefa 2: Adicionar um novo campo ao usuário

**Objetivo**: Adicionar um campo "Denominação" ao perfil do usuário.

**Passos**:

1. **Atualizar schema** (`drizzle/schema.ts`):

```ts
export const users = mysqlTable("users", {
  // ... campos existentes
  denomination: varchar("denomination", { length: 100 }),
});
```

2. **Gerar migration**:

```bash
pnpm drizzle-kit generate
```

3. **Executar migration**:

```bash
# Copie o SQL gerado e execute via Management UI
```

4. **Atualizar procedimento** (`server/routers.ts`):

```ts
user: router({
  updatePreferences: protectedProcedure
    .input(z.object({
      denomination: z.string().optional(),
      // ... outros campos
    }))
    .mutation(async ({ ctx, input }) => {
      // Atualizar no banco de dados
    }),
}),
```

5. **Atualizar página de perfil** (`client/src/pages/Profile.tsx`):

```tsx
<Input
  placeholder="Sua denominação"
  value={denomination}
  onChange={(e) => setDenomination(e.target.value)}
/>
```

#### Tarefa 3: Criar um novo procedimento tRPC

**Objetivo**: Adicionar um procedimento para obter estatísticas do usuário.

**Passos**:

1. **Criar função no banco de dados** (`server/db.ts`):

```ts
export async function getUserStats(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const favoriteCount = await db
    .select({ count: sql`COUNT(*)` })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  return {
    favorites: favoriteCount[0]?.count || 0,
  };
}
```

2. **Adicionar procedimento** (`server/routers.ts`):

```ts
user: router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { getUserStats } = await import('./db');
    return getUserStats(ctx.user.id);
  }),
}),
```

3. **Usar no cliente**:

```tsx
const { data: stats } = trpc.user.getStats.useQuery();

return <div>Favoritos: {stats?.favorites}</div>;
```

#### Tarefa 4: Escrever um teste

**Objetivo**: Criar um teste para uma nova funcionalidade.

**Arquivo**: `server/novo-feature.test.ts`

```ts
import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("Nova Feature", () => {
  it("deve retornar dados corretos", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.hymns.search({ query: "Jesus" });
    expect(result).toBeInstanceOf(Array);
  });
});
```

**Executar testes**:

```bash
pnpm test
```

---

## Nível Avançado

### O que você vai aprender

Neste nível, você aprenderá a:
- Otimizar performance
- Implementar cache offline
- Integrar com APIs externas
- Implementar autenticação customizada
- Deploy em produção

### Conceitos Avançados

#### 1. Cache Offline com Service Worker

Para funcionar offline, implemente um Service Worker:

**Arquivo**: `client/public/sw.js`

```javascript
const CACHE_NAME = 'coral-hymn-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Registrar no cliente** (`client/src/main.tsx`):

```ts
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

#### 2. Integração com API de Áudio

Para adicionar suporte a áudio de hinos:

**Tabela de áudio** (`drizzle/schema.ts`):

```ts
export const hymnAudios = mysqlTable("hymnAudios", {
  id: int("id").autoincrement().primaryKey(),
  hymnId: int("hymnId").notNull(),
  vocalRange: mysqlEnum("vocalRange", ["soprano", "contralto", "tenor", "baixo", "full"]),
  audioUrl: text("audioUrl").notNull(),
  duration: int("duration"),
});
```

**Procedimento** (`server/routers.ts`):

```ts
hymns: router({
  getAudio: publicProcedure
    .input(z.object({
      hymnId: z.number(),
      vocalRange: z.enum(["soprano", "contralto", "tenor", "baixo", "full"]),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      const audio = await db
        .select()
        .from(hymnAudios)
        .where(
          and(
            eq(hymnAudios.hymnId, input.hymnId),
            eq(hymnAudios.vocalRange, input.vocalRange)
          )
        );
      return audio[0];
    }),
}),
```

#### 3. Notificações Push

Para enviar notificações de ensaios:

**Tabela de notificações** (`drizzle/schema.ts`):

```ts
export const rehearsalNotifications = mysqlTable("rehearsalNotifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  rehearsalId: int("rehearsalId").notNull(),
  sentAt: timestamp("sentAt").defaultNow(),
});
```

**Procedimento** (`server/routers.ts`):

```ts
rehearsals: router({
  sendNotification: protectedProcedure
    .input(z.object({
      rehearsalId: z.number(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'Novo Ensaio',
        content: input.message,
      });
    }),
}),
```

#### 4. Autenticação Customizada

O aplicativo usa Manus OAuth, mas você pode adicionar autenticação adicional:

**Middleware customizado** (`server/_core/auth.ts`):

```ts
export async function verifyUserRole(userId: number, requiredRole: string) {
  const db = await getDb();
  const user = await db.select().from(users).where(eq(users.id, userId));
  return user[0]?.role === requiredRole;
}
```

**Usar em procedimento**:

```ts
adminProcedure: protectedProcedure.use(async ({ ctx, next }) => {
  const isAdmin = await verifyUserRole(ctx.user.id, 'admin');
  if (!isAdmin) {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
}),
```

### Tarefas Avançadas

#### Tarefa 1: Implementar busca full-text

**Objetivo**: Melhorar a busca de hinos com índices de banco de dados.

**Passos**:

1. **Adicionar índice** (`drizzle/schema.ts`):

```ts
export const hymns = mysqlTable("hymns", {
  // ... campos
}, (table) => ({
  titleIdx: index("title_idx").on(table.title),
  lyricsIdx: index("lyrics_idx").on(table.lyrics),
}));
```

2. **Otimizar query** (`server/db.ts`):

```ts
export async function searchHymns(query: string) {
  const db = await getDb();
  const searchTerm = `%${query}%`;
  
  return db
    .select()
    .from(hymns)
    .where(
      or(
        like(hymns.title, searchTerm),
        like(hymns.lyrics, searchTerm),
        like(hymns.number, searchTerm)
      )
    )
    .limit(50);
}
```

#### Tarefa 2: Adicionar relatórios

**Objetivo**: Criar relatórios de uso do aplicativo.

**Passos**:

1. **Criar tabela de logs** (`drizzle/schema.ts`):

```ts
export const activityLogs = mysqlTable("activityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  hymnId: int("hymnId"),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

2. **Criar página de relatórios** (`client/src/pages/Reports.tsx`):

```tsx
export default function Reports() {
  const { data: logs } = trpc.reports.getActivityLogs.useQuery();

  return (
    <div className="container">
      <h1>Relatórios de Atividade</h1>
      {/* Renderizar gráficos com Recharts */}
    </div>
  );
}
```

#### Tarefa 3: Implementar sincronização em tempo real

**Objetivo**: Sincronizar listas de hinos entre usuários em tempo real.

**Usar Socket.io** (já configurado no template):

**Servidor** (`server/_core/index.ts`):

```ts
io.on('connection', (socket) => {
  socket.on('list-updated', (data) => {
    io.emit('list-updated', data);
  });
});
```

**Cliente** (`client/src/hooks/useRealtimeSync.ts`):

```ts
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export function useRealtimeSync() {
  useEffect(() => {
    const socket = io();
    
    socket.on('list-updated', (data) => {
      // Atualizar estado local
    });

    return () => socket.disconnect();
  }, []);
}
```

---

## Arquitetura Geral

### Diagrama de Fluxo

```
┌─────────────────┐
│   Frontend      │
│   (React)       │
└────────┬────────┘
         │
         │ tRPC Calls
         │
┌────────▼────────┐
│   Backend       │
│   (Express)     │
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   Database      │
│   (MySQL)       │
└─────────────────┘
```

### Stack Tecnológico

| Camada | Tecnologia | Propósito |
|--------|-----------|----------|
| Frontend | React 19 | Interface do usuário |
| Styling | Tailwind CSS 4 | Estilização responsiva |
| UI Components | shadcn/ui | Componentes pré-construídos |
| Backend | Express 4 | Servidor HTTP |
| API | tRPC 11 | API type-safe |
| Database | MySQL | Armazenamento de dados |
| ORM | Drizzle | Gerenciamento de schema |
| Auth | Manus OAuth | Autenticação |

---

## Fluxo de Dados

### Exemplo: Buscar um Hino

1. **Usuário digita na barra de busca** (`Library.tsx`)
2. **Frontend chama tRPC** (`trpc.hymns.search.useQuery()`)
3. **Backend recebe query** (`server/routers.ts`)
4. **Backend consulta banco de dados** (`server/db.ts`)
5. **Banco retorna resultados** (MySQL)
6. **Backend retorna ao frontend** (via tRPC)
7. **Frontend renderiza resultados** (React)

### Código Completo do Fluxo

**Frontend** (`client/src/pages/Library.tsx`):

```tsx
const { data: results } = trpc.hymns.search.useQuery({
  query: searchTerm,
  source: selectedSource,
});

return (
  <div>
    {results?.map((hymn) => (
      <HymnCard key={hymn.id} hymn={hymn} />
    ))}
  </div>
);
```

**Backend** (`server/routers.ts`):

```ts
hymns: router({
  search: publicProcedure
    .input(z.object({
      query: z.string(),
      source: z.enum(['harpa_crista', 'cantor_cristao', 'salmos']).optional(),
    }))
    .query(async ({ input }) => {
      const { searchHymns } = await import('./db');
      return searchHymns(input.query, input.source);
    }),
}),
```

**Banco de Dados** (`server/db.ts`):

```ts
export async function searchHymns(query: string, source?: string) {
  const db = await getDb();
  const searchTerm = `%${query}%`;

  let q = db.select().from(hymns);

  if (source) {
    q = q.where(eq(hymns.source, source));
  }

  return q.where(
    or(
      like(hymns.title, searchTerm),
      like(hymns.lyrics, searchTerm)
    )
  );
}
```

---

## Próximos Passos

### Para Iniciantes

- [ ] Personalize as cores do tema
- [ ] Adicione um novo hino ao banco de dados
- [ ] Modifique a página inicial
- [ ] Explore os componentes do shadcn/ui

### Para Intermediários

- [ ] Crie uma nova página
- [ ] Adicione um novo campo ao usuário
- [ ] Implemente um novo procedimento tRPC
- [ ] Escreva testes para suas funcionalidades

### Para Avançados

- [ ] Implemente cache offline
- [ ] Adicione integração com API de áudio
- [ ] Implemente notificações push
- [ ] Otimize a performance com índices de banco de dados

---

## Recursos Adicionais

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [shadcn/ui](https://ui.shadcn.com)

---

## Suporte

Para dúvidas ou problemas, consulte:

1. A documentação do projeto
2. Os testes existentes (`server/*.test.ts`)
3. A comunidade de desenvolvimento

---

**Última atualização**: Março de 2026

**Versão**: 1.0.0
