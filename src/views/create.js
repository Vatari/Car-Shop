import { html } from "../../node_modules/lit-html/lit-html.js";
import { createSubmitHandler } from "../util.js";
import * as service from "../api/services.js";

const createTemplate = (onCreate) => html` <section id="create-listing">
  <div class="container">
    <form @submit=${onCreate} id="create-form">
      <h1>Add car for sale</h1>
      <p>Please fill in this form</p>
      <hr />

      <p>Car Brand</p>
      <input type="text" placeholder="Enter Car Brand" name="brand" />

      <p>Car Model</p>
      <input type="text" placeholder="Enter Car Model" name="model" />

      <p>Description</p>
      <input type="text" placeholder="Enter Description" name="description" />

      <p>Car Year</p>
      <input type="number" placeholder="Enter Car Year" name="year" />

      <p>Car Image</p>
      <input type="text" placeholder="Enter Car Image" name="imageUrl" />

      <p>Car Price</p>
      <input type="number" placeholder="Enter Car Price" name="price" />

      <p>Phone</p>
      <input type="text" placeholder="Enter your phone" name="phone" />

      <hr />
      <input type="submit" class="registerbtn" value="Create Listing" />
    </form>
  </div>
</section>`;

export function createPage(ctx) {
  if (!ctx.user) {
    ctx.page.redirect("/login");
  }
  ctx.render(createTemplate(createSubmitHandler(ctx, onCreate)));
}

async function onCreate(ctx, item, ev) {
  if (Object.values(item).some((x) => x == "")) {
    return alert("All fields are required!");
  }
  if (item.year <= 0 && item.price <= 0) {
    return alert("Wrong year or price");
  }
  const data = {
    brand: item.brand,
    model: item.model,
    description: item.description,
    year: Number(item.year),
    imageUrl: item.imageUrl,
    price: Number(item.price),
    phone: item.phone,
  };
  await service.create(data);
  ev.target.reset();

  ctx.page.redirect("/listings");
}
