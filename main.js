import './style.css'

const WIDTH = 10;
const HEIGHT = 10;
const MINES = 10;


const app = document.getElementById('app');
app.addEventListener('selectstart', e => e.preventDefault());
app.addEventListener('contextmenu', e => e.preventDefault())
let init = false;
let freeCells = WIDTH * HEIGHT - MINES;
let finished = false;

class Cell {
    constructor(el, i, j) {
        this.el = el;
        this.i = i;
        this.j = j;
        el.classList.add('cell');
        el.addEventListener('mousedown', this.onMouseDown.bind(this));
        el.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.status = 'closed';
        el.classList.add('closed');
        this.button = 0;
    }

    onMouseDown(e) {
        this.button = Math.max(this.button, e.buttons);
    }

    onMouseUp() {
        if (this.button === 1) {
            this.leftClick();
        } else if (this.button === 2) {
            this.rightClick();
        } else if (this.button === 3) {
            this.bothClick();
        }
        this.button = 0;
    }

    bothClick() {
        const mines = this.neighbors.filter(c => c.status === 'flag').length;
        if (mines === this.number) {
            for (const cell of this.neighbors) {
                cell.leftClick();
            }
        }
    }

    rightClick() {
        if (this.status === 'opened' || finished) return;
        this.status = this.status === 'closed' ? 'flag' : 'closed';
        this.el.classList.toggle('flag');
        this.el.classList.toggle('closed');
    }

    leftClick() {
        if (!init) {
            fillMines(10, this.i, this.j);
            init = true;
        }

        if (this.status === 'opened' || this.status === 'flag' || finished) return;

        // console.log('handle click', this.el, this.bomb, this.number);
        this.el.classList.remove('closed');

        if (this.bomb) {
            this.status = 'bomb-fail';
            this.el.classList.add('bomb-fail');
            loose();
            return
        }

        this.status = 'opened';
        freeCells--;

        if (this.number > 0) {
            this.el.classList.add('n' + this.number);
            this.el.innerText = this.number;
        } else {
            this.el.classList.add('empty');
            for (const cell of this.neighbors) {
                cell.leftClick();
            }
        }

        checkWin();
    }

    init() {
        if (!this.bomb) {
            this.number = this.neighbors.filter(c => c.bomb).length;
        }

        //DEBUG:
        // this.el.innerText = this.bomb ? '*' : this.number || '';
        // console.log('init', this.i, this.j, this.bomb, this.number);
    }

    showBomb() {
        if (this.bomb && this.status === 'closed') {
            this.el.classList.remove('closed');
            this.el.classList.add('bomb')
        }
    }
}


const field = createField(app, HEIGHT, WIDTH);

// console.log('FIELD', field);


function fillMines(count, firstI, firstJ) {
    // console.log('fill mines')
    let n = 0;
    while (n < count) {
        const i = Math.floor(Math.random() * HEIGHT);
        const j = Math.floor(Math.random() * WIDTH);

        if (!field[i][j].bomb && (i !== firstI || j !== firstJ)) {
            field[i][j].bomb = true;
            n++;
        }
    }

    for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
            field[i][j].init();
        }
    }
}

function createField(el, n, m) {
    const cells = [];
    for (let i = 0; i < n; i++) {
        const rowEl = document.createElement('div');
        rowEl.classList.add('row')
        el.appendChild(rowEl);
        const row = [];
        cells.push(row);
        for (let j = 0; j < m; j++) {
            const cellEl = document.createElement('div')
            rowEl.appendChild(cellEl);
            const cell = new Cell(cellEl, i, j);

            row.push(cell);
        }
    }

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            const neighbors = [];
            if (i > 0) {
                if (j > 0) neighbors.push(cells[i - 1][j - 1])
                neighbors.push(cells[i - 1][j])
                if (j < m - 1) neighbors.push(cells[i - 1][j + 1])
            }

            if (j > 0) neighbors.push(cells[i][j - 1])
            if (j < m - 1) neighbors.push(cells[i][j + 1])

            if (i < n - 1) {
                if (j > 0) neighbors.push(cells[i + 1][j - 1])
                neighbors.push(cells[i + 1][j])
                if (j < m - 1) neighbors.push(cells[i + 1][j + 1])
            }

            cells[i][j].neighbors = neighbors;
        }
    }

    return cells;
}

function checkWin() {
    if (freeCells === 0) {
        const text = document.createElement('h1');
        text.innerText = 'WIN';
        text.classList.add('win');
        app.appendChild(text);
        finished = true;
        showAll();
    }
}

function loose() {
    const text = document.createElement('h1');
    text.innerText = 'LOOSE';
    text.classList.add('loose');
    app.appendChild(text);
    finished = true;
    showAll();
}

function showAll() {
    for (let i = 0; i < WIDTH; i++) {
        for (let j = 0; j < HEIGHT; j++) {
            field[i][j].showBomb();
        }
    }
}