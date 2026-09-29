import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Hinos em domínio público - estrutura com metadados
// As letras completas estão disponíveis em: https://hymnstogod.org/
// Este script popula o banco com informações básicas
const publicDomainHymns = [
  {
    number: 101,
    title: "Amazing Grace",
    composer: "John Newton",
    author: "John Newton",
    tonality: "G",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 102,
    title: "Jesus Loves Me",
    composer: "William B. Bradbury",
    author: "Anna Bartlett Warner",
    tonality: "C",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 103,
    title: "Rock of Ages",
    composer: "Augustus Toplady",
    author: "Augustus Toplady",
    tonality: "D",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 104,
    title: "Jesus Christ Is Risen Today",
    composer: "Lyra Davidica",
    author: "Charles Wesley",
    tonality: "A",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 105,
    title: "O Come, All Ye Faithful",
    composer: "John Francis Wade",
    author: "John Francis Wade",
    tonality: "G",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 106,
    title: "Silent Night",
    composer: "Franz Xaver Gruber",
    author: "Joseph Mohr",
    tonality: "F",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 107,
    title: "Joy to the World",
    composer: "George Frideric Handel",
    author: "Isaac Watts",
    tonality: "D",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 108,
    title: "Hark! The Herald Angels Sing",
    composer: "Felix Mendelssohn",
    author: "Charles Wesley",
    tonality: "G",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 109,
    title: "O God, Our Help in Ages Past",
    composer: "William Croft",
    author: "Isaac Watts",
    tonality: "C",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  },
  {
    number: 110,
    title: "All Creatures of Our God and King",
    composer: "Ralph Vaughan Williams",
    author: "Francis of Assisi",
    tonality: "G",
    source: "salmos",
    lyrics: "[Domínio Público] Acesse https://hymnstogod.org/ para letra completa"
  }
];

async function seedDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "coral_hymn",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✓ Conectado ao banco de dados");

    // Verificar se já existem hinos públicos
    const [existing] = await connection.query(
      "SELECT COUNT(*) as count FROM hymns WHERE number >= 101 AND number <= 110"
    );

    if (existing[0].count > 0) {
      console.log("✓ Hinos em domínio público já foram adicionados");
      await connection.end();
      return;
    }

    // Inserir hinos
    for (const hymn of publicDomainHymns) {
      await connection.query(
        `INSERT INTO hymns (number, title, composer, author, tonality, source, lyrics)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          hymn.number,
          hymn.title,
          hymn.composer,
          hymn.author,
          hymn.tonality,
          hymn.source,
          hymn.lyrics,
        ]
      );
      console.log(`✓ Adicionado: ${hymn.title}`);
    }

    console.log("\n✓ Hinos em domínio público adicionados com sucesso!");
    console.log(
      "\n📌 Nota: As letras completas estão disponíveis em: https://hymnstogod.org/"
    );
    console.log(
      "Para adicionar as letras completas, você pode:"
    );
    console.log(
      "1. Copiar manualmente de https://hymnstogod.org/"
    );
    console.log("2. Usar a API do site se disponível");
    console.log(
      "3. Integrar com um serviço que fornece letras de hinos licenciadas"
    );

    await connection.end();
  } catch (error) {
    console.error("❌ Erro ao popular banco de dados:", error);
    console.error("Stack:", error.stack);
    process.exit(1);
  }
}

seedDatabase();
