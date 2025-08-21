import { GoogleGenAI, Type } from "@google/genai";
import { Product } from './types';
import { PRODUCTS } from './constants';

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

export const getVibeRecommendation = async (answers: string[], products: Product[]): Promise<{ recommendedProduct: Product, reason: string }> => {
  if (!API_KEY) {
    throw new Error("A chave de API não está configurada.");
  }

  const productInfo = products.map(p => 
    `{ "id": ${p.id}, "name": "${p.name}", "flavors": "${p.flavors.join(', ')}" }`
  ).join(',\n');

  const prompt = `Você é um "Vape Sommelier" especialista e super descolado. Sua missão é recomendar o vape perfeito para um cliente com base em suas respostas a um quiz de "vibe".

As respostas do cliente foram:
1. Rolê ideal: ${answers[0]}
2. Preferência de sabor: ${answers[1]}
3. Cor que representa: ${answers[2]}

Aqui está a lista de produtos disponíveis no formato JSON:
[
${productInfo}
]

Analise as respostas e a lista de produtos. Escolha UM ÚNICO produto que melhor corresponda à vibe do cliente. Forneça uma justificativa curta, empolgante e personalizada em português do Brasil, explicando por que esse produto é a escolha perfeita. Use emojis!

Responda APENAS no formato JSON especificado.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedProductId: {
              type: Type.NUMBER,
              description: "O ID do produto recomendado."
            },
            reason: {
              type: Type.STRING,
              description: "A justificativa para a recomendação, em português."
            }
          }
        }
      }
    });

    const resultJson = JSON.parse(response.text);
    const recommendedProduct = products.find(p => p.id === resultJson.recommendedProductId);

    if (!recommendedProduct) {
      throw new Error("A IA recomendou um produto que não existe.");
    }

    return {
      recommendedProduct,
      reason: resultJson.reason
    };

  } catch (error) {
    console.error("Erro ao gerar recomendação de vibe:", error);
    throw new Error("Oops! Nossos sommeliers de vibe estão recarregando. Tente de novo.");
  }
};
