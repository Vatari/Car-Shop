const { chromium } = require("playwright-chromium");
const { expect } = require("chai");

const host = "http://localhost:3000"; // Application host (NOT service host - that can be anything)

const interval = 300;
const DEBUG = false;
const slowMo = 500;

const mockData = require("./mock-data.json");
const endpoints = {
  register: "/users/register",
  login: "/users/login",
  logout: "/users/logout",
  catalog: "/data/cars?sortBy=createdOn%20desc",
  create: "/data/cars",
  details: (id) => `/data/cars/${id}`,
  delete: (id) => `/data/cars/${id}`,
  profile: (id) => `/data/cars?where=ownerId%3D'${id}'&sortBy=createdOn%20desc`,
  search: (query) => `/data/cars?where=year%3D${query}`,
};

let browser;
let context;
let page;

describe("E2E tests", function () {
  // Setup
  this.timeout(DEBUG ? 120000 : 6000);
  before(
    async () =>
      (browser = await chromium.launch(
        DEBUG ? { headless: false, slowMo } : {}
      ))
  );
  after(async () => await browser.close());
  beforeEach(async () => {
    context = await browser.newContext();
    setupContext(context);
    page = await context.newPage();
  });
  afterEach(async () => {
    await page.close();
    await context.close();
  });

  // Test proper
  describe("Authentication", () => {
    it("register does not work with empty fields", async () => {
      const { post } = await handle(endpoints.register);
      const isCalled = post().isHandled;

      await page.goto(host);
      await page.waitForTimeout(interval);
      await page.click("text=Register");

      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      await page.click('[type="submit"]');

      await page.waitForTimeout(interval);

      expect(isCalled()).to.be.false;
    });

    it("register makes correct API call", async () => {
      const data = mockData.users[0];
      const { post } = await handle(endpoints.register);
      const { onRequest } = post(data);

      await page.goto(host);
      await page.waitForTimeout(interval);
      await page.click("text=Register");

      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      await page.fill('[name="username"]', data.username);
      await page.fill('[name="password"]', data.password);
      await page.fill('[name="repeatPass"]', data.password);

      const [request] = await Promise.all([
        onRequest(),
        page.click('[type="submit"]'),
      ]);

      const postData = JSON.parse(request.postData());

      expect(postData.email).to.equal(data.username);
      expect(postData.password).to.equal(data.password);
    });

    it("login makes correct API call", async () => {
      const data = mockData.users[0];
      const { post } = await handle(endpoints.login);
      const { onRequest } = post(data);

      await page.goto(host);
      await page.waitForTimeout(interval);
      await page.click("text=Login");

      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      await page.fill('[name="username"]', data.username);
      await page.fill('[name="password"]', data.password);

      const [request] = await Promise.all([
        onRequest(),
        page.click('[type="submit"]'),
      ]);

      const postData = JSON.parse(request.postData());
      expect(postData.login).to.equal(data.username);
      expect(postData.password).to.equal(data.password);
    });

    it("logout makes correct API call", async () => {
      const data = mockData.users[0];
      const { post } = await handle(endpoints.login);
      const { get } = await handle(endpoints.logout);
      const { onResponse } = post(data);
      const { onRequest } = get("", { json: false, status: 204 });

      await page.goto(host);
      await page.click("text=Login");
      await page.waitForTimeout(interval);
      await page.waitForSelector("form");
      await page.fill('[name="username"]', data.username);
      await page.fill('[name="password"]', data.password);

      await Promise.all([onResponse(), page.click('[type="submit"]')]);

      await page.waitForTimeout(interval);

      const [request] = await Promise.all([
        onRequest(),
        page.click("nav >> text=Logout"),
      ]);
      const token = request.headers()["user-token"];
      expect(request.method()).to.equal("GET");
      expect(token).to.equal(data["user-token"]);
    });
  });

  describe("Navigation bar", () => {
    it("logged user should see correct navigation", async () => {
      // Login user
      const data = mockData.users[0];
      await page.goto(host);
      await page.waitForTimeout(interval);
      await page.click("text=Login");
      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      await page.fill('[name="username"]', data.username);
      await page.fill('[name="password"]', data.password);

      await page.click('[type="submit"]');

      //Test for navigation
      await page.waitForTimeout(interval);

      expect(await page.isVisible("nav >> text=All cars")).to.be.true;
      expect(await page.isVisible("nav >> text=Search by year")).to.be.true;
      expect(await page.isVisible("nav >> text=My cars")).to.be.true;
      expect(await page.isVisible("nav >> text=Add car")).to.be.true;
      expect(await page.isVisible("nav >> text=Logout")).to.be.true;

      expect(await page.isVisible("nav >> text=Login")).to.be.false;
      expect(await page.isVisible("nav >> text=Register")).to.be.false;
    });

    it("guest user should see correct navigation", async () => {
      await page.goto(host);
      await page.waitForTimeout(interval);

      expect(await page.isVisible("nav >> text=All cars")).to.be.true;
      expect(await page.isVisible("nav >> text=Search by Year")).to.be.true;
      expect(await page.isVisible("nav >> text=Login")).to.be.true;
      expect(await page.isVisible("nav >> text=Register")).to.be.true;

      expect(await page.isVisible("nav >> text=Welcome")).to.be.false;
      expect(await page.isVisible("nav >> text=My cars")).to.be.false;
      expect(await page.isVisible("nav >> text=Add car")).to.be.false;
      expect(await page.isVisible("nav >> text=Logout")).to.be.false;
    });
  });

  describe("Catalog", () => {
    it("loads static home page", async () => {
      await page.goto(host);
      await page.waitForTimeout(interval);

      await page.waitForSelector("text=Welcome To Car Shop");

      expect(
        await page.isVisible("text=To see all the cars click the link below")
      ).to.be.true;
      expect(await page.isVisible("#welcome-container >> text=All cars")).to.be
        .true;
    });
  });

  describe("CRUD", () => {
    // Login user
    beforeEach(async () => {
      const data = mockData.users[0];
      await page.goto(host);
      await page.waitForTimeout(interval);
      await page.click("text=Login");
      await page.waitForTimeout(interval);
      await page.waitForSelector("form");
      await page.fill('[name="username"]', data.username);
      await page.fill('[name="password"]', data.password);
      await page.click('[type="submit"]');
      await page.waitForTimeout(interval);
    });

    it("create does NOT work with empty fields", async () => {
      const { post } = await handle(endpoints.create);
      const isCalled = post().isHandled;

      await page.click('text="Add car"');
      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      page.click('[type="submit"]');

      await page.waitForTimeout(interval);

      expect(isCalled()).to.be.false;
    });

    it("create makes correct API call for logged in user", async () => {
      const data = mockData.catalog[0];
      const { post } = await handle(endpoints.create);
      const { onRequest } = post();

      await page.click('text="Add car"');
      await page.waitForTimeout(interval);
      await page.waitForSelector("form");

      await page.fill('[name="brand"]', data.brand);
      await page.fill('[name="model"]', data.model);
      await page.fill('[name="description"]', data.description);
      await page.fill('[name="year"]', data.year.toString());
      await page.fill('[name="imageUrl"]', data.imageUrl);
      await page.fill('[name="price"]', data.price.toString());
      await page.fill('[name="phone"]', data.phone);

      const [request] = await Promise.all([
        onRequest(),
        page.click('[type="submit"]'),
      ]);

      const postData = JSON.parse(request.postData());

      expect(postData.brand).to.equal(data.brand);
      expect(postData.model).to.equal(data.model);
      expect(postData.description).to.equal(data.description);
      expect(postData.year).to.equal(data.year);
      expect(postData.imageUrl).to.equal(data.imageUrl);
      expect(postData.price).to.equal(data.price);
      expect(postData.phone).to.equal(data.phone);
    });
  });

  describe("Search Page", async () => {
    it("show no matches", async () => {
      await handle(endpoints.search("2010"), { get: [] });

      await page.goto(host);
      await page.waitForTimeout(interval);

      await page.click("text=By Year");
      await page.waitForTimeout(interval);

      await page.fill("#search-input", "2010");
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(interval);

      const matches = await page.$$eval(".listing h2", (t) =>
        t.map((s) => s.textContent)
      );

      expect(matches.length).to.be.equal(0);
    });

    it("show results", async () => {
      await handle(endpoints.search("2010"), {
        get: mockData.catalog.slice(0, 2),
      });

      await page.goto(host);
      await page.waitForTimeout(interval);

      await page.click("text=By Year");
      await page.waitForTimeout(interval);

      await page.fill("#search-input", "2010");
      await page.click('button:has-text("Search")');
      await page.waitForTimeout(interval);

      const matches = await page.$$eval(".listing h2", (t) =>
        t.map((s) => s.textContent)
      );

      expect(matches.length).to.equal(2);
      expect(matches[0]).to.contains("brand1 model1");
      expect(matches[1]).to.contains("brand2 model2");
    });
  });
});

