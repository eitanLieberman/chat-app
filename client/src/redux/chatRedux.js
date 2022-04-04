import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    selectedChat: null,
    chats: null,
    notifications: [],
    error: false,
  },
  reducers: {
    targetChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    loadChats: (state, action) => {
      state.chats = action.payload;
    },
    logoutChat: (state) => {
      state.selectedChat = null;
      state.chats = null;
      state.notifications = [];
    },
    backToContacts: (state) => {
      state.selectedChat = null;
    },
    newNotification: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const {
  targetChat,
  loadChats,
  logoutChat,
  backToContacts,
  newNotification,
} = chatSlice.actions;
console.log(chatSlice);
export default chatSlice.reducer;
