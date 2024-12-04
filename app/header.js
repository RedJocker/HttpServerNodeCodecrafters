class Header {
    addHeader(key, value) {
        this[key] = value;
    }

    toString() {
        const keys = Object.keys(this)
        if(keys.length == 0)
            return ''
        else
            return keys.map((k) => `${k}: ${this[k]}`)
                       .join("\r\n") + '\r\n';
    }
}

export { Header };
