import { Body } from "./body.js";
import { Header } from "./header.js";

class RequestLine {

    constructor({httpMethod, path, version}) {
        this.version = version ?? 'HTTP/1.1';
        this.httpMethod = httpMethod ?? 'GET';
        /** @var {string} path - The requested path */
        this.path = path ?? '/';
    }

    toString() {
        
        return [this.httpMethod, this.path, this.version].join(' ');
    }

    /**
     *  Creates a RequestLine instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a RequestLine
     *  @returns {{requestLine: RequestLine, newOffset: number}} {requestLine, newOffset}
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
        const newOffset = index + 1;
        return {requestLine, newOffset};
    }
}

class Request {
    constructor(requestLine, header, body) {
        this.requestLine = requestLine;
        this.header = header;
        this.body = body;
    }

    /**
     *  Creates a Request instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a Request
     *  @returns {Request | null} request?
     */
    static fromBuffer(buffer) {
        const {requestLine, newOffset: headerOffset } =
              RequestLine.fromBuffer(buffer, 0);
        const {header, newOffset: bodyOffset} = headerOffset < 0 ?
                  new Header()
                  : Header.fromBuffer(buffer, headerOffset);
        const maybeContentLen = Number(header['Content-Length']) ?? 0;
        const contentLen = isNaN(maybeContentLen) ? 0 : maybeContentLen;
        const body = bodyOffset < 0 || contentLen == 0 ?
                  new Body('')
                  : Body.fromBuffer(buffer, bodyOffset, contentLen);
        return new Request(requestLine, header, body);
    }

    toString() {
        return [this.requestLine, this.header, this.body]
            .map(e => e.toString())
            .join('\r\n');
    }
}

export { Request, RequestLine }
