import { render, html } from "../../node_modules/lit-html/lit-html.js";

const navTemplate = (user) => html` <header>
  <nav>
    <a class="active" href="/">Home</a>
    <a href="/listings">All Listings</a>
    <a href="/search">By Year</a>
    ${user
      ? html`<div id="profile">
          <a>Welcome ${user.email}</a>
          <a href="/catalog">My Listings</a>
          <a href="/create">Create Listing</a>
          <a href="/logout">Logout</a>
        </div>`
      : html`<div id="guest">
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </div>`}

  </nav>
</header>`;
const header = document.querySelector(".nav-header");
const root = document.querySelector("#site-content");

function ctxRender(content) {
  render(content, root);
}

export function addRender(ctx, next) {
  render(navTemplate(ctx.user), header);
  ctx.render = ctxRender;

  next();
}
