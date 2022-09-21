const express = require("express");
const mongoose = require("mongoose");

const ENV = require("dotenv");
ENV.config({ path: "../.env" });
const cors = require("./middlewares/cors");
const auth = require("./middlewares/auth");
const catalogController = require("./controllers/catalog");
const usersController = require("./controllers/users");
const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qfalkak.mongodb.net/cars`;

start();

async function start() {
  try {
    await mongoose.connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log("Database initialized");
  } catch (err) {
    console.log(err);
    console.error("Database connection failed");
    process.exit(1);
  }
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use(auth());
  app.use("/data/cars", catalogController);
  app.use("/users", usersController);

  app.listen(4000, () =>
    console.log("REST server started successfully on port 4000")
  );
}
