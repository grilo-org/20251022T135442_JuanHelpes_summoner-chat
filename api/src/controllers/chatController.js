const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function gerarRespostaGemini(prompt) {
  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    return (
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Erro ao gerar resposta."
    );
  } catch (error) {
    console.error(
      "Erro ao conversar com Gemini:",
      error?.response?.data || error
    );
    throw new Error("Erro na IA (Gemini)");
  }
}

module.exports = {
  chatWithLlama: async (req, res) => {
    const { contexto, historico } = req.body;

    const contextoInicial = `
Você é um coach profissional de League of Legends.

Informações da partida:
- Jogador: ${contexto.summonerName}
- Campeão: ${contexto.champion}
- Rota: ${contexto.role}
- Aliados: ${contexto.allies.join(", ")}
- Inimigos: ${contexto.enemies.join(", ")}

Responda com base na partida.
`;

    const conversa = historico
      .map((msg) => `${msg.role === "user" ? "Usuário" : "IA"}: ${msg.content}`)
      .join("\n");

    const prompt = `${contextoInicial}\n\n${conversa}\n\nRegras de resposta:
- Seja direto e objetivo.
- Tente reponder em poucas frases.
- Liste builds e sugestões em tópicos, um por linha.


IA:`;

    try {
      const resposta = await gerarRespostaGemini(prompt);
      res.json({ resposta });
    } catch (error) {
      res.status(500).json({ erro: "Erro na IA" });
    }
  },

  chatWelcome: async (req, res) => {
    const { contexto } = req.body;

    const prompt = `
Você é um coach objetivo de League of Legends.

Abaixo estão os dados da partida:
- Jogador: ${contexto.summonerName}
- Campeão: ${contexto.champion}
- Rota: ${contexto.role}
- Aliados: ${contexto.allies.join(", ")}
- Inimigos: ${contexto.enemies.join(", ")}

Dê boas-vindas ao jogador e já recomende uma build curta para o campeão escolhido, contra o time inimigo.  
Responda de forma curta e direta. Liste a build em ordem, um item por linha.

Exemplo de resposta:
---
Bem-vindo, invocador!

Contra esse time, com o campeão escolhido, uma build recomendada é:
1. Bota da rapidez
2. Colhedor de Essência
3. Gume do Infinito
4. Canhão fumegante
5. Lembranças do Lorde Dominik
---

Agora responda:
`;

    try {
      const resposta = await gerarRespostaGemini(prompt);
      res.json({ resposta });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao gerar mensagem inicial com IA." });
    }
  },
};
