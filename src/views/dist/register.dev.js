"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerPage = registerPage;

var _litHtml = require("../../node_modules/lit-html/lit-html.js");

var _util = require("../util.js");

var userService = _interopRequireWildcard(require("../api/user.js"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _templateObject() {
  var data = _taggedTemplateLiteral(["<section id=\"register\">\n  <div class=\"container\">\n    <form @submit=", " id=\"register-form\">\n      <h1>Register</h1>\n      <p>Please fill in this form to create an account.</p>\n      <hr />\n\n      <p>Username</p>\n      <input\n        type=\"text\"\n        placeholder=\"Enter Username\"\n        name=\"username\"\n        required\n      />\n\n      <p>Password</p>\n      <input\n        type=\"password\"\n        placeholder=\"Enter Password\"\n        name=\"password\"\n        required\n      />\n\n      <p>Repeat Password</p>\n      <input\n        type=\"password\"\n        placeholder=\"Repeat Password\"\n        name=\"repeatPass\"\n        required\n      />\n      <hr />\n\n      <input type=\"submit\" class=\"registerbtn\" value=\"Register\" />\n    </form>\n    <div class=\"signin\">\n      <p>Already have an account? <a href=\"/login\">Sign in</a>.</p>\n    </div>\n  </div>\n</section>"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var registerTemplate = function registerTemplate(onRegister) {
  return (0, _litHtml.html)(_templateObject(), onRegister);
};

function registerPage(ctx) {
  ctx.render(registerTemplate((0, _util.createSubmitHandler)(ctx, onRegister)));
}

function onRegister(ctx, data, ev) {
  return regeneratorRuntime.async(function onRegister$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(data.username == "" || data.password == "")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", alert("All fields are required!"));

        case 2:
          if (!(data.password != data["repeatPass"])) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", alert("Passwords don't match!"));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(userService.register(data.username, data.password));

        case 6:
          ev.target.reset();
          ctx.page.redirect("/");

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
}