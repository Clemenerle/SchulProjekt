const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("public"));

app.listen(port, function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log("listening on port: " + port);
});
