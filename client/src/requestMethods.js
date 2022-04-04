import axios from "axios";
import { useSelector } from "react-redux";
import { loginFailure } from "./redux/userRedux";

const BASE_URL = "http://localhost:3000/api";

// const Token =
//   JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser
//     ?.accessToken || null;

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const Token = currentUser?.accessToken;

export const publicRequest = axios.create({ baseURL: BASE_URL });

// export const userRequest = axios.create({
//   baseURL: BASE_URL,
//   headers: { token: `Bearer ${Token}` },
// });
