class Body {
    constructor(content) {
        this.content = content;
    }

    toString() {
        return `${this.content ?? ''}`;
    }

    /**
     *  Creates a Body instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a Body
     *  @param {number} offset - Index from where to start parsing body
     *  @param {number}
     *  @returns {Body} body
     */
    static fromBuffer(buffer, offset, contentLength) {
        const content = buffer.subarray(offset).toString('ascii')
        return new Body(content);
    }
}

export { Body };
