import { html } from "../../node_modules/lit-html/lit-html.js";

import * as service from "../api/services.js";

const searchTemplate = (items, onSearch, year) => html` <section
  id="search-cars"
>
  <h1>Search car by year</h1>

  <div class="container">
    <input
      id="search-input"
      type="text"
      name="search"
      placeholder="Enter desired production year"
      .value=${year || ""}
    />
    <button @click=${onSearch} class="button-list">Search</button>
  </div>

  <h2>Results:</h2>
  <div class="listings">
    ${items.length == 0
      ? html` <p class="no-cars">No results.</p>`
      : items.map(carTemplate)}
  </div>
</section>`;

const carTemplate = (item) => html` <div class="listing">
  <div class="preview">
    <img src=${item.imageUrl} />
  </div>
  <h2>${item.brand} ${item.model}</h2>
  <div class="info">
    <div class="data-info">
      <h3>Year: ${item.year}</h3>
      <h3>Price: ${item.price} $</h3>
    </div>
    <div class="data-buttons">
      <a href="/details/${item.objectId}" class="button-carDetails">Details</a>
    </div>
  </div>
</div>`;

export async function searchPage(ctx) {
  const year = Number(ctx.querystring.split("=")[1]);
  ctx.render(searchTemplate([]), onSearch);
  const items = Number.isNaN(year) ? [] : await service.search(year);

  ctx.render(searchTemplate(items, onSearch, year));

  function onSearch(ev) {
    const query = Number(document.querySelector("#search-input").value);

    ctx.page.redirect(`/search?query=${query}`);
  }
}
