import { html, nothing } from "../../node_modules/lit-html/lit-html.js";
import * as service from "../api/services.js";

const detailsTemplate = (item, onDelete) => html`
  <section id="listing-details">
    <h1>Details</h1>
    <div class="details-info">
      <img src=${item.imageUrl} />
      <hr />
      <ul class="listing-props">
        <li><span>Brand:</span>${item.brand}</li>
        <li><span>Model:</span>${item.model}</li>
        <li><span>Year:</span>${item.year}</li>
        <li><span>Price:</span>${item.price}$</li>
        <li><span>Seller:</span>${item.phone}</li>

      </ul>

      <p class="description-para">${item.description}</p>
      ${item.isOwner
        ? html`<div class="listings-buttons">
            <a href="/edit/${item.objectId}" class="button-list">Edit</a>
            <a @click=${onDelete} href="javascript:void(0)" class="button-list"
              >Delete</a
            >
          </div>`
        : nothing}
    </div>
  </section>
`;

export async function detailsPage(ctx) {
  const itemId = ctx.params.objectId;
  const item = await service.getById(itemId);

  if (ctx.user) {
    item.isOwner = ctx.user.objectId == item.ownerId;
  }

  ctx.render(detailsTemplate(item, onDelete));

  async function onDelete() {
    const choice = confirm(
      `Are you sure to delete ${item.brand} ${item.model}?`
    );

    if (choice) {
      await service.deleteById(itemId);
      ctx.page.redirect("/listings");
    }
  }
}
