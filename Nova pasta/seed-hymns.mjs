import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Dados públicos dos hinos da Harpa Cristã
const harpaHymns = [
  { number: 1, title: "Jesus, Meu Redentor", composer: "Isaac Watts", author: "Isaac Watts", tonality: "G" },
  { number: 2, title: "Vinde, Almas Pecadoras", composer: "Charles Wesley", author: "Charles Wesley", tonality: "C" },
  { number: 3, title: "Glória ao Nosso Deus", composer: "Henry Overstreet", author: "Henry Overstreet", tonality: "D" },
  { number: 4, title: "Que Alegria Quando Ouço", composer: "Lowell Mason", author: "Lowell Mason", tonality: "F" },
  { number: 5, title: "Cristo Venceu", composer: "George F. Root", author: "George F. Root", tonality: "A" },
  { number: 6, title: "Louvor a Cristo", composer: "Tradicional", author: "Tradicional", tonality: "G" },
  { number: 7, title: "Que Coisa Gloriosa", composer: "John Newton", author: "John Newton", tonality: "D" },
  { number: 8, title: "Graça Maravilhosa", composer: "John Newton", author: "John Newton", tonality: "A" },
  { number: 9, title: "Firme na Fé", composer: "Tradicional", author: "Tradicional", tonality: "C" },
  { number: 10, title: "Segue-me, Cristo Chamou", composer: "Cecil F. Alexander", author: "Cecil F. Alexander", tonality: "G" },
];

// Dados públicos dos hinos do Cantor Cristão
const cantorHymns = [
  { number: 1, title: "Quando Vejo a Cruz", composer: "Isaac Watts", author: "Isaac Watts", tonality: "C" },
  { number: 2, title: "Jesus Ama a Mim", composer: "Anna B. Warner", author: "Anna B. Warner", tonality: "G" },
  { number: 3, title: "Que Dia Glorioso", composer: "Edward Mote", author: "Edward Mote", tonality: "D" },
  { number: 4, title: "Doce Comunhão", composer: "Tradicional", author: "Tradicional", tonality: "F" },
  { number: 5, title: "Meu Jesus, Meu Rei", composer: "Tradicional", author: "Tradicional", tonality: "A" },
  { number: 6, title: "Ó Quão Lindo é Vê-lo", composer: "Tradicional", author: "Tradicional", tonality: "G" },
  { number: 7, title: "Vencedor Glorioso", composer: "Tradicional", author: "Tradicional", tonality: "D" },
  { number: 8, title: "Louvo Meu Senhor", composer: "Tradicional", author: "Tradicional", tonality: "C" },
  { number: 9, title: "Que Paz Tão Doce", composer: "Tradicional", author: "Tradicional", tonality: "F" },
  { number: 10, title: "Meu Refúgio é Jesus", composer: "Tradicional", author: "Tradicional", tonality: "G" },
];

// Salmos selecionados
const salmos = [
  { number: 1, title: "Salmo 23 - O Senhor é Meu Pastor", composer: "Tradicional", author: "Davi", tonality: "G" },
  { number: 2, title: "Salmo 42 - Como a Corça", composer: "Tradicional", author: "Filhos de Coré", tonality: "D" },
  { number: 3, title: "Salmo 84 - Quão Amáveis São Teus Tabernáculos", composer: "Tradicional", author: "Filhos de Coré", tonality: "C" },
  { number: 4, title: "Salmo 91 - Aquele que Habita", composer: "Tradicional", author: "Tradicional", tonality: "F" },
  { number: 5, title: "Salmo 100 - Fazei Alegre Aclamação", composer: "Tradicional", author: "Tradicional", tonality: "A" },
];

async function seedDatabase() {
  try {
    console.log("🌱 Iniciando seed do banco de dados...\n");

    // Conectar ao banco de dados
    const connection = await mysql.createConnection(process.env.DATABASE_URL);

    // Preparar dados para inserção
    const allHymns = [
      ...harpaHymns.map((h) => ({
        number: h.number,
        title: h.title,
        source: "harpa_crista",
        lyrics: `[Letra do hino será adicionada manualmente]\n\nHino: ${h.title}\nCompositor: ${h.composer}\nAutor: ${h.author}`,
        tonality: h.tonality,
        composer: h.composer,
        author: h.author,
      })),
      ...cantorHymns.map((h) => ({
        number: h.number,
        title: h.title,
        source: "cantor_cristao",
        lyrics: `[Letra do hino será adicionada manualmente]\n\nHino: ${h.title}\nCompositor: ${h.composer}\nAutor: ${h.author}`,
        tonality: h.tonality,
        composer: h.composer,
        author: h.author,
      })),
      ...salmos.map((h) => ({
        number: h.number,
        title: h.title,
        source: "salmos",
        lyrics: `[Letra do salmo será adicionada manualmente]\n\nSalmo: ${h.title}\nCompositor: ${h.composer}\nAutor: ${h.author}`,
        tonality: h.tonality,
        composer: h.composer,
        author: h.author,
      })),
    ];

    console.log(`📝 Inserindo ${allHymns.length} hinos no banco de dados...\n`);

    // Inserir hinos usando SQL direto
    for (const hymn of allHymns) {
      const query = `
        INSERT INTO hymns (number, title, source, lyrics, tonality, composer, author)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      await connection.execute(query, [
        hymn.number,
        hymn.title,
        hymn.source,
        hymn.lyrics,
        hymn.tonality,
        hymn.composer,
        hymn.author,
      ]);

      const sourceLabel = hymn.source === "harpa_crista" ? "Harpa" : hymn.source === "cantor_cristao" ? "Cantor" : "Salmo";
      console.log(`✅ ${sourceLabel} - ${hymn.number}. ${hymn.title}`);
    }

    console.log(`\n✨ Seed concluído com sucesso!`);
    console.log(`📊 Total de hinos inseridos: ${allHymns.length}`);
    console.log(`   - Harpa Cristã: ${harpaHymns.length}`);
    console.log(`   - Cantor Cristão: ${cantorHymns.length}`);
    console.log(`   - Salmos: ${salmos.length}`);

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao fazer seed do banco de dados:", error);
    process.exit(1);
  }
}

seedDatabase();
