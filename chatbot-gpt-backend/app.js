/* eslint-disable */
"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const OpenAI = require("openai");

require("dotenv").config();

const openAIKey = process.env.OPENAI_API_KEY;
const assistantKey = process.env.OPENAI_ASSISTANT_KEY;
const port = process.env.PORT || 3000;

const started = new Date();

const client = new OpenAI({
  apiKey: openAIKey,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", async (req, res) => {
  const uptime = new Date() - started;
  const uptimeInSeconds = Math.round(uptime / 1000);
  res.send(`Uptime: ${uptimeInSeconds} seconds`);
});

app.get("/thread", async (req, res) => {
  try {
    const thread = await client.beta.threads.create();
    res.json({ thread: thread.id });
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.post("/message", async (req, res) => {
  const { message, thread } = req.body;

  const wordCount = (str) => str.split(" ").length;

  if (wordCount(message) > 20) {
    return res.json("The question should be no more than 30 words");
  }

  try {
    await client.beta.threads.messages.create(thread, {
      role: "user",
      content: message,
    });

    const run = await client.beta.threads.runs.createAndPoll(thread, {
      assistant_id: assistantKey,
    });

    if (run.status === "completed") {
      const messages = await client.beta.threads.messages.list(thread);

      const tmp = messages.data
        .filter((x) => x.role === "assistant")
        .sort((a, b) => b.created_at - a.created_at);
      const lastMessage = tmp[0];

      // res.json({ response: lastMessage.content[0].text.value });

      res.send(lastMessage.content[0].text.value);
    } else {
      console.log(run.status);
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
