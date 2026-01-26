import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import skills from '@/app/data/cv.json';

export const maxDuration = 30;


function getAllSkillNames(data: any[]) {
  const names: string[] = [];
  for (const group of data) {
    for (const item of group.items ?? []) {
      names.push(String(item.name));
      for (const tag of item.tags ?? []) names.push(String(tag));
    }

    if (group.title) names.push(String(group.title));
    if (group.subtitle) names.push(String(group.subtitle));
    if (group.id) names.push(String(group.id));
  }
  return [...new Set(names.map(s => s.toLowerCase()))];
}

const SKILL_TERMS = getAllSkillNames(skills as any);

function isSkillsQuestion(text: string) {
  const t = text.toLowerCase();

  // Preguntas típicas de skills que queremos permitir aunque no mencionen tecnología exacta:
  const allowedIntents = [
    'skills',
    'tecnologías',
    'stack',
    'frontend',
    'backend',
    'bases de datos',
    'testing',
    'devops',
    'herramientas',
    'idiomas',
    'nivel',
    'avanzado',
    'intermedio',
    'básico',
    'basic',
    'intermediate',
    'advanced',
  ];

  if (allowedIntents.some(k => t.includes(k))) return true;

  // Si menciona cualquier skill/tag/categoría del JSON, también lo permitimos:
  return SKILL_TERMS.some(term => term && t.includes(term));
}

function buildSystemPrompt(skillsData: unknown) {
  return `
Eres un asistente de portfolio que SOLO puede hablar sobre MIS SKILLS usando el JSON dado.
NO puedes inventar tecnologías, niveles, tags, años, empresas o experiencias.
NO uses conocimiento externo. NO respondas sobre temas generales.

Regla de rechazo:
Si la pregunta no es sobre mis skills o no se puede responder con el JSON, responde EXACTAMENTE:
"No tengo esa información en mi CV."

Reglas de respuesta:
- Responde en español.
- Respuestas cortas y claras (máximo 6-8 líneas).
- Si el usuario pide “mi stack”, responde agrupando por categorías del JSON.
- Si el usuario pregunta por una tecnología, responde con su nivel y categoría si aparece en el JSON.
- Si el usuario pide recomendaciones o comparativas (ej. “qué framework es mejor”), rechaza con la frase.

JSON_SKILLS:
${JSON.stringify(skillsData, null, 2)}
`.trim();
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
  const lastText =
    lastUser?.parts?.find((p: any) => p.type === 'text')?.text ??
    lastUser?.content ??
    '';

  // ✅ Guardrail fuerte: si no parece pregunta de skills, ni llamamos al modelo
  if (!isSkillsQuestion(String(lastText))) {
    return Response.json(
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        parts: [{ type: 'text', text: 'No tengo esa información en mi CV.' }],
      },
      { status: 200 }
    );
  }

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    messages: await convertToModelMessages(messages),
    system: buildSystemPrompt(skills),
    temperature: 0,
  });

  return result.toUIMessageStreamResponse();
}
