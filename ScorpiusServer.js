const http = require("http");
const fs = require("fs");

let mimeTypes = {};

//Extract MIME for a file type using the "ExtensionsLibrary.json"
fs.readFile("ExtensionsLibrary.json", "utf8", function(error, content) {
    const extensionsDataObject = JSON.parse(content);

    for (let categoryKey in extensionsDataObject) {
        for (let typeKey in extensionsDataObject[categoryKey]) {
            if (isNaN(typeKey)) {
                mimeTypes[typeKey] = extensionsDataObject[categoryKey][typeKey][1];
            }
        }
    }
});

console.log("Completed indexing of Extensions Library");


http.createServer(function(request, response) {
    let fileExtension = request.url.slice(request.url.lastIndexOf("."));
    if (fileExtension.startsWith(".")) {
        let contentType = mimeTypes[fileExtension];
        console.log(contentType);
        fs.readFile(request.url.replace("/", ""), function(error, content) {
            response.writeHead(200, {"Content-Type": contentType});
            response.write(content);
            response.end();
        });
    }

}).listen(80);

console.log("Server is online at 'localhost:80'");