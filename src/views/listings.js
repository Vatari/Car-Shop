import { html } from "../../node_modules/lit-html/lit-html.js";

import * as service from "../api/services.js";

const catalogTemplate = (items) => html`
  <section id="car-listings">
    <h1>Car Listings</h1>
    <div class="listings">
      ${items.length > 0
        ? items.map(cardTemplate)
        : html`<p class="no-cars">No cars in database.</p>`}
    </div>
  </section>
`;

const cardTemplate = (item) => html` <div class="listing">
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

export async function listingsPage(ctx) {
  const items = await service.getAll();
  ctx.render(catalogTemplate(items));
}
