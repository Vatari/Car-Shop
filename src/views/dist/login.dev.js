"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginPage = loginPage;

var _litHtml = require("../../node_modules/lit-html/lit-html.js");

var _util = require("../util.js");

var userService = _interopRequireWildcard(require("../api/user.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject() {
  var data = _taggedTemplateLiteral([" <section id=\"login\">\n  <div class=\"container\">\n    <form @submit=", " id=\"login-form\" action=\"#\" method=\"post\">\n      <h1>Login</h1>\n      <p>Please enter your credentials.</p>\n      <hr />\n\n      <p>Username</p>\n      <input placeholder=\"Enter Username\" name=\"username\" type=\"text\" />\n\n      <p>Password</p>\n      <input type=\"password\" placeholder=\"Enter Password\" name=\"password\" />\n      <input type=\"submit\" class=\"registerbtn\" value=\"Login\" />\n    </form>\n    <div class=\"signin\">\n      <p>Dont have an account? <a href=\"/register\">Sign up</a>.</p>\n    </div>\n  </div>\n</section>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var loginTemplate = function loginTemplate(onLogin) {
  return (0, _litHtml.html)(_templateObject(), onLogin);
};

function loginPage(ctx) {
  ctx.render(loginTemplate((0, _util.createSubmitHandler)(ctx, onLogin)));
}

function onLogin(ctx, data, ev) {
  return regeneratorRuntime.async(function onLogin$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(userService.login(data.username, data.password));

        case 2:
          ev.target.reset();
          ctx.page.redirect("/");

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}