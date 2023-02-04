//importing express (backendframework)
const express = require("express");
//declaring variables
const app = express();
const port = 3000;

//seting static web folder
app.use(express.static("public"));

//listening for connections
app.listen(port, function (err) {
  if (err) {
    console.error(err);
    return;
  }

  console.log("listening on port: " + port);
});
