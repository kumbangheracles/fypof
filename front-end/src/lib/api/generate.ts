import { FormDataTypes } from "@/types/formData.type";
import { useToast } from "@/hooks/useToast";
import { Dispatch, SetStateAction } from "react";

export async function generateFiction(
  input: FormDataTypes,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal?: AbortSignal,
  setIsLoading?: Dispatch<SetStateAction<boolean>>,
): Promise<void> {
  let res: Response;
  const startTime = performance.now();

  try {
    setIsLoading?.(true);
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/fiction/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal,
      },
    );
  } catch (err: any) {
    if (err?.name === "AbortError") return;
    onError("Cannot connect to server. Is the backend running?");
    return;
  }

  if (!res.ok || !res.body) {
    onError(`Server error: ${res.status}`);
    return;
  }

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  let firstChunkLogged = false; // ← untuk cek TTFB

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += value;
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data: ")) continue;

        try {
          const json = JSON.parse(line.slice(6));

          if (json.text && !firstChunkLogged) {
            // waktu sampai chunk pertama muncul (TTFB)
            // console.log(
            //   `⚡ First chunk: ${(performance.now() - startTime).toFixed(0)}ms`,
            // );
            firstChunkLogged = true;
          }

          if (json.error) {
            onError(json.error);
            return;
          }
          if (json.done) {
            // total durasi stream selesai
            // console.log(
            //   `✅ Total duration: ${(performance.now() - startTime).toFixed(0)}ms`,
            // );
            onDone();
            return;
          }
          if (json.text) onChunk(json.text);
        } catch {
          // skip malformed SSE event
        }
      }
    }
  } catch (err: any) {
    if (err?.name !== "AbortError") onError("Stream interrupted unexpectedly.");
  } finally {
    reader.releaseLock();
    setIsLoading?.(false);
  }
}

export async function generateCover(formData: FormDataTypes): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fiction/generate-image`;
  console.log("Fetching:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Response bukan JSON:", text);
    throw new Error(`Server error ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error ?? "Gagal generate cover.");
  }

  return data.image;
}

export async function generateCoverWithText(
  formData: FormDataTypes,
  storyText: string,
): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/fiction/generate-image-text`;
  console.log("Fetching:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...formData, storyText }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Response bukan JSON:", text);
    throw new Error(`Server error ${res.status}`);
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error ?? "Gagal generate cover.");
  }

  return data.image;
}
