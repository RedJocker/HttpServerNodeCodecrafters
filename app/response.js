import { Header } from "./header.js";
import { Body } from "./body.js";
import zlib from "node:zlib";
import { Buffer } from "node:buffer";

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

class Response {
    constructor(statusLine, header, body) {
        this.statusLine = statusLine;
        this.header = header;
        this.body = body;
    }

    toString() {
        return [this.statusLine, this.header, this.body]
            .map(e => e.toString())
            .join('\r\n');
    }

    toBuffer() {
	const preBodyStr = [this.statusLine, this.header, '']
            .map(e => e.toString())
              .join('\r\n');
	const buffers = [Buffer.from(preBodyStr), this.body.content];
	const totalLen = buffers.reduce((a, c) => a + c.length, 0);
	return Buffer.concat(buffers, totalLen);
    }
}

class ResponseBuilder {
    #statusLine;
    #header;
    #body;
    
    constructor() {
        /**
        *  @var {StatusLine} statusLine - A statusLine with statusCode
        *  and description
        */
        this.#statusLine = new StatusLine(200, 'OK');
        /** @var {Header} header - response header */
        this.#header = new Header();
        /** @var {Body} body - response body */
        this.#body = new Body(Buffer.from(''));
        this.#header.addHeader('Connection', 'close');
    }

    status = (number, description) => {
        this.#statusLine = new StatusLine(number, description);
        return this;
    }

    bodyTextPlain = (content, compression) => {
        const isGzip = compression === 'gzip';
	console.log(content);
        const contentBufferMaybeCompressed = isGzip
              ? zlib.gzipSync(content,
			      {strategy: zlib.constants.Z_DEFAULT_STRATEGY,
			       level: 7})
              : Buffer.from(content);
	console.log(contentBufferMaybeCompressed);
        const len = contentBufferMaybeCompressed.length;
        this.#body = new Body(contentBufferMaybeCompressed);
        if (isGzip)
            this.#header.addHeader('Content-Encoding', 'gzip');
        this.#header.addHeader('Content-Type', 'text/plain');
        this.#header.addHeader('Content-Length', len);
        return this;
    }

    bodyOctetStream = (content) => {
        const len = content.length;
        this.#body = new Body(content);
        this.#header.addHeader('Content-Type', 'application/octet-stream');
        this.#header.addHeader('Content-Length', len);
        return this;
    }

    addHeader = (key, value) => {
        this.#header.addHeader(key, value);
        return this;
    }

    
    build = () => {
        return new Response(this.#statusLine, this.#header, this.#body);
    }
}


export { StatusLine, Response, ResponseBuilder }
