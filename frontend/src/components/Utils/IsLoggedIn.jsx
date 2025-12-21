import { getAccessToken } from "./getAccessToken";

export const isLoggedIn = () => {
  const token = getAccessToken;
  return Boolean(token && token.trim() !== "");
};