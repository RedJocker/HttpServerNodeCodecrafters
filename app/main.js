import { createServer } from "net";
import { EventEmitter } from 'node:events';

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

class Controller {

    /**
     *  Serve requests
     *  @param {RequestLine} requestLine - The request
     *  @returns {StatusLine} - The response
     */
    serve(requestLine) {
        console.log(`serve ${requestLine}`);
        if (requestLine.path === "/") {
            if (requestLine.httpMethod === "GET"){
                const responseStatus = new StatusLine(200, 'OK');
                return responseStatus;
            }
        }
        return new StatusLine(404, 'Not Found');
    }
}

class RequestLine {

    constructor({httpMethod, path, version}) {
        this.version = version ?? 'HTTP/1.1';
        this.httpMethod = httpMethod ?? 'GET';
        this.path = path ?? '/';
    }

    toString() {
        
        return [this.httpMethod, this.path, this.version].join(' ');
    }

    /**
     *  Creates a RequestLine instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a RequestLine
     */  
    static fromBuffer(buffer, offset) {
        const index = buffer.findIndex((c, index, obj) => {
            return index > offset + 1
                && obj.at(index - 1) === '\r'.charCodeAt(0)
                && c === '\n'.charCodeAt(0);
        }) ?? -1;
        if (index < 0) {
            console.log("failed to parse request line");
            return {requestLine: null, newOffset: -1};  
        }
        const line = buffer.subarray(offset, index - 1).toString('ascii');
        const lineSplit = line.split(new RegExp('[ ]+'), 3);
        if (lineSplit.length != 3) {
            console.log("failed to split request line");
            return {requestLine: null, newOffset: -1};  
        }
        const requestLine = new RequestLine({
            httpMethod: lineSplit[0],
            path: lineSplit[1],
            verion: lineSplit[2]
        });
        const newOffset = index + 2;
        return {requestLine, newOffset};
    }
}


console.log("Logs from your program will appear here!");
const pipeline = new EventEmitter();
const controller = new Controller();

pipeline.on('request', (requestLine) => {
    console.log(`pipeline on request ${requestLine}`);
    const response = controller.serve(requestLine);
    console.log(`pipeline emit response ${response}`);
    pipeline.emit('response', response.toString());
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
        const {requestLine, newOffset: headerOffset } =
                  RequestLine.fromBuffer(buffer, 0);
        console.log(`pipeline emit request ${requestLine}`);
        pipeline.on('response', (response) => {
            console.log(`pipeline on response ${response}`);
            socket.write(`${response}\r\n\r\n`);
        });
        pipeline.emit('request', requestLine);
    });
 
});

server.listen(4221, "localhost");
