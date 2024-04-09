"use strict";

const http = require('http');
const fs = require('fs');

const server = http.createServer(async (req, res) => {
    const routes = {
        '/': { filePath: './index.html', contentType: 'text/html' },
        '/modelManagement.js': { filePath: './modelManagement.js', contentType: 'text/javascript' },
        '/styles.css': { filePath: './styles.css', contentType: 'text/css' },
        '/getData': { filePath: './samples/json/model.json', contentType: 'application/json' }
    };

    const route = routes[req.url];

    if (route) {
        sendFile(res, route.filePath, route.contentType);
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log("Server up and running on http://localhost:3000");
});

function sendFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.write(data);
            res.end();
        }
    });
}