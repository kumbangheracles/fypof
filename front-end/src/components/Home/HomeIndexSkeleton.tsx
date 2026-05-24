"use client";

import { cn } from "@/lib/utils";

// ─── Base Skeleton ────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-sm bg-gold-abyss/40 relative overflow-hidden",
        // shimmer sweep
        "after:absolute after:inset-0 after:-translate-x-full",
        "after:bg-gradient-to-r after:from-transparent after:via-gold-mid/8 after:to-transparent",
        "after:animate-[shimmer_2s_infinite]",
        className,
      )}
    />
  );
}

// ─── Main Skeleton ────────────────────────────────────────────────────────────

export function HomeIndexSkeleton() {
  return (
    <div className="p-4 relative max-w-full sm:max-w-[60%] mx-auto">
      {/* SwitchThemeButton */}
      <div className="absolute right-4">
        <Skeleton className="h-8 w-[148px] rounded-none" />
      </div>

      <div className="flex flex-col gap-3">
        {/* Eyebrow — "AI Fiction Studio" */}
        <Skeleton className="h-3.5 w-32 rounded-none" />

        {/* Title — "Peak / Fiction" */}
        <div className="flex flex-col gap-1">
          <Skeleton className="h-14 w-28 rounded-none" />
          <Skeleton className="h-14 w-36 rounded-none" />
        </div>

        {/* Tagline */}
        <Skeleton className="h-3.5 w-48 rounded-none" />

        {/* Divider */}
        <div className="w-full h-0.5 rounded-xl bg-gold-abyss/30" />

        {/* ── Base Parameters ── */}
        <div className="mt-2 flex flex-col gap-8">
          {/* Opening sentence */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-44 ml-2 rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
          </div>

          {/* Genre / World */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-24 ml-2 rounded-none" />
            <Skeleton className="h-8 w-full rounded-none" />
          </div>

          {/* Protagonist + Antagonist */}
          <div className="flex w-full justify-between gap-4">
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-3 w-36 ml-2 rounded-none" />
              <Skeleton className="h-8 w-full rounded-none" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <Skeleton className="h-3 w-32 ml-2 rounded-none" />
              <Skeleton className="h-8 w-full rounded-none" />
            </div>
          </div>
        </div>

        {/* ── Color Palette ── */}
        <div className="mt-2">
          <div className="flex w-full justify-between items-center">
            <Skeleton className="h-3 w-40 ml-2 rounded-none" />
            <Skeleton className="h-8 w-16 rounded-none" />
          </div>

          <div className="flex items-center gap-3 justify-start w-full p-2">
            {/* Color swatches */}
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="w-10 h-8 shrink-0 rounded-none"
                style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
              />
            ))}
            {/* ColorPicker trigger */}
            <Skeleton className="w-10 h-8 shrink-0 rounded-none" />
          </div>
        </div>

        {/* ── Mood / Atmosphere ── */}
        <div className="mt-2 flex flex-col gap-1">
          <Skeleton className="h-3 w-32 ml-2 rounded-none" />
          <div className="flex gap-3 mt-2 flex-wrap items-center">
            {[
              "melancholic",
              "ethereal",
              "sinister",
              "hopeful",
              "surreal",
              "tender",
              "defiant",
              "dreamlike",
            ].map((word, i) => (
              <Skeleton
                key={word}
                className="h-7 rounded-none"
                style={
                  {
                    width: `${word.length * 8 + 24}px`,
                    animationDelay: `${i * 0.07}s`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        </div>

        {/* ── One secret ── */}
        <div className="flex flex-col gap-1 mt-2">
          <Skeleton className="h-3 w-48 ml-2 rounded-none" />
          <Skeleton className="h-8 w-full rounded-none" />
        </div>

        {/* ── Generate button ── */}
        <Skeleton className="h-10 w-full rounded-none" />
      </div>
    </div>
  );
}
