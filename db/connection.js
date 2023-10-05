const mongoose = require("mongoose");

const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qoenuaa.mongodb.net/NetflixBuy?retryWrites=true&w=majority`;

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB Successfully"))
  .catch((e) => console.log("Error", e));
