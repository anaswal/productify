import express from "express";
import { ENV } from "./config/env";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

const app = express();

app.use(cors({ origin: ENV.FRONTEND_URL }));
app.use(clerkMiddleware()); // auth obj will be attached to the req obj
app.use(express.json()); // parse JSON req body
app.use(express.urlencoded({ extended: true })); // parse from data (like HMTL forms)

app.get("/", (req, res) => {
  res.json({
    message:
      "Welcome to Productify API - Powered by Express, PostgreSQL, Drizzle ORM, Clerk Auth",
    endpoints: {
      users: "/api/users",
      products: "/api/products",
      comments: "/api/comments",
    },
  });
});

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
