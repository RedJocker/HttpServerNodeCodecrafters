import { Header } from "./header.js";
import { Body } from "./body.js";

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
        this.#body = new Body();
        this.#header.addHeader('Connection', 'close');
    }

    status = (number, description) => {
        this.#statusLine = new StatusLine(number, description);
        return this;
    }

    bodyTextPlain = (content) => {
        const contentBuffer = Buffer.from(content);
        const len = contentBuffer.length;
        this.#body = new Body(contentBuffer);
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
