import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface Posts {
  [id: string]: {
    id: string;
    title: string;
    comments: Array<Comment>;
  };
}

interface PostCreatedEventData {
  id: string;
  title: string;
}

interface CommentEventData {
  id: string;
  content: string;
  postId: string;
  status: "pending" | "approved" | "rejected";
}

type EventData = PostCreatedEventData | CommentEventData;

type EventType = "PostCreated" | "CommentCreated" | "CommentUpdated";

const posts = {} as Posts;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const handleEvent = (type: EventType, data: EventData) => {
  if (type === "PostCreated" && "title" in data) {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === "CommentCreated" && "content" in data) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === "CommentUpdated" && "content" in data) {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);

    if (comment) {
      comment.status = status;
      comment.content = content;
    }
  }
};

app.get("/posts", (req: Request, res: Response) => {
  res.send(posts);
});

app.post(
  "/events",
  (
    req: Request<{}, {}, { type: EventType; data: EventData }>,
    res: Response
  ) => {
    const { type, data } = req.body;
    handleEvent(type, data);
    res.send({});
  }
);

app.listen(4002, async () => {
  console.log("Listening on 4002 using cluster IPs");
  const res = await axios.get("http://event-bus-service:4005/events");

  for (let event of res.data) {
    console.log("Processing event : ", event.type);
    handleEvent(event.type, event.data);
  }
});
