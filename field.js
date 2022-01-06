export class Cell {
    constructor() {

    }

}

export class Field {
    constructor(n, m) {
        this.n = n;
        this.m = m;
        this.cells = [];
        for (let i = 0; i < n * m; i++) {
            this.cells.push(new Cell())
        }
    }
}