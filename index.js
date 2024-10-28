const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.static(__dirname + "/"));
app.set("view engine", "ejs");

const router = express.Router();

app.get("/", function (req, res) {
	res.send("index.html");
});

const http = require("http").createServer(app);

app.listen(3000, () => {
	console.log("Server is running on port : 3000");
});
