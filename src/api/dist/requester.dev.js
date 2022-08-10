"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.del = exports.put = exports.post = exports.get = void 0;

var _util = require("../util.js");

var appId = "A00A5B4F-A9B5-8699-FFD6-B1FDFA0D8F00";
var apiKey = "6497A672-9CE3-4BA0-978C-1346660C63D5";
var host = "https://eu-api.backendless.com/".concat(appId, "/").concat(apiKey);

function request(method, url, data) {
  var options, userData, res, error;
  return regeneratorRuntime.async(function request$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          options = {
            method: method,
            headers: {}
          };

          if (data != undefined) {
            options.headers["Content-Type"] = "application/json";
            options.body = JSON.stringify(data);
          }

          userData = JSON.parse(localStorage.getItem("userData"));
          console.log(userData);

          if (!(userData != null)) {
            _context.next = 29;
            break;
          }

          options.headers["user-token"] = (0, _util.getAccessToken)();
          _context.prev = 6;
          _context.next = 9;
          return regeneratorRuntime.awrap(fetch(host + url, options));

        case 9:
          res = _context.sent;

          if (!(res.ok == false)) {
            _context.next = 16;
            break;
          }

          if (res.status == 403) {
            (0, _util.clearUserData)();
          }

          _context.next = 14;
          return regeneratorRuntime.awrap(res.json());

        case 14:
          error = _context.sent;
          throw Error(error.message);

        case 16:
          if (!(res.status == 204)) {
            _context.next = 20;
            break;
          }

          return _context.abrupt("return", res);

        case 20:
          _context.next = 22;
          return regeneratorRuntime.awrap(res.json());

        case 22:
          return _context.abrupt("return", _context.sent);

        case 23:
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](6);
          alert(_context.t0.message);
          throw _context.t0;

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 25]]);
}

var get = request.bind(null, "get");
exports.get = get;
var post = request.bind(null, "post");
exports.post = post;
var put = request.bind(null, "put");
exports.put = put;
var del = request.bind(null, "delete");
exports.del = del;