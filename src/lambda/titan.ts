import { ApiHandler } from "sst/node/api";

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({
  region: "us-east-1",
});

export const sendPrompt = async (prompt: string) => {
  const input: InvokeModelCommandInput = {
    body: JSON.stringify({
      inputText: prompt,
      textGenerationConfig: {
        maxTokenCount: 300,
        stopSequences: [],
        temperature: 0.5,
        topP: 0.9,
      },
    }),
    contentType: "application/json",
    modelId: "amazon.titan-text-lite-v1",
    accept: "application/json",
  };
  console.log(input);

  const command = new InvokeModelCommand(input);
  const response = await client.send(command);

  console.log("sendPrompt response", response.body);

  const parsed = JSON.parse(Buffer.from(response.body).toString());
  const result = {
    outputText: parsed.results[0].outputText,
    tokenCount: parsed.inputTextTokenCount,
    inputTextTokenCount: parsed.inputTextTokenCount,
  };

  /* 
    Bedrock Titan amazon.titan-text-lite-v1 response
  
   inputTextTokenCount: 13,
   results: [
     {
       tokenCount: 78,
       outputText: '\n' +
         'In the mines of code, we delve,\n' +
         'Digging deep into the digital night,\n' +
         'Crafting software with passion and might,\n' +
         'Our dwarven spirits never grow old.\n' +
         '\n' +
         'We toil in our underground halls,\n' +
         'With our axes and hammers at our side,\n' +
         'Bumping into each other with haste,\n' +
         'As we strive to make each line perfect.',
       completionReason: 'FINISH'
     }
   ]
 }
  
  */

  console.log("sendPrompt parsed", result);

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