async function setupContext(context) {
  // Authentication
  await handleContext(context, endpoints.login, { post: mockData.users[0] });
  await handleContext(context, endpoints.register, { post: mockData.users[0] });
  await handleContext(context, endpoints.logout, {
    get: (h) => h("", { json: false, status: 204 }),
  });

  // Catalog and Details
  await handleContext(context, endpoints.catalog, { get: mockData.catalog });
  await handleContext(context, endpoints.details("1001"), {
    get: mockData.catalog[0],
  });
  await handleContext(context, endpoints.details("1002"), {
    get: mockData.catalog[1],
  });
  await handleContext(context, endpoints.details("1003"), {
    get: mockData.catalog[2],
  });

  // Profile Page
  await handleContext(context, endpoints.profile("0001"), {
    get: mockData.catalog.slice(0, 2),
  });

  // Block external calls
  await context.route(
    (url) => url.href.slice(0, host.length) != host,
    (route) => {
      if (DEBUG) {
        console.log("Preventing external call to " + route.request().url());
      }
      route.abort();
    }
  );
}

function handle(match, handlers) {
  return handleRaw.call(page, match, handlers);
}

function handleContext(context, match, handlers) {
  return handleRaw.call(context, match, handlers);
}

async function handleRaw(match, handlers) {
  const methodHandlers = {};
  const result = {
    get: (returns, options) => request("GET", returns, options),
    post: (returns, options) => request("POST", returns, options),
    put: (returns, options) => request("PUT", returns, options),
    patch: (returns, options) => request("PATCH", returns, options),
    del: (returns, options) => request("DELETE", returns, options),
    delete: (returns, options) => request("DELETE", returns, options),
  };

  const context = this;

  await context.route(urlPredicate, (route, request) => {
    if (DEBUG) {
      console.log(">>>", request.method(), request.url());
    }

    const handler = methodHandlers[request.method().toLowerCase()];
    if (handler == undefined) {
      route.continue();
    } else {
      handler(route, request);
    }
  });

  if (handlers) {
    for (let method in handlers) {
      if (typeof handlers[method] == "function") {
        handlers[method](result[method]);
      } else {
        result[method](handlers[method]);
      }
    }
  }

  return result;

  function request(method, returns, options) {
    let handled = false;

    methodHandlers[method.toLowerCase()] = (route, request) => {
      handled = true;
      route.fulfill(respond(returns, options));
    };

    return {
      onRequest: () => context.waitForRequest(urlPredicate),
      onResponse: () => context.waitForResponse(urlPredicate),
      isHandled: () => handled,
    };
  }

  function urlPredicate(current) {
    if (current instanceof URL) {
      return current.href.toLowerCase().includes(match.toLowerCase());
    } else {
      return current.url().toLowerCase().includes(match.toLowerCase());
    }
  }
}

function respond(data, options = {}) {
  options = Object.assign(
    {
      json: true,
      status: 200,
    },
    options
  );

  const headers = {
    "Access-Control-Allow-Origin": "*",
  };
  if (options.json) {
    headers["Content-Type"] = "application/json";
    data = JSON.stringify(data);
  }

  return {
    status: options.status,
    headers,
    body: data,
  };
}
