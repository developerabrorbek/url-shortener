const path = require("node:path");
const { Router } = require("express");
const { readJSONFile, writeJSONFile } = require("../helpers/fs");

const userRouter = Router();

userRouter.get("/", (req, res) => {
  const filePath = path.join(__dirname, "..", "data", "users.json");
  const users = readJSONFile(filePath);

  res.send(users);
});

userRouter.post("/", (req, res) => {
  const { name, email, password } = req.body;

  const filePath = path.join(__dirname, "..", "data", "users.json");
  const users = readJSONFile(filePath);

  const foundedUser = users.find(
    (us) => us.email === email && us.password == password
  );

  if (foundedUser) {
    res.status(409).send({
      message: "Bunday email va passwordlik user allaqachon bor",
    });
    return;
  }

  const newUser = {
    id: users.at(-1)?.id + 1 || 1,
    name,
    email,
    password,
  };
  users.push(newUser);

  writeJSONFile(filePath, users);

  res.status(201).send({
    message: "User yaratildi",
    data: newUser,
  });
});

module.exports = userRouter;