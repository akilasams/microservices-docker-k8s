import { Request, Response } from "express";

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const axios = require("axios");

interface Comment {
  id: string;
  content: string;
  status: "pending" | "approved" | "rejected";
}

interface Comments {
  [postId: string]: Array<Comment>;
}

type EventType = "CommentModerated";

interface CommentModeratedEventData {
  id: string;
  data: {
    id: string;
    content: string;
    postId: string;
    status: "pending" | "approved" | "rejected";
  };
}

const commentsByPostId = {} as Comments;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get(
  "/posts/:id/comments",
  (req: Request<{ id: string }>, res: Response) => {
    res.send(commentsByPostId[req.params.id] || []);
  }
);

app.post(
  "/posts/:id/comments",
  async (req: Request<{ id: string }>, res: Response) => {
    const commentId = randomBytes(4).toString("hex");
    const { content } = req.body;

    const comments = commentsByPostId[req.params.id] || [];

    comments.push({ id: commentId, content, status: "pending" });
    commentsByPostId[req.params.id] = comments;

    await axios.post("http://event-bus-service:4005/events", {
      type: "CommentCreated",
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: "pending",
      },
    });

    res.status(201).send(comments);
  }
);

app.post(
  "/events",
  async (
    req: Request<{}, {}, { type: EventType; data: CommentModeratedEventData }>,
    res: Response
  ) => {
    const {
      type,
      data: { data },
    } = req.body;

    if (type === "CommentModerated" && "content" in data) {
      const { id, content, postId, status } = data;

      const comments = commentsByPostId[postId];
      const comment = comments.find((comment) => comment.id === id);

      if (comment) {
        comment.status = status;
      }

      await axios.post("http://event-bus-service:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          content,
          status,
          postId,
        },
      });
    }
  }
);

app.listen(4001, () => {
  console.log("Listening on 4001 using Cluster IPs");
});
