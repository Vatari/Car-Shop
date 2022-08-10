import { html } from "../../node_modules/lit-html/lit-html.js";
import { createSubmitHandler } from "../util.js";
import * as userService from "../api/user.js";

const registerTemplate = (onRegister) => html`<section id="register">
  <div class="container">
    <form @submit=${onRegister} id="register-form">
      <h1>Register</h1>
      <p>Please fill in this form to create an account.</p>
      <hr />

      <p>Username</p>
      <input
        type="text"
        placeholder="Enter Username"
        name="username"
        required
      />

      <p>Password</p>
      <input
        type="password"
        placeholder="Enter Password"
        name="password"
        required
      />

      <p>Repeat Password</p>
      <input
        type="password"
        placeholder="Repeat Password"
        name="repeatPass"
        required
      />
      <hr />

      <input type="submit" class="registerbtn" value="Register" />
    </form>
    <div class="signin">
      <p>Already have an account? <a href="/login">Sign in</a>.</p>
    </div>
  </div>
</section>`;

export function registerPage(ctx) {
  ctx.render(registerTemplate(createSubmitHandler(ctx, onRegister)));
}
async function onRegister(ctx, data, ev) {
  if (data.username == "" || data.password == "") {
    return alert("All fields are required!");
  }
  if (data.password != data["repeatPass"]) {
    return alert("Passwords don't match!");
  }

  await userService.register(data.username, data.password);
  ev.target.reset();
  ctx.page.redirect("/");
}
