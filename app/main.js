import { createServer } from "net";

console.log("Logs from your program will appear here!");

class StatusLine {

    constructor(statusCode, description) {
	this.version = 'HTTP/1.1';
	this.statusCode = statusCode;
	this.description = description;
    }

    toString() {
	return [this.version, this.statusCode, this.description].join(' ');
    }
}

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
	const header = new StatusLine(200, 'OK');
	socket.write(`${header}\r\n\r\n`);
    });
 
});

server.listen(4221, "localhost");
