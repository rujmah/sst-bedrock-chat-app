import Image from "next/image";
import { Inter } from "next/font/google";
import { FormEvent, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [responses, setResponses] = useState<
    { question: string; response?: string }[]
  >([]);

  const handleQuestion = (e: FormEvent) => {
    e.preventDefault();
    console.log("question", currentQuestion);
    if (!currentQuestion) return;
    setResponses(prev => [
      ...prev,
      { question: currentQuestion, response: "dunno" },
    ]);
    setCurrentQuestion("");
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        top
      </div>

      <div className="relative flex place-items-center ">
        <div className="title">
          <h1>Let&rsquo;s talk to Bedrock!</h1>
          <form
            className="w-full max-w-sm"
            id="questionForm"
            onSubmit={e => handleQuestion(e)}
          >
            <div className="flex items-center border-b border-teal-500 py-2">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
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
            </div>
          </form>
          <div className="bg-gray-200 rounded-lg box-border w-max h-max border-gray-400 border-2 p-4">
            <dl>
              {responses?.map(({ question, response }, i) => (
                <div key={i}>
                  <dt>{question}</dt>
                  <dd className="text-right box-border border-1 border-gray-700 text-sm text-blue-500">
                    Assistant:
                  </dd>
                  <dd className="text-right">{response}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        Footer
      </div>
    </main>
  );
}
