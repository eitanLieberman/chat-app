import axios from "axios";
import { publicRequest } from "../requestMethods";
import { targetChat, loadChats, logoutChat } from "./chatRedux";
import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";

export const register = async (dispatch, user) => {
  await publicRequest.post("/auth/register", user);
};

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);

    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
    throw "wrong username or password";
  }
};

export const logoutUser = async (dispatch, user) => {
  dispatch(logoutChat());
  dispatch(logout());
};
export const startChat = async (dispatch, userId, token) => {
  const config = {
    headers: { token: `Bearer ${token}` },
  };
  const res = await axios.post("/api/chats", { userId }, config);

  dispatch(targetChat(res.data));
};

export const startChatGroup = async (dispatch, { users, name }, user) => {
  const config = {
    headers: { token: `Bearer ${user.accessToken}` },
  };
  const res = await axios.post(
    "/chats/group",
    {
      users: JSON.stringify(users),
      name,
    },
    config
  );

  dispatch(targetChat(res.data));
};

export const getChats = async (dispatch, token) => {
  const config = {
    headers: { token: `Bearer ${token}` },
  };
  const res = await axios.get("/api/chats", config);

  dispatch(loadChats(res.data));
};

export const renameChat = async (
  dispatch,
  { selectedChat, groupChatName },
  token
) => {
  const config = {
    headers: { token: `Bearer ${token}` },
  };
  const { data } = await axios.put(
    `/api/chats/rename`,
    {
      oldName: selectedChat.chatName,
      chatId: selectedChat._id,
      chatName: groupChatName,
    },
    config
  );

  await dispatch(targetChat(data));
};
