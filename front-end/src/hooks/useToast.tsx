"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CircleX, Info, X } from "lucide-react";

type Toast = {
  id: string;
  message: string;
  type?: "success" | "error" | "info";
};

type ToastContextType = {
  toast: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: Toast["type"] = "info") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={[
                "flex items-center justify-between gap-3 px-4 py-3 text-[12px] shadow-lg max-w-75 w-full",
                "backdrop-blur-md border",
                t.type === "success" &&
                  "bg-emerald-500/15 text-emerald-200 border-emerald-500/25",
                t.type === "error" &&
                  "bg-red-500/15 text-red-200 border-red-500/25",
                t.type === "info" &&
                  "bg-gold-abyss/30 text-gold-abyss-end border-gold-mid/20",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div className="flex items-center gap-5 w-full">
                {t.type === "info" && <Info size={37} />}
                {t.type === "success" && <Check size={37} />}
                {t.type === "error" && <CircleX size={37} />}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam ToastProvider");
  return ctx;
}
