import { clearUserData, getAccessToken } from "../util.js";

const appId = "A00A5B4F-A9B5-8699-FFD6-B1FDFA0D8F00";
const apiKey = "6497A672-9CE3-4BA0-978C-1346660C63D5";

const host = `https://eu-api.backendless.com/${appId}/${apiKey}`;

async function request(method, url, data) {
  const options = {
    method,
    headers: {},
  };

  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const userData = JSON.parse(localStorage.getItem("userData"));

  
  if (userData !== null) {
    options.headers["user-token"] = getAccessToken();
  }

  try {
    const res = await fetch(host + url, options);

    if (res.ok == false) {
      if (res.status == 403) {
        clearUserData();
      }
      const error = await res.json();
      throw Error(error.message);
    }

    if (res.status == 204) {
      return res;
    } else {
      return await res.json();
    }
  } catch (err) {
    alert(err.message);
    throw err;
  }
}

export const get = request.bind(null, "get");
export const post = request.bind(null, "post");
export const put = request.bind(null, "put");
export const del = request.bind(null, "delete");
