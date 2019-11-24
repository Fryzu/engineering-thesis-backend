const express = require("express");

const PORT = 5000;

const app = express();

app.get("/api/test", (_, res) => {
  res.json(["raz", "dwa", "trzy"]);
});

app.listen(PORT, () => {
  console.warn("Server runs on port", PORT);
});
