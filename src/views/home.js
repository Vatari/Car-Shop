import { html } from "../../node_modules/lit-html/lit-html.js";

const homeTemplate = () => html`
  <section id="main">
    <div id="welcome-container">
      <h1>Welcome To Car Shop</h1>
      <img class="hero" src="/images/car-png.webp" alt="carIntro" />
      <h2>To see all the cars click the link below:</h2>
      <div>
        <a href="/listings" class="button">All cars</a>
      </div>
    </div>
  </section>
`;

export async function homePage(ctx) {
  ctx.render(homeTemplate());
}
