// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type QuestionsThreadResponse = {
  thread: { prompt: string; response: string }[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QuestionsThreadResponse>
) {
  if (req.method !== "POST") res.status(404).end();
  try {
    const apiUrl = process.env.API_URL as string;
    console.log("req.body", req.body);
    const { prompt } = JSON.parse(req.body);

    const results = await fetch(apiUrl + "/prompt", {
      method: "POST",
      body: JSON.stringify({ prompt }),
      headers: { "Content-Type": "application/json" },
    });

    const json = await results.json();

    console.log("json", json, results.status, results.statusText);

    console.log("prompt", prompt);

    // const response = "In the mines of code, we delve";

    res.status(200).json({
      thread: [
        {
          prompt,
          response: json.outputText,
        },
      ],
    });
  } catch (error) {
    console.log("next api titan error", error);
    res.status(500).end();
  }
}
