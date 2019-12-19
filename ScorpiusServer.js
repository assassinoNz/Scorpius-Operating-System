const http = require("http");
const fs = require("fs");
const fileSystem = require("./FileSystem.js");

const scorpiusServer = http.createServer(function (request, response) {
    const fileName = request.url.slice(request.url.lastIndexOf("/"));
    // let fileExtension = request.url.slice(request.url.lastIndexOf("."));
    if (fileName === "/FileSystem.js") {
        console.log("FileSystem request detected");
    } else {
        fs.readFile(request.url.replace("/", ""), function (error, content) {
            if (error) {
                console.log(error);
            } else {
                response.write(content);
                response.end();
            }
        });
    }
});

scorpiusServer.listen(80);
console.log("Server is online at 'localhost:80'");