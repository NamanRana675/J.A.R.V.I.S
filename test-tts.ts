import { GoogleGenAI } from "@google/genai";
async function test() {
  const ai = new GoogleGenAI({});
  try {
     const res = await ai.models.generateContent({
       model: "gemini-3.1-flash-tts-preview",
       contents: "Hello world"
     });
     console.log(JSON.stringify(res, null, 2));
  } catch (e) {
     console.error(e);
  }
}
test();
