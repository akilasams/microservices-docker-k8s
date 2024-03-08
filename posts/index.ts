import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

interface Post {
  id: string;
  title: string;
}

interface Posts {
  [id: string]: Post;
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const posts: Posts = {} as Posts;

// Now handled by query service
// app.get("/posts", (req: Request, res: Response) => {
//   res.send(posts);
// });

app.post("/posts/create", async (req: Request, res: Response) => {
  const id: string = randomBytes(4).toString("hex");
  const { title }: { title: string } = req.body;

  posts[id] = {
    id,
    title,
  };

  await axios.post("http://event-bus-service:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req: Request<{}, {}, { type: string }>, res: Response) => {
  console.log("Received Event", req.body.type);
});

app.listen(4000, () => {
  console.log("Listening on 4000 using Cluster IPs");
});
