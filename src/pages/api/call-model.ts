import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ response: string; model: string }>
) {
  if (req.method !== "POST") res.status(404).end();
  const { prompt, selectedModel } = JSON.parse(req.body);
  try {
    const apiUrl = process.env.API_URL as string;
    console.log("req.body", req.body);

    const url = path.join(apiUrl, selectedModel);
    const results = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await results.json();

    console.log("prompt", prompt);
    console.log("json", json, results.status, results.statusText);

    res.status(200).json({
      response: json.outputText,
      model: selectedModel,
    });
  } catch (error) {
    console.log(`call-model [${selectedModel}] error`, error);
    res.status(500).end();
  }
}
