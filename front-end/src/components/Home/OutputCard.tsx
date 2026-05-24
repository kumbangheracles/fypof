"use client";

import { useAppearance } from "@/hooks/useAppearance";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

interface Props {
  output: string;
  loading: boolean;
  error: string;
}

export function OutputCard({ output, loading, error }: Props) {
  if (!output && !loading && !error) return null;

  const [isCopy, setIsCopy] = useState<boolean>(false);

  async function copyToClipboard() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setIsCopy(true);
  }
  const { appearance } = useAppearance();

  const isDark = appearance === "dark";

  return (
    <div
      className={`output-card ${cn(isDark ? "bg-gold-abyss/50" : "bg-gray-700")} p-4`}
    >
      <p className="field-label text-xl text-gold-abyss mb-3">
        Your peak of fiction ✦
      </p>

      {error && <p className="text-amber-600/80 italic text-base">{error}</p>}

      {loading && !output && (
        <div className="flex gap-2 items-center py-4">
          <span className="dot" style={{ animationDelay: "0ms" }} />
          <span className="dot" style={{ animationDelay: "200ms" }} />
          <span className="dot" style={{ animationDelay: "400ms" }} />
        </div>
      )}

      {output && (
        <>
          <p className="fiction-text sm:text-sm text-[10px] font-mono!">
            {output}
            {loading && (
              <span className="inline-block w-px h-4 bg-amber-600/70 ml-0.5 animate-pulse" />
            )}
          </p>

          {!loading && (
            <button
              type="button"
              onClick={copyToClipboard}
              className="copy-btn mt-8 p-2 bg-gold-abyss-end"
            >
              {isCopy ? (
                <div className="flex items-center gap-2">
                  <Check /> Copied to clipboard
                </div>
              ) : (
                "⊕ copy to clipboard"
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
