import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export default async function generateContent(contents: string): Promise<string> {
  console.log(contents);

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: contents,
  });
  console.log(response.text);

  return response.text || "";
}

// 영어 → 한글 번역 함수
export async function translateToKorean(englishSentence: string): Promise<string> {
  try {
    const prompt = `
### Instruction ###
Translate the following English sentence into Korean. Only provide the Korean translation, nothing else. No explanations, no extra text.

### Rules ###
1. Do not translate proper nouns (e.g., names of people, places, companies, products). They must be kept in their original English text.
2. In general, words that start with a capital letter in the middle of a sentence are proper nouns.
3. If the first word of the sentence is a name (like 'Apple' or 'Gemini'), it is also a proper noun and should not be translated.

### Examples ###
- Source Sentence: Gemini was developed by Google in California.
- Correct Translation: Gemini는 California에 있는 Google에서 개발했다.

- Source Sentence: Apple announced its new iPhone in Cupertino.
- Correct Translation: Apple은 Cupertino에서 새로운 iPhone을 발표했다.

- Source Sentence: This is a new product from Microsoft.
- Correct Translation: 이것은 Microsoft의 새로운 제품입니다.

### Sentence to Translate ###
${englishSentence}
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

// 배치 번역 (3개씩 묶어서 병렬 처리)
export async function translateBatch(
  sentences: { id: number; english: string }[]
): Promise<{ id: number; korean: string; error?: string }[]> {
  const BATCH_SIZE = 3;
  const results: { id: number; korean: string; error?: string }[] = [];

  // 3개씩 묶어서 처리
  for (let i = 0; i < sentences.length; i += BATCH_SIZE) {
    const batch = sentences.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (sentence) => {
        try {
          const korean = await translateToKorean(sentence.english);
          return { id: sentence.id, korean };
        } catch (error) {
          return {
            id: sentence.id,
            korean: "",
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
    );

    batchResults.forEach((result) => {
      if (result.status === "fulfilled") {
        results.push(result.value);
      } else {
        results.push({
          id: -1,
          korean: "",
          error: result.reason?.message || "Translation failed",
        });
      }
    });
  }

  return results;
}
