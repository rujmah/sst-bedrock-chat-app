import { ApiHandler } from "sst/node/api";

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

const modelId = "meta.llama2-13b-chat-v1";

/* 
{
 "modelId": "meta.llama2-13b-chat-v1",
 "contentType": "application/json",
 "accept": "application/json",
 "body": "{\"prompt\":\"this is where you place your input text\",\"max_gen_len\":512,\"temperature\":0.5,\"top_p\":0.9}"
}
*/

export const sendPrompt = async (prompt: string) => {
  const input: InvokeModelCommandInput = {
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify({
      prompt,
      max_gen_len: 300,
      temperature: 0.5,
      top_p: 0.9,
    }),
  };
  console.log(input);

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);

  console.log("sendPrompt response", response.body);

  const parsed = JSON.parse(Buffer.from(response.body).toString());
  const result = {
    outputText: parsed.generation,
  };

  /* 
    Meta Llama meta.llama2-70b-chat-v1 response
  
  {
    generation: '\n' +
     '\n' +
     'Answer: There are several delis in Acton that are highly rated by locals and visitors. Here are a few options to consider:\n' +
     '\n' +
     '1. Acton Deli: Located in the heart of Acton, this deli has been serving the community for over 20 years. They offer a wide selection of sandwiches, salads, and soups, as well as a variety of meats, cheeses, and condiments.\n' +
     '2. The Deli at Acton Market: This deli is located inside the Acton Market, a local grocery store that sells fresh produce, meats, and other household items. The deli offers a variety of sandwiches, wraps, and salads, as well as a daily soup special.\n' +
     '3. The Sandwich Board: This deli is known for its creative sandwiches and friendly service. They offer a variety of options, including vegetarian and gluten-free choices. They also have a daily special that changes regularly.\n' +
     '4. The Village Deli: Located in the center of Acton, this deli has been a local favorite for over 10 years. They offer a wide selection of sandwiches, salads, and soups, as well as a variety of meats, cheeses, and condiments.\n' +
     '5. The Depot Deli: Located in the historic Acton Depot building, this deli offers a variety of sandwiches, salads, and soups, as well as a selection of baked goods and snacks. They also have a cozy atmosphere and outdoor seating.\n' +
     '\n' +
     "All of these delis are highly rated by locals and visitors, so you can't go wrong with any of them!",
    prompt_token_count: 12,
    generation_token_count: 369,
    stop_reason: 'stop'
  }
 
  
  */

  return result;
};

export const handler = ApiHandler(async evt => {
  try {
    const { prompt } = JSON.parse(evt.body);
    console.log("ApiHandler prompt", prompt);
    const response = await sendPrompt(prompt);

    console.log("ApiHandler response", response);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.log("ApiHandler error", error);
    return {
      statusCode: 500,
      body: error,
    };
  }
});
