import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

type EventType = "CommentCreated";

interface CommentCreatedEventData {
  id: string;
  content: string;
  postId: string;
  status: "pending" | "approved" | "rejected";
}

const app = express();
app.use(bodyParser.json());

app.post(
  "/events",
  async (
    req: Request<{}, {}, { type: EventType; data: CommentCreatedEventData }>,
    res: Response
  ) => {
    const { type, data } = req.body;

    if (type === "CommentCreated" && "content" in data) {
      const status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://event-bus-service:4005/events", {
        type: "CommentModerated",
        data: {
          id: data.id,
          data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content,
          },
        },
      });
    }

    res.send({});
  }
);

app.listen(4003, () => {
  console.log("Listening on 4003 using Cluster IPs");
});
