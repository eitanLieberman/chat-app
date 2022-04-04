import axios from "axios";
import { publicRequest, userRequest } from "../requestMethods";
import { targetChat, loadChats, logoutChat } from "./chatRedux";
import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";

export const register = async (dispatch, user) => {
  console.log(user);
  const res = await publicRequest.post("/auth/register", user);
};

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    console.log(res);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    dispatch(loginFailure());
  }
};

export const logoutUser = async (dispatch, user) => {
  dispatch(logoutChat());
  dispatch(logout());
};
export const startChat = async (dispatch, userId, token) => {
  console.log(userId);
  const config = {
    headers: { token: `Bearer ${token}` },
  };
  const res = await axios.post("/api/chats", { userId }, config);
  console.log(res);
  dispatch(targetChat(res.data));
};

export const startChatGroup = async (dispatch, { users, name }, user) => {
  console.log(users, name);
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
  console.log(res);
  dispatch(targetChat(res.data));
};

export const getChats = async (dispatch, token) => {
  const config = {
    headers: { token: `Bearer ${token}` },
  };
  const res = await axios.get("/api/chats", config);
  console.log(res);
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
  console.log(data);
  await dispatch(targetChat(data));
};
