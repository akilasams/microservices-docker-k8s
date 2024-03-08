import { Request, Response } from "express";

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const events = [] as any[];

app.post("/events", (req: Request, res: Response) => {
  const event = req.body;

  events.push(event);

  // Posts Service
  axios
    .post("http://posts-clusterip-service:4000/events", event)
    .catch((err) => {
      console.log(err.message);
    });

  // Comments Service
  axios.post("http://comments-service:4001/events", event).catch((err) => {
    console.log(err.message);
  });

  // Query Service
  axios.post("http://query-service:4002/events", event).catch((err) => {
    console.log(err.message);
  });

  // Moderation Service
  axios.post("http://moderation-service:4003/events", event).catch((err) => {
    console.log(err.message);
  });

  res.send({ status: "OK" });
});

app.get("/events", (req: Request, res: Response) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Listening on 4005 using cluster IPs");
});
