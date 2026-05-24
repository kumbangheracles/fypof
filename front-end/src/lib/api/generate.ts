import { FormDataTypes } from "@/types/formData.type";
import { axiosInstance } from "../axiosInstance";

export async function generateFiction(
  input: FormDataTypes,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (msg: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  let res: Response;

  try {
    res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/fiction/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        signal,
      },
    );

    // const resData = await res.json();

    // console.log("Response: ", resData);
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

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += value;

      // SSE events dipisahkan double newline
      const parts = buffer.split("\n\n");
      buffer = parts.pop() ?? "";

      for (const part of parts) {
        const line = part.trim();
        if (!line.startsWith("data: ")) continue;

        try {
          const json = JSON.parse(line.slice(6));
          if (json.error) {
            onError(json.error);
            return;
          }
          if (json.done) {
            onDone();
            return;
          }
          if (json.text) {
            onChunk(json.text);
          }
        } catch {
          // skip malformed SSE event
        }
      }
    }
  } catch (err: any) {
    if (err?.name !== "AbortError") onError("Stream interrupted unexpectedly.");
  } finally {
    reader.releaseLock();
  }
}
