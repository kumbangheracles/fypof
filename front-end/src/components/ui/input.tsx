import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      suppressHydrationWarning
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-none border text-gold-abyss hover:border-gold-abyss-end/70 focus:border-gold-abyss-end/70 border-gold-abyss/30 bg-transparent px-2.5 py-1 text-xs outline-none transition-all tracking-tighter focus:bg-gold-low/20 relative placeholder:absolute placeholder:left-0 placeholder:text-gold-abyss/50 placeholder:text-[12px] placeholder:px-2.5!",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
