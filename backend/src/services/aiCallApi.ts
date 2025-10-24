import axios from "axios";

export interface AiCallResponse {
  callId: string;
}

export async function invokeAiCall(
  to: string,
  scriptId: string,
  webhookUrl: string
): Promise<AiCallResponse> {
  try {
    const response = await axios.post<AiCallResponse>(
      "https://provider.com/api/v1/calls",
      { to, scriptId, webhookUrl }
    );
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("AI Call API error:", err.message);
    } else {
      console.error("AI Call API error:", err);
    }
    throw err;
  }
}
