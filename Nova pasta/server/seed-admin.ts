import { protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

/**
 * Hinos em domínio público - estrutura com metadados
 * As letras completas estão disponíveis em: https://hymnstogod.org/
 */
const publicDomainHymns = [
  {
    number: 101,
    title: "Amazing Grace",
    composer: "John Newton",
    author: "John Newton",
    tonality: "G",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 102,
    title: "Jesus Loves Me",
    composer: "William B. Bradbury",
    author: "Anna Bartlett Warner",
    tonality: "C",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 103,
    title: "Rock of Ages",
    composer: "Augustus Toplady",
    author: "Augustus Toplady",
    tonality: "D",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 104,
    title: "Jesus Christ Is Risen Today",
    composer: "Charles Wesley",
    author: "Charles Wesley",
    tonality: "A",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 105,
    title: "O Come, All Ye Faithful",
    composer: "John Francis Wade",
    author: "John Francis Wade",
    tonality: "G",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 106,
    title: "Silent Night",
    composer: "Franz Xaver Gruber",
    author: "Joseph Mohr",
    tonality: "F",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 107,
    title: "Joy to the World",
    composer: "George Frideric Handel",
    author: "Isaac Watts",
    tonality: "D",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 108,
    title: "Hark! The Herald Angels Sing",
    composer: "Felix Mendelssohn",
    author: "Charles Wesley",
    tonality: "G",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 109,
    title: "O God, Our Help in Ages Past",
    composer: "William Croft",
    author: "Isaac Watts",
    tonality: "C",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 110,
    title: "All Creatures of Our God and King",
    composer: "Ralph Vaughan Williams",
    author: "Francis of Assisi",
    tonality: "G",
    source: "salmos" as const,
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  }
];

export const seedAdminRouter = router({
  seedPublicDomainHymns: protectedProcedure.mutation(async ({ ctx }) => {
    // Apenas admin pode executar
    if (ctx.user?.role !== 'admin') {
      throw new Error('Apenas administradores podem executar este comando');
    }

    const { getDb } = await import('./db');
    const { hymns: hymnsTable } = await import('../drizzle/schema');
    const { eq } = await import('drizzle-orm');

    const db = await getDb();
    if (!db) {
      throw new Error('Banco de dados não disponível');
    }

    const results = [];

    for (const hymn of publicDomainHymns) {
      try {
        // Verificar se já existe
        const existing = await db
          .select()
          .from(hymnsTable)
          .where(eq(hymnsTable.number, hymn.number))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(hymnsTable).values(hymn);
          results.push({ success: true, title: hymn.title });
        } else {
          results.push({ success: false, title: hymn.title, reason: 'Já existe' });
        }
      } catch (error) {
        results.push({ success: false, title: hymn.title, reason: String(error) });
      }
    }

    return {
      message: 'Hinos em domínio público adicionados',
      results,
      total: results.filter(r => r.success).length,
      note: 'As letras completas estão disponíveis em: https://hymnstogod.org/'
    };
  }),
});
