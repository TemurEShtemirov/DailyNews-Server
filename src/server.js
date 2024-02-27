import express from "express";
import "dotenv/config";
import cors from "cors";
import sequelize from "./config/db.config.js";
import postRouter from "./routes/_api.post.router.js";
import userRouter from "./routes/_api.user.router.js";

async function boostrap() {
  const app = express();

  const port = process.env.PORT || 9632;

  app.use(express.json());
  app.use(cors());

  //routes

  app.use("/post", postRouter);
  app.use("/user", userRouter);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  app.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`));
}

boostrap();
