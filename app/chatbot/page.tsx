'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useEffect, useMemo, useRef, useState } from 'react';

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function MessageText({ message }: { message: any }) {
  // Renderiza solo texto, y deja tool-weather como bloque (opcional)
  return (
    <>
      {message.parts?.map((part: any, i: number) => {
        if (part.type === 'text') {
          return (
            <p key={`${message.id}-${i}`} className="whitespace-pre-wrap leading-relaxed">
              {part.text}
            </p>
          );
        }
        if (part.type === 'tool-weather') {
          return (
            <pre
              key={`${message.id}-${i}`}
              className="mt-2 rounded-xl border border-zinc-200/60 bg-zinc-50 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {JSON.stringify(part, null, 2)}
            </pre>
          );
        }
        return null;
      })}
    </>
  );
}

export default function ChatbotPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  // Auto-scroll al último mensaje
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, status]);

  const canSend = useMemo(() => input.trim().length > 0 && status !== 'streaming', [input, status]);

  async function onSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    await sendMessage({ text });
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <span className="text-sm font-semibold">AI</span>
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">Chatbot</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {status === 'streaming' ? 'Escribiendo…' : 'Listo'}
                </div>
              </div>
            </div>

            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {messages.length} mensajes
            </div>
          </div>
        </header>

        {/* Chat body */}
        <section className="flex-1 px-4 py-6">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
              <h2 className="text-base font-semibold">Start a conversation</h2>


              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'Tell me 5 notable skills on my CV',
                  'Tell me about my experience with Frontend Development',
                  'Years of experience with backend technologies',
                ].map((chip) => (
                  <button
                    key={chip}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-black dark:text-zinc-300 dark:hover:bg-zinc-900"
                    onClick={() => setInput(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((message: any) => {
              const isUser = message.role === 'user';

              return (
                <div
                  key={message.id}
                  className={cn('flex items-end gap-2', isUser ? 'justify-end' : 'justify-start')}
                >
                  {/* Avatar (AI only) */}
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      AI
                    </div>
                  )}

                  {/* Bubble */}
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-3 shadow-sm',
                      isUser
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-black'
                        : 'border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50'
                    )}
                  >
                    <div className="mb-1 text-[11px] opacity-70">
                      {isUser ? 'Tú' : 'Asistente'}
                    </div>
                    <MessageText message={message} />
                  </div>

                  {/* Avatar (User only) */}
                  {isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                      Tú
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {status === 'streaming' && (
              <div className="flex items-end gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-white text-xs font-semibold shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                  AI
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">•</span>
                    <span className="animate-bounce [animation-delay:120ms]">•</span>
                    <span className="animate-bounce [animation-delay:240ms]">•</span>
                  </span>
                </div>
              </div>
            )}

            {/* Error */}
            {status === 'error' && (
              <div className="mx-auto w-full max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-300">
                {error?.message ?? 'Ha ocurrido un error'}
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </section>

        {/* Composer */}
        <footer className="sticky bottom-0 border-t border-zinc-200/70 bg-zinc-50/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
          <div className="mx-auto flex w-full max-w-3xl items-end gap-2 px-4 py-3">
            <div className="relative flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                placeholder="Escribe tu mensaje… (Enter para enviar, Shift+Enter para salto de línea)"
                rows={1}
                className="max-h-40 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-600"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (canSend) onSend();
                  }
                }}
              />
              <div className="mt-1 px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                {status === 'streaming' ? 'Generando respuesta…' : ' '}
              </div>
            </div>

            <button
              type="button"
              onClick={onSend}
              disabled={!canSend}
              className={cn(
                'rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition',
                canSend
                  ? 'bg-zinc-900 text-white hover:opacity-90 dark:bg-white dark:text-black'
                  : 'cursor-not-allowed bg-zinc-200 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-500'
              )}
            >
              Enviar
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
