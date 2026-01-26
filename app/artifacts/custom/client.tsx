"use client";

import React from "react";
import { Artifact } from "../../components/create-artifact";
import { toast } from "sonner";

type CustomArtifactMetadata = {
  info: string;
};

export const customArtifact = new Artifact<"custom", CustomArtifactMetadata>({
  kind: "custom",
  description: "Artifact custom (ejemplo) con soporte de streaming.",
  initialize: async ({ documentId, setMetadata }) => {
    setMetadata({ info: `Document ${documentId} initialized.` });
  },

  onStreamPart: ({ streamPart, setMetadata, setArtifact }) => {
    // Puedes inventarte tipos de streamPart y emitirlos desde server.ts (dataStream.writeData)
    if (streamPart.type === "info-update") {
      setMetadata((m) => ({ ...m, info: String(streamPart.content ?? "") }));
    }

    if (streamPart.type === "content-update") {
      setArtifact((draft) => ({
        ...draft,
        content: (draft.content ?? "") + String(streamPart.content ?? ""),
        status: "streaming",
      }));
    }
  },

  content: ({
    mode,
    isLoading,
    content,
    metadata,
    isCurrentVersion,
    currentVersionIndex,
    getDocumentContentById,
    onSaveContent,
  }) => {
    if (isLoading) return <div>Cargando artifact...</div>;

    if (mode === "diff") {
      const oldContent = getDocumentContentById(currentVersionIndex - 1);
      const newContent = getDocumentContentById(currentVersionIndex);
      return (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Diff</h3>
          <pre className="whitespace-pre-wrap rounded-md border p-3">{oldContent}</pre>
          <pre className="whitespace-pre-wrap rounded-md border p-3">{newContent}</pre>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="text-xs opacity-70">{metadata?.info}</div>

        <textarea
          className="min-h-[220px] w-full rounded-md border p-3"
          value={content ?? ""}
          onChange={(e) => onSaveContent(e.target.value)}
          disabled={!isCurrentVersion}
        />

        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => {
              navigator.clipboard.writeText(content ?? "");
              toast.success("Copiado al portapapeles");
            }}
          >
            Copy
          </button>
        </div>
      </div>
    );
  },

  actions: [
    {
      icon: <span>⟳</span>,
      description: "Refresh info",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Actualiza la info del artifact custom.",
        });
      },
    },
  ],

  toolbar: [
    {
      icon: <span>✎</span>,
      description: "Pedir edición",
      onClick: ({ appendMessage }) => {
        appendMessage({
          role: "user",
          content: "Edita el contenido del artifact custom.",
        });
      },
    },
  ],
});
