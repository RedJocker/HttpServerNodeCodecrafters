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

class Request {
    constructor(line, header, body) {
        this.line = line;
        this.header = header;
        this.body = body;
    }
}

export { RequestLine }
