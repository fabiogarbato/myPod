import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("A variável de ambiente API_KEY não está definida. As funcionalidades de IA não funcionarão.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateFlavorDescription = async (productName: string, flavors: string[]): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("A descrição da IA não está disponível. Por favor, configure sua chave de API.");
  }

  const prompt = `Crie uma descrição de sabor legal, jovem e empolgante para um cigarro eletrônico em português do Brasil. O tom deve ser impactante e moderno, como algo que você veria nas redes sociais. Use emojis.

Nome do Produto: ${productName}
Sabores Principais: ${flavors.join(", ")}

Gere uma descrição de cerca de 2-3 frases curtas.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar descrição do sabor:", error);
    return "Oops! As vibes do sabor estão offline no momento. Tente novamente.";
  }
};
