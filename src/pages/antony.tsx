import React, { useState } from "react";

type QuestionChainResponse = {
  prompt: string;
  response?: string | undefined;
};

const User = (props: { prompt: string }) => {
  const { prompt } = props;
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-10 w-10 text-justify rounded bg-gray-300">
        User
      </div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{prompt}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>
    </div>
  );
};

const Assistant = (props: { response: string }) => {
  const { response } = props;
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
      <div>
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{response}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>

      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">FM</div>
    </div>
  );
};

const Chat = (props: { responses: QuestionChainResponse[] }) => {
  const { responses } = props;
  return (
    <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">
      {responses?.map(({ prompt, response }, i) => (
        <div key={i}>
          <User prompt={prompt} />
          <Assistant response={response as string} />
        </div>
      ))}
    </div>
  );
};

const Antony = () => {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [responses, setResponses] = useState<QuestionChainResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const handleQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQuestion) return;

    const controller = new AbortController();
    setLoading(true);

    fetch("/api/titan", {
      method: "POST",
      signal: controller.signal,
      body: JSON.stringify({ prompt: currentQuestion }),
    })
      .then(res => res.json())
      .then(data => {
        setResponses(data.thread);
        setLoading(false);
        setCurrentQuestion("");
      })
      .catch(err => {
        controller.abort();
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <Chat responses={responses} />

        <div className="bg-gray-300 p-4">
          <form id="chatForm" onSubmit={e => handleQuestion(e)}>
            <input
              className="flex items-center h-10 w-full rounded px-3 text-sm"
              type="text"
              placeholder="What's your question?"
              aria-label="Your Question"
              onChange={e => setCurrentQuestion(e.target.value)}
              value={currentQuestion}
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Ask
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Antony;
