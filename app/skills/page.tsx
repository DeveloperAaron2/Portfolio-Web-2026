// components/SkillsSection.tsx
"use client";

import React, { useMemo, useState } from "react";
import cv from "../data/cv.json";

export type SkillItem = {
  name: string;
  level?: "Básico" | "Intermedio" | "Avanzado";
  tags?: string[];
};

export type SkillCategory = {
  id: string;
  title: string;
  subtitle?: string;
  items: SkillItem[];
};

type Props = {
  title?: string;
  description?: string;
  categories?: SkillCategory[];
  className?: string;
};

const DEFAULT_CATEGORIES: SkillCategory[] = JSON.parse(JSON.stringify(cv));

function levelPill(level?: SkillItem["level"]) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset";
  if (!level) return null;

  const map: Record<NonNullable<SkillItem["level"]>, string> = {
    Básico: "bg-zinc-50 text-zinc-700 ring-zinc-200",
    Intermedio: "bg-zinc-900 text-white ring-zinc-800",
    Avanzado: "bg-emerald-600 text-white ring-emerald-700",
  };

  return <span className={`${base} ${map[level]}`}>{level}</span>;
}

export default function SkillsSection({
  title = "Skills",
  description = "Technologies and tools I use to build end-to-end web products.",
  categories = DEFAULT_CATEGORIES,
  className = "",
}: Props) {
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const allCats = useMemo(
    () => [{ id: "all", title: "Todas", items: [] as SkillItem[] }, ...categories],
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCategory = active === "all" ? categories : categories.filter((c) => c.id === active);

    if (!q) return byCategory;

    return byCategory
      .map((c) => ({
        ...c,
        items: c.items.filter((s) => {
          const haystack = [
            s.name,
            ...(s.tags ?? []),
            s.level ?? "",
            c.title,
            c.subtitle ?? "",
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(q);
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [active, query, categories]);

  const totalShown = useMemo(
    () => filtered.reduce((acc, c) => acc + c.items.length, 0),
    [filtered]
  );

  return (
    <section className={`w-full ${className}`}>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600 md:text-base">{description}</p>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <div className="text-xs text-zinc-500">
              Mostrando <span className="font-medium text-zinc-900">{totalShown}</span> skills
            </div>
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find (example: SQL, React, JWT...)"
                className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-zinc-400 focus:border-zinc-300 md:w-[340px]"
              />
              {query.length > 0 && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100"
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {allCats.map((c) => {
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={[
                  "rounded-full px-3 py-1.5 text-sm transition",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200",
                ].join(" ")}
              >
                {c.title}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((cat) => (
            <div
              key={cat.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{cat.title}</h2>
                  {cat.subtitle && <p className="mt-1 text-sm text-zinc-600">{cat.subtitle}</p>}
                </div>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
                  {cat.items.length}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {cat.items.map((s) => (
                  <div
                    key={`${cat.id}:${s.name}`}
                    className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
                    title={s.tags?.length ? s.tags.join(" · ") : undefined}
                  >
                    <span className="font-medium text-zinc-900">{s.name}</span>
                    {levelPill(s.level)}
                    {s.tags?.length ? (
                      <span className="hidden text-xs text-zinc-500 group-hover:inline">
                        · {s.tags.join(" · ")}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
            <p className="text-sm text-zinc-600">
              There's no results  <span className="font-medium text-zinc-900">{query}</span>.
              Try another word.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
