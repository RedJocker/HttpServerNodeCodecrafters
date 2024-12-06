class Header {

    addHeader(key, value) {
        this[key] = value;
    }

    toString() {
        const keys = Object.keys(this).filter(k => k !== "acceptsGzip");
        if(keys.length == 0)
            return '';
        else
            return keys.map((k) => `${k}: ${this[k]}`)
                       .join("\r\n") + '\r\n';
    }

    acceptsGzip = () => {
	/** @type {string} encodingHeader */
	const encodingHeader = this['Accept-Encoding'] ?? '';
	const encodingArr = encodingHeader.split(',')
		  .map(s => s.trim().toLowerCase());
	return encodingArr.includes('gzip');
    }

    /**
     *  Creates a Header instance consuming a Buffer instance
     *  @param {Buffer} buffer - A buffer used to parse a Header
     *  @returns {{header: Header, newOffset: number}} {header, newOffset}
     */
    static fromBuffer(buffer, offset) {
        const index = buffer.findIndex((c, index, obj) => {
            return index > offset + 3
                && obj.at(index - 3) === '\r'.charCodeAt(0)
                && obj.at(index - 2) === '\n'.charCodeAt(0)
                && obj.at(index - 1) === '\r'.charCodeAt(0)
                && c === '\n'.charCodeAt(0);
        }) ?? -1;
        if (index < 0) {
            console.log("failed to parse header");
            return {requestLine: null, newOffset: -1};
        }
        const headerStr = buffer.subarray(offset, index - 3).toString('ascii');
        const headerArr = headerStr.split(new RegExp('\r\n'))
              .map(headerLine => headerLine.split(new RegExp(': '), 2));
        const header = new Header();
        for (const [key, value] of headerArr) {
            header.addHeader(key, value);
        }
        const newOffset = index + 1;
        return {header, newOffset};
    }
}

export { Header };
