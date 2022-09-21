import { setUserData, getAccessToken } from "../util.js";
import * as api from "./requester.js";

const endpoints = {
  login: "/users/login",
  register: "/users/register",
  logout: "/users/logout",
};

export async function login(username, password) {
  const result = await api.post(endpoints.login, { email: username, password });
  setUserData(result);
  return result;
}
export async function register(username, password) {
  const result = await api.post(endpoints.register, {
    email: username,
    password,
  });

  setUserData(result);
  return result;
}

export async function logout() {
  return fetch(endpoints.logout, {
    method: "GET",
    headers: {
      "accessToken": getAccessToken(),
    },
  });
}
