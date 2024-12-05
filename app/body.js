import { Buffer } from 'node:buffer';

class Body {

    /**
     *  Creates a Body instance with content as buffer
     *  @param {Buffer} content - the content of the body
     */
    constructor(content) {
        this.content = content;
    }

    toString() {
        return `${this.content?.toString('utf8') ?? ''}`;
    }

    /**
     *  Creates a Body instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a Body
     *  @param {number} offset - Index from where to start parsing body
     *  @param {number}
     *  @returns {Body} body
     */
    static fromBuffer(buffer, offset, contentLength) {
        const content = buffer.subarray(offset, offset + contentLength);
        return new Body(content);
    }

    /**
     *  Creates a Body instance with string content as body content
     *  @param {string} content - the content of the body as string
     *  @returns {Body} body
     */
    static fromString(content) {
        const contentBuffer = Buffer.from(content);
        return new Body(contentBuffer);
    }
}

export { Body };
