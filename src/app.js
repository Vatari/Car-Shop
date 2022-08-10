import page from "../node_modules/page/page.mjs";

import { addSession } from "./middlewares/session.js";
import { addRender } from "./middlewares/render.js";

import { catalogPage } from "./views/catalog.js";
import { createPage } from "./views/create.js";
import { detailsPage } from "./views/details.js";
import { editPage } from "./views/edit.js";
import { homePage } from "./views/home.js";
import { loginPage } from "./views/login.js";
import { registerPage } from "./views/register.js";

import * as api from "./api/user.js";
import { listingsPage } from "./views/listings.js";
import { searchPage } from "./views/search.js";
import { clearUserData } from "./util.js";

page(addSession);

page(addRender);

page("/", homePage);
page("/catalog", catalogPage);
page("/listings", listingsPage);
page("/login", loginPage);
page("/register", registerPage);
page("/create", createPage);
page("/details/:objectId", detailsPage);
page("/edit/:objectId", editPage);
page("/search", searchPage);
page("/logout", onLogout);

page.start();

function onLogout(ctx) {
  api.logout();
  clearUserData();
  ctx.page.redirect("/");
}
