import { html } from "../../node_modules/lit-html/lit-html.js";
import * as service from "../api/services.js";
import { createSubmitHandler } from "../util.js";

const editTemplate = (item, onEdit) => html`
  <section id="edit-listing">
    <div class="container">
      <form @submit=${onEdit} id="edit-form">
        <h1>Edit Car Listing</h1>
        <p>Please fill in this form to edit an listing.</p>
        <hr />

        <p>Car Brand</p>
        <input
          type="text"
          placeholder="Enter Car Brand"
          name="brand"
          .value=${item.brand}
        />

        <p>Car Model</p>
        <input
          type="text"
          placeholder="Enter Car Model"
          name="model"
          .value=${item.model}
        />

        <p>Description</p>
        <input
          type="text"
          placeholder="Enter Description"
          name="description"
          .value=${item.description}
        />

        <p>Car Year</p>
        <input
          type="number"
          placeholder="Enter Car Year"
          name="year"
          .value=${item.year}
        />

        <p>Car Image</p>
        <input
          type="text"
          placeholder="Enter Car Image"
          name="imageUrl"
          .value=${item.imageUrl}
        />

        <p>Car Price</p>
        <input
          type="number"
          placeholder="Enter Car Price"
          name="price"
          .value=${item.price}
        />

        <p>Phone</p>
        <input
          type="text"
          placeholder="enter phone number"
          name="phone"
          .value=${item.phone}
        />

        <hr />
        <input type="submit" class="registerbtn" value="Edit Listing" />
      </form>
    </div>
  </section>
`;

export async function editPage(ctx) {
  const itemId = ctx.params.id;
  const item = await service.getById(itemId);

  ctx.render(editTemplate(item, createSubmitHandler(ctx, onEdit)));
}

async function onEdit(ctx, item, ev) {
  const itemId = ctx.params.id;

  if (item.year <= 0 && item.price <= 0) {
    return alert("Wrong year or price");
  }

  if (Object.values(item).some((x) => x == "")) {
    return alert("All fields are required!");
  }
  await service.edit(itemId, {
    brand: item.brand,
    model: item.model,
    description: item.description,
    year: Number(item.year),
    imageUrl: item.imageUrl,
    price: Number(item.price),
    phone: item.phone,
  });
  ev.target.reset();

  ctx.page.redirect(`/details/${itemId}`);
}
