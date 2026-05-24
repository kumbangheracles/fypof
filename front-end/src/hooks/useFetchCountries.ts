import { useEffect, useState } from "react";

interface Country {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

const useFetchCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flags",
        );
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data: Country[] = await res.json();
        setCountries(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch countries",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, isLoading, error };
};

export default useFetchCountries;
