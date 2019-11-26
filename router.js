const express = require("express");
const router = express.Router();

router.get("/", (_, res) => {
  res.send("Server is running").status(200);
});

module.exports = router;
