import express from "express";
import "dotenv/config";
import cors from "cors";

async function boostrap() {
  const app = express();

  const port = process.env.PORT || 9632;

  app.use(express.json());
  app.use(cors());

  app.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`));
}

boostrap();
