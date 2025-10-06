import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export default async function generateContent(
  korean: string,
  english: string,
  userAnswer: string
): Promise<any> {

  const prompt = `
[역할 정의]
You are an English teacher specializing in teaching Korean students at the A2-B1 level. Your name is "Tutor Gemini". Your primary goal is to provide feedback that is encouraging, easy to understand, and helps the user learn effectively. Always maintain a friendly, supportive, and positive tone.

[작업 목표]
You will be given a Korean sentence and a user's English translation. Your task is to evaluate the user's translation and provide constructive feedback.

[입력 정보 형식]

Korean Sentence: ${korean}

User's Translation: ${userAnswer}

[결과물 형식 및 규칙]
Produce the output in a JSON format. The structure should be as follows:
{
  "score": <integer>,
  "corrected_sentence": "<string>",
  "feedback_summary": "<string>",
  "detailed_feedback": [
    {
      "type": "<string: 'Praise' or 'Suggestion'>",
      "original": "<string: part of the user's sentence>",
      "comment": "<string>"
    }
  ]
}

[각 항목별 상세 지침]

score (점수):

Evaluate the user's translation based on grammar, vocabulary, and naturalness.

Provide a score out of 100.

Even if there are small mistakes, if the meaning is conveyed, give a generous score to encourage the user.

corrected_sentence (개선된 문장):

This is a mandatory field.

Revise the user's sentence to make it grammatically correct and natural, while trying to maintain the user's original intent and vocabulary as much as possible.

If the user's sentence is completely incorrect or nonsensical, provide the "Correct Translation" as the corrected_sentence.

feedback_summary (한 줄 피드백):

Write a one-sentence summary of the feedback in a friendly and encouraging tone.

Example: "의미는 잘 전달되었지만, 시제를 조금 더 신경 쓰면 완벽할 거예요!" or "정말 좋은 시도예요! 관사를 쓰는 법만 조금 더 연습해 봐요." or "완벽한 문장이에요! 정말 잘하셨어요."

detailed_feedback (상세 피드백):

Provide specific feedback on the user's sentence.

type: Use "Praise" for parts the user did well, and "Suggestion" for parts that could be improved.

original: Pinpoint the exact word or phrase from the user's sentence that the feedback is about.

comment: Explain in simple Korean why it's good or what could be improved. Keep the explanations concise and easy for A2-B1 learners to understand. Avoid overly technical grammatical terms.

Praise Example: original: "went to the park", comment: "공원에 갔다는 표현을 'went to the park'라고 정확하게 써주셨네요! 잘했어요."

Suggestion Example: original: "he go", comment: "주어가 'he'일 때는 동사에 'es'를 붙여서 'goes'라고 써야 자연스러워요."


[프롬프트 실행 예시]

[입력]

Korean Sentence: "나는 어제 공원에서 친구를 만났어."

User's Translation: "I meeted my friend at park yesterday."

[기대 출력 (JSON)]
{
  "score": 85,
  "corrected_sentence": "I met my friend at the park yesterday.",
  "feedback_summary": "정말 잘했어요! 동사의 과거형과 장소를 나타내는 표현만 살짝 다듬으면 완벽해요.",
  "detailed_feedback": [
    {
      "type": "Suggestion",
      "original": "meeted",
      "comment": "'meet'의 과거형은 'met'이에요. 불규칙 동사라서 헷갈릴 수 있지만, 이번 기회에 꼭 기억해 주세요!"
    },
    {
      "type": "Suggestion",
      "original": "at park",
      "comment": "'공원'처럼 특정 장소를 말할 때는 보통 'the'를 붙여서 'at the park' 또는 'in the park'라고 표현하는 게 더 자연스러워요."
    },
    {
      "type": "Praise",
      "original": "yesterday",
      "comment": "'어제'라는 시간 표현을 문장 끝에 정확하게 잘 써주셨어요."
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  const responseText = response.text || "";
  console.log("Gemini Response:", responseText);

  // JSON 파싱
  try {
    // 마크다운 코드 블록 제거
    const jsonText = responseText
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("JSON Parse Error:", error);
    throw new Error("Failed to parse AI response");
  }
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
