const express = require("express");
const app = express.Router();

const userControllers = require("../../controllers/user.controller");
const { auth } = require("../../middleware/auth");

app.get("/", userControllers.allUsers);
app.get("/:id", userControllers.singleUser);
app.post("/register", userControllers.register);
app.post("/login", userControllers.login);
app.post("/addUser", userControllers.addUser);
app.put(
  "/update/:id",
  auth,
  upload.single("userProfilePic"),
  userControllers.updateUser
);
app.delete("/:id", userControllers.deleteUser);

module.exports = app;
