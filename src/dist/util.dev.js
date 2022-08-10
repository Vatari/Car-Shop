"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getuserData = getuserData;
exports.getAccessToken = getAccessToken;
exports.clearUserData = clearUserData;
exports.setUserData = setUserData;
exports.createSubmitHandler = createSubmitHandler;
exports.parseQueryString = parseQueryString;

function getuserData() {
  return JSON.parse(localStorage.getItem("userData"));
}

function getAccessToken() {
  var user = getuserData();

  if (user) {
    return user["user-token"];
  } else {
    return null;
  }
}

function clearUserData() {
  localStorage.removeItem("userData");
}

function setUserData(data) {
  localStorage.setItem("userData", JSON.stringify(data));
}

function createSubmitHandler(ctx, handler) {
  return function (ev) {
    ev.preventDefault();
    var formData = Object.fromEntries(new FormData(ev.target));
    handler(ctx, formData, ev);
  };
}

function parseQueryString() {
  var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  return Object.fromEntries(query.split("&").map(function (kvp) {
    return kvp.split("=");
  }));
}