import Spinner from "@/components/Spinner";
import {
  fetchPromptResponse,
  setLatestPrompt,
  setModel,
} from "@/redux/chatSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCount } from "../redux/counterSlice";

const PromptForm = () => {
  const dispatch = useAppDispatch();
  // const { selectedModel } = useAppSelector(state => state.chat);

  const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!evt.currentTarget.prompt.value) return;

    const prompt = evt.currentTarget.prompt.value;
    dispatch(setLatestPrompt(prompt));
    dispatch(fetchPromptResponse(prompt));
    evt.currentTarget.prompt.value = "";
  };

  return (
    <div className="basic-box">
      <form className="flex" onClick={evt => handleSubmit(evt)}>
        <textarea
          name="prompt"
          className="text-input mr-2 flex-grow"
          placeholder="Type your prompt here"
        />
        <input type="submit" value="Send" className="btn" />
      </form>
    </div>
  );
};

const ChatView = () => {
  const chat = useAppSelector(state => state.chat.chatItems);
  const { loading, error, latestPrompt } = useAppSelector(state => state.chat);

  return (
    <div className="basic-box">
      <div>Chat</div>
      <div className="mt-2">
        {chat.map((item, index) => (
          <div key={index}>
            <div className="pill-user">User({index})</div>
            <div className="prompt-user">{item.prompt}</div>
            <div className="pill-bot">{item.model || "Bot"}</div>
            <div className="response-bot font-extralight">{item.response}</div>
          </div>
        ))}

        {loading && (
          <>
            <div className="pill-user">User(...)</div>
            <div className="prompt-user">{latestPrompt}</div>
            <div className="pill-bot">Bot</div>
            <div>
              <Spinner />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const ModelSelect = () => {
  const dispatch = useAppDispatch();
  const { models, selectedModel } = useAppSelector(state => state.chat);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const modelValue = event.target.value as string;
    console.log(modelValue);
    dispatch(setModel(modelValue));
  };

  return (
    <div className="basic-box">
      Select a model [current:{" "}
      {models.find(model => model.name === selectedModel)?.title}]
      <select
        className="select-box"
        name="model"
        id="model"
        onChange={e => handleChange(e)}
        defaultValue={selectedModel}
      >
        {models.map(model => (
          <option key={model.name} value={model.name}>
            {model.title}
          </option>
        ))}
      </select>
    </div>
  );
};

const ChatPage = () => {
  return (
    <div className="mx-auto max-w-full p-2 md:p-10 ">
      <ChatView />
      <PromptForm />
      <ModelSelect />
    </div>
  );
};

export default ChatPage;
