import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import skills from '@/app/data/cv.json';

export const runtime = 'nodejs';
export const maxDuration = 30;

function buildSystemPrompt() {
  return `
Eres un asistente que SOLO puede responder usando el JSON de skills.
Devuelve siempre respuestas basadas en el JSON y nunca devuelvas json como respuesta, siempre devuelve respuestas en texto plano.
Si la pregunta no se puede responder con el JSON, responde EXACTAMENTE:
"No tengo esa información en mi CV."

JSON:
${JSON.stringify(skills, null, 2)}
`.trim();
}

function isSkillsQuestion(text: string) {
  const t = text.toLowerCase();

  // puedes afinar esto, pero vale para empezar
  const keywords = [
    'skill', 'skills', 'habil', 'tecnolog', 'stack',
    'frontend', 'backend', 'sql', 'react', 'angular', 'typescript',
    'node', 'express', 'docker', 'testing', 'jest', 'playwright',
    'mysql', 'mongodb', 'firebase', 'idioma', 'inglés',
  ];

  return keywords.some(k => t.includes(k));
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
  const lastText =
    lastUser?.parts?.find((p: any) => p.type === 'text')?.text ??
    lastUser?.content ??
    '';

  // ✅ Rechazo: devolvemos STREAM (no JSON)
  if (!isSkillsQuestion(String(lastText))) {
    const result = streamText({
      model: google('gemini-3-flash-preview'),
      messages: [
        { role: 'user', content: 'Responde exactamente: "No tengo esa información en mi CV."' },
      ],
      temperature: 0,
    });

    return result.toUIMessageStreamResponse();
  }

  // ✅ Caso normal: STREAM
  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages.slice(-6)),
    temperature: 0,
  });

  return result.toUIMessageStreamResponse();
}
