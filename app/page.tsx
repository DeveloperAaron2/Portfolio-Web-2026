import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* HERO con background SOLO aquí */}
      <section className="relative min-h-[78vh] overflow-hidden">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <Image
            src="/homebg.jpeg"
            alt="Background"
            priority
            fill
            className="object-cover"
          />
          {/* Oscurece sin matar la imagen */}
          <div className="absolute inset-0 bg-black/55" />
          {/* degradado suave abajo para que “acabe” bonito */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Texto en card (legible siempre) */}
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 text-white shadow-sm backdrop-blur-md">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Personal assistant available
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Welcome to my Portfolio.
                <span className="block text-white/80">
                  Explore projects or chat with my AI assistant.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                Ask about my skills from my CV JSON. The chatbot stays focused on my skills.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/chatbot"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm hover:opacity-90"
                >
                  Go to Chatbot
                </Link>

                <Link
                  href="/skills"
                  className="rounded-2xl border border-white/20 bg-black/20 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-black/30"
                >
                  View Skills
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Nivel de Fronted', 'Stack backend', 'BBDD Skills'].map((chip) => (
                  <Link
                    key={chip}
                    href={`/chatbot?prompt=${encodeURIComponent(chip)}`}
                    className="rounded-full border border-white/15 bg-black/15 px-3 py-1.5 text-xs text-white/80 hover:bg-black/25"
                  >
                    {chip}
                  </Link>
                ))}
              </div>
            </div>

            {/* Preview del chat (también legible) */}
            <div className="mx-auto w-full max-w-xl">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-black/20">
                      <span className="text-sm font-semibold text-white">AI</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white leading-none">Chatbot</div>
                      <div className="mt-1 text-xs text-white/70">Skills-only assistant</div>
                    </div>
                  </div>
                  <span className="text-xs text-white/60">Preview</span>
                </div>

                <div className="mt-4 space-y-3 text-white">
                  <div className="flex items-end gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xs font-semibold">
                      AI
                    </div>
                    <div className="max-w-[85%] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90">
                      Pregúntame por mis skills: Frontend, Backend, SQL Server, Testing…
                    </div>
                  </div>

                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[85%] rounded-2xl bg-white px-4 py-3 text-sm text-black">
                      ¿Qué nivel tengo en React?
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xs font-semibold">
                      Tú
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/20 text-xs font-semibold">
                      AI
                    </div>
                    <div className="max-w-[85%] rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/90">
                      En mi CV: <b>React</b> — nivel <b>Intermedio</b> (categoría Frontend).
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs text-white/70">
                  Tip: Abre el chat y prueba uno de los prompts.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
