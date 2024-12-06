import { createServer } from "net";
import { EventEmitter } from 'node:events';
import { Controller } from "./controller.js";
import { Request } from "./request.js";
import { Buffer } from "node:buffer";
import { FileService } from "./fileService.js";

console.log("Logs from your program will appear here!");
const fileServiceDir = process.argv[3];

const pipeline = new EventEmitter();
const fileService = new FileService(fileServiceDir);
const controller = new Controller(fileService);



pipeline.on('request', (request) => {
    (async () => {
        console.log(`pipeline on request ${request}`);
        const response = await controller.serve(request);
        //const buffer = Buffer.from(response.toString());
        //buffer.forEach(n => console.log(n));
        console.log(`pipeline emit response ${response}`);
        pipeline.emit('response', response.toBuffer());
    })();
});


const server = createServer((socket) => {
    socket.on("close", () => {
        console.log('on close');
        socket.end();
    });

    socket.on('error', (err) => {
        console.log(`socket on error: ${err}`);
    });

    socket.on('connect', () => {
        console.log("on connect");
    });

    socket.on('data', (buffer) => {
        console.log(`data: ${buffer}`);
        const request = Request.fromBuffer(buffer);
        console.log(`pipeline emit request ${request}`);
        pipeline.on('response', (response) => {
            console.log(`pipeline on response ${response}`);
            socket.write(response);
            socket.end();
        });
        pipeline.emit('request', request);
    });
 
});

server.listen(4221, "localhost");
