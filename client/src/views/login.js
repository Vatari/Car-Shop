import { html } from "../../node_modules/lit-html/lit-html.js";
import { createSubmitHandler } from "../util.js";
import * as userService from "../api/user.js";
import { notify } from "./notify.js";

const loginTemplate = (onLogin) => html` <section id="login">
  <div class="container">
    <form @submit=${onLogin} id="login-form" action="#" method="post">
      <h1>Login</h1>
      <p>Please enter your credentials.</p>
      <hr />

      <p>Email</p>
      <input placeholder="Enter Email" name="username" type="text" />

      <p>Password</p>
      <input type="password" placeholder="Enter Password" name="password" />
      <input type="submit" class="registerbtn" value="Login" />
    </form>
    <div class="signin">
      <p>Dont have an account? <a href="/register">Sign up</a>.</p>
    </div>
  </div>
</section>`;

export function loginPage(ctx) {
  ctx.render(loginTemplate(createSubmitHandler(ctx, onLogin)));
}

async function onLogin(ctx, data, ev) {
  if (data.username == "" || data.password == "") {
    return notify("All fields are required!");
  }
  await userService.login(data.username, data.password);
  ev.target.reset();
  ctx.page.redirect("/");
}
