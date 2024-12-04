class Body {
    constructor(content) {
        this.content = content;
    }

    toString() {
        return `${this.content ?? ''}`;
    }
}

export { Body };
