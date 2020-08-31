require("dotenv/config");
const fs = require("fs");
const path = require("path");
const express = require("express");

let { PORT } = process.env;
const app = express();

app.use(express.static(path.join(__dirname, "../build")));
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"../build","index.html"));
});

app.listen(PORT ? PORT : 8000, function(err){
    return err
        ? console.log("Failed to start server instance %O", err)
        : console.log(`HTTP is listening on port ${PORT}`)
});

