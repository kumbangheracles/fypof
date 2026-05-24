"use client";
import { cn } from "@/lib/utils";
import { Loader, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
interface Country {
  name: { common: string };
  flags: { svg: string };
  idd: { root?: string; suffixes?: string[] };
  cca2: string;
}
interface CountrySelectProps {
  value?: string;
  onChange?: (country: Country) => void;
  status?: "error" | "success" | "default" | "secondary";
  containerClassName?: string;
}

const AppCountrySelect = ({
  value,
  onChange,
  status,
  containerClassName,
}: CountrySelectProps) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState(value ?? "");
  const [isOpen, setIsOpen] = useState(false);
  //   const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedImg, setSelectedImage] = useState<string | null>(null);
  //   const isFloating = isFocused || isOpen || search.length > 0;

  const statusStyles = {
    success: { border: "border-[#50ff85]", label: "text-[#50ff85]" },
    error: { border: "border-[#FC5A5A]", label: "text-[#FC5A5A]" },
    default: { border: "border-[#50B5FF]", label: "text-[#50B5FF]" },
    secondary: { border: "border-[#E2E2EA]", label: "text-[#E2E2EA]" },
  };
  const { border, label: labelColor } = statusStyles[status ?? "default"];

  useEffect(() => {
    setIsLoading(true);
    fetch("https://restcountries.com/v3.1/all?fields=name,flags,idd,cca2")
      .then((r) => r.json())
      .then((data: Country[]) => {
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common)),
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        // setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (search.length === 0) {
      setSelectedImage(null);
    }
  }, [search]);

  const filtered = countries.filter((c) =>
    c.name.common.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (country: Country) => {
    setSearch(country.name.common);
    setIsOpen(false);
    onChange?.(country);
    setSelectedImage(country?.flags?.svg);
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", containerClassName)}>
      <div
        className={cn(
          "relative flex h-8 w-full items-center border border-gold-abyss-end/40! bg-background px-2.5 shadow-xs transition-all overflow-hidden",
          border,
        )}
      >
        <div className="flex items-center gap-2 overflow-hidden w-full">
          {selectedImg !== null ? (
            <img
              src={selectedImg}
              alt={"image-country"}
              className="h-4 w-6 object-cover"
            />
          ) : (
            <Search size={14} className="text-gold-abyss-end" />
          )}
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              // setIsFocused(true);
              setIsOpen(true);
            }}
            placeholder="Select Language"
            className="h-full w-full bg-background p-2 text-[12px] outline-none text-gold-abyss"
          />
        </div>

        <span
          className={cn(
            "pointer-events-none text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        >
          <svg
            width="10"
            height="7"
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.08698 0C9.50623 0 9.73932 0.484966 9.47741 0.812347L5.18439 6.17862C4.98423 6.42883 4.60368 6.42883 4.40352 6.17862L0.110499 0.812347C-0.151406 0.484965 0.0816813 0 0.500935 0L9.08698 0Z"
              fill="#B5B5BE"
            />
          </svg>
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 mt-1 w-full border border-border bg-background shadow-md"
          >
            {isLoading ? (
              <div className="p-3 text-center text-[13px] text-gray-400">
                <Loader className="mx-auto animate-spin" size={16} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-3 text-center text-[13px] text-gray-400">
                No country found
              </div>
            ) : (
              <ul className="max-h-52 custtom-scroll overflow-y-auto">
                {filtered.map((country) => (
                  <li
                    key={country.cca2}
                    onMouseDown={() => handleSelect(country)}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-[13px] hover:bg-gold-abyss/50"
                  >
                    <img
                      src={country.flags.svg}
                      alt={country.name.common}
                      className="h-4 w-6 object-cover"
                    />
                    {country.name.common}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppCountrySelect;
