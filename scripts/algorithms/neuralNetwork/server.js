"use strict";

const http = require("http");
const fs = require("fs");

function main() {

    const server = http.createServer(async (req, res) => {


        if (req.url === '/') {

            fs.readFile('./index.html', (err, data) => {
                if (err) {

                    console.log(err);
                    res.end();

                } else {

                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write(data);
                    res.end();

                }
            });
        }

        if (req.url === '/scripts/algorithms/neuralNetwork/modelManagement.js') {

            fs.readFile('./scripts/algorithms/neuralNetwork/modelManagement.js', (err, data) => {
                if (err) {

                    console.log(err);
                    res.end();

                } else {

                    res.writeHead(200, {'Content-Type': 'text/javascript'});
                    res.write(data);
                    res.end();

                }
            });

        }

        if (req.url === '/style.css') {

            fs.readFile('./style.css', (err, data) => {
                if (err) {

                    console.log(err);
                    res.end();

                } else {

                    res.writeHead(200, {'Content-Type': 'text/css'});
                    res.write(data);
                    res.end();

                }
            });
        }

        if (req.url === '/getData') {

            fs.readFile('./json/model.json', (err, data) => {
                if (err) {

                    console.log(err);
                    res.end();

                } else {

                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(data);
                    res.end();

                }
            });

        }
    });

    server.listen(3000, () => {
        console.log("Server up and running on http://localhost:3000");
    });
}

main();