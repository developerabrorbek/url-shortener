const { Router } = require("express");

const pageRoutes = Router();

pageRoutes.get("/", (req, res) => {
  res.render("index");
});

module.exports = pageRoutes;
