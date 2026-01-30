import { streamText, convertToModelMessages } from 'ai';
import { google } from '@ai-sdk/google';
import skills from '@/app/data/cv.json';

export const runtime = 'nodejs';
export const maxDuration = 30;


function buildSystemPrompt() {
  return `
Eres un asistente virtual diseñado para responder preguntas sobre el perfil profesional descrito en el siguiente JSON de habilidades (skills).

Instrucciones Clave:
1. **Naturalidad y Conversación**: Responde de forma amable, profesional y fluida. Evita respuestas robóticas o excesivamente breves.
2. **Máximo Contexto**: Utiliza toda la información disponible en el JSON para enriquecer tus respuestas. Si preguntan por una tecnología, menciona su nivel, categoría o relación con otras habilidades del perfil para dar una visión completa.
3. **Restricción de Fuente**: Toda tu información debe provenir EXCLUSIVAMENTE del JSON proporcionado. No inventes datos, experiencia o detalles personales que no estén explícitos allí.
4. **Manejo de Desconocidos**: Si se te pregunta por algo que no está en el JSON, indica educadamente que no tienes información sobre ello en el contexto de este CV o stack tecnológico, sin inventar nada.
5. Si preguntan por algo que no está en el JSON pero tiene que ver con el sector tecnológico, trata de relacionarlo respondiendo con información que si existe en el JSON.
Formato de salida: Texto plano conversacional.

Datos del perfil (JSON):
${JSON.stringify(skills, null, 2)}
`.trim();
}

function isSkillsQuestion(text: string) {
  const t = text.toLowerCase();

  const baseKeywords = [
    'skill', 'skills', 'habilidades', 'tecnologías', 'stack', 'experiencia',
    'frontend', 'backend', 'fullstack', 'idioma', 'inglés', 'cv', 'curriculum',
    'contacto', 'sobre ti', 'quién eres', 'educación', 'formación'
  ];

  const skillKeywords = skills.flatMap((category: any) => [
    category.title.toLowerCase(),
    ...category.items.flatMap((item: any) => [
      item.name.toLowerCase(),
      ...(item.tags || []).map((tag: string) => tag.toLowerCase())
    ])
  ]);

  const allKeywords = [...new Set([...baseKeywords, ...skillKeywords])];

  return allKeywords.some(k => t.includes(k));
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const lastUser = [...messages].reverse().find((m: any) => m.role === 'user');
  const lastText =
    lastUser?.parts?.find((p: any) => p.type === 'text')?.text ??
    lastUser?.content ??
    '';


  if (!isSkillsQuestion(String(lastText))) {
    const result = streamText({
      model: google('models/gemini-2.5-flash-lite'),
      messages: [
        { role: 'user', content: 'Responde exactamente: "No tengo esa información en mi CV."' },
      ],
      temperature: 0,
    });

    return result.toUIMessageStreamResponse();
  }


  const result = streamText({
    model: google('models/gemini-2.5-flash-lite'),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages.slice(-6)),
    temperature: 0,
  });

  return result.toUIMessageStreamResponse();
}
