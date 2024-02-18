import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type ChatItem = {
  prompt: string;
  response?: string;
  model?: string;
};

export interface ChatState {
  chatItems: ChatItem[];
  loading: boolean;
  error: string | null;
  latestPrompt?: string;
  selectedModel: string;
  models: { title: string; name: string }[];
}

const initialState: ChatState = {
  chatItems: [],
  loading: false,
  error: null,
  latestPrompt: "",
  selectedModel: "llama",
  models: [
    { title: "Meta Llama", name: "llama" },
    { title: "AWS Bedrock Titan", name: "titan" },
  ],
};

export const fetchPromptResponse = createAsyncThunk(
  "chat/fetchPromptResponse",
  async (prompt: string, thunkAPI) => {
    const state = thunkAPI.getState() as { chat: ChatState };
    const { selectedModel } = state.chat;
    const response = await fetch("/api/call-model", {
      method: "POST",
      body: JSON.stringify({ prompt, selectedModel }),
    });
    const json = await response.json();
    return [
      {
        response: json.response as string,
        prompt: prompt,
        model: selectedModel,
      },
    ];
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLatestPrompt: (state, action) => {
      state.latestPrompt = action.payload;
    },
    setModel: (state, action) => {
      state.selectedModel = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchPromptResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.chatItems.push(...action.payload);
      })
      .addCase(fetchPromptResponse.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPromptResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message as string;
      });
  },
});

export default chatSlice.reducer;

export const { setLatestPrompt, setModel } = chatSlice.actions;
