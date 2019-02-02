const http = require("http");
const fs = require("fs");

http.createServer(function(request, response) {
    let fileExtension = request.url.slice(request.url.lastIndexOf("."));
    if (fileExtension.startsWith(".")) {
        fs.readFile(request.url.replace("/", ""), function(error, content) {
            response.write(content);
            response.end();
        });
    }

}).listen(80);

console.log("Server is online at 'localhost:80'");