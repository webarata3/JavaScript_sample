(() => {
  'use strict';

  class Board {
    static STONE_BLACK = 0;
    static STONE_WHITE = 1;
    static STONE_NOTHING = 2;
    static STONES = [Board.STONE_BLACK, Board.STONE_WHITE];
    #maxX;
    #maxY;
    #board;
    #nextColor;
    #canPutPos;
    #observers = [];

    static DIRECTIONS = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1]
    ];

    constructor(maxX, maxY, initStonesList, firstColor) {
      this.#maxX = maxX;
      this.#maxY = maxY;
      this.#nextColor = firstColor;
      this.#initBoard(initStonesList);
    }

    #initBoard(stonesList) {
      this.#board = new Array(this.#maxY);
      for (let y = 0; y < this.#maxY; y++) {
        this.#board[y] = new Array(this.#maxX).fill(Board.STONE_NOTHING);
      }

      for (const stone of Board.STONES) {
        this.#setStones(stonesList[stone], stone);
      }
      this.#update();
    }

    #setStones(stones, color) {
      for (const stone of stones) {
        this.#setStone(stone[0], stone[1], color);
      }
      this.#searchCanPutPos(this.#nextColor);
    }

    setStone(x, y) {
      const changePos = this.#canPutPos.filter(pos => pos[0] === x && pos[1] === y)[0][2];
      this.#setStone(x, y, this.#nextColor);
      this.#changeColor(changePos);
      this.#nextColor = this.#nextColor === Board.STONE_BLACK ? Board.STONE_WHITE : Board.STONE_BLACK;
      this.#searchCanPutPos(this.#nextColor);
      this.#update();
      return changePos;
    }

    #changeColor(posList) {
      for (const pos of posList) {
        this.#board[pos[1]][pos[0]] = this.#nextColor;
      }
    }

    #setStone(x, y, color) {
      this.#board[y][x] = color;
    }

    checkStone(x, y) {
      return this.#canPutPos
        .filter(pos => pos[0] === x && pos[1] === y)
        .length > 0;
    }

    addObserver(observer) {
      this.#observers.push(observer);
    }

    get maxX() {
      return this.#maxX;
    }

    get maxY() {
      return this.#maxY;
    }

    get canPutPos() {
      return this.#canPutPos;
    }

    countStone(color) {
      return this.#board
        .map(row => row.filter(stone => stone === color)) // 指定の色以外を消す
        .map(row => row.length) // 残っている石を行ごとに数える
        .reduce((prev, current) => prev + current); // 行ごとの石をすべて足す
    }

    getStone(x, y) {
      return this.#board[y][x];
    }

    #searchCanPutPos(stoneColor) {
      this.#canPutPos = [];
      for (let x = 0; x < this.#maxX; x++) {
        for (let y = 0; y < this.#maxY; y++) {
          const putPos = this.#checkPutPos(x, y, stoneColor);
          if (putPos.length !== 0) {
            this.#canPutPos.push([x, y, putPos]);
          }
        }
      }
    }

    #checkPutPos(checkX, checkY, stoneColor) {
      const canPutPos = [];
      for (const direction of Board.DIRECTIONS) {
        let tempX = checkX;
        let tempY = checkY;
        const pos = [];
        while (true) {
          tempX = tempX + direction[0];
          tempY = tempY + direction[1];
          if (tempX < 0 || tempX >= this.#maxX) break;
          if (tempY < 0 || tempY >= this.#maxY) break;
          const checkKomaIro = this.#board[tempY][tempX];
          if (checkKomaIro === Board.STONE_NOTHING) break;
          if (pos.length == 0) {
            if (checkKomaIro === stoneColor) break;
            pos.push(tempX, tempY);
          } else {
            if (checkKomaIro === stoneColor) {
              canPutPos.push(pos);
              break;
            }
            pos.push(tempX, tempY);
          }
        }
      }
      return canPutPos;
    }

    #update() {
      this.#observers.forEach(observer => {
        observer.update();
      });
    }
  }

  class BoardView {
    static PLAY_HUMAN = 1;
    static PLAY_CPU = 2;
    #boardElm;
    #statusElm;
    #messageElm;
    #countElm;
    #board;
    #trtds;
    #players;
    #next;
    static STONE_IMAGE = ['●', '○', ''];

    constructor(boardElmSelector, statusElmSelector, board, players) {
      this.#setElm(boardElmSelector, statusElmSelector);
      this.#board = board;
      this.#init();
      this.#setEvent();
      this.#render();
      this.#players = players;
      this.#next = 0;
    }

    #setElm(boardElmSelector, statusElmSelector) {
      this.#boardElm = document.querySelector(boardElmSelector);
      this.#statusElm = document.querySelector(statusElmSelector);
      this.#messageElm = this.#statusElm.querySelector('#message');
      this.#countElm = this.#statusElm.querySelector('#count');
    }

    #init() {
      this.#trtds = [];
      for (let y = 0; y < this.#board.maxY; y++) {
        const trElm = document.createElement('tr');
        const trs = [];
        for (let x = 0; x < this.#board.maxX; x++) {
          const tdElm = document.createElement('td');
          trElm.insertAdjacentElement('beforeend', tdElm);
          trs.push(tdElm);
        }
        this.#boardElm.insertAdjacentElement('beforeend', trElm);
        this.#trtds.push(trs);
      }
    }

    #setEvent() {
      this.#boardElm.addEventListener('click', event => this.#clickBoard(event));
    }

    #clickBoard(event) {
      if (this.#nextPlayer() === BoardView.PLAY_CPU) return;

      const target = event.target;
      if (target.tagName !== 'TD') return;
      const x = parseInt(target.dataset.x);
      const y = parseInt(target.dataset.y);
      if (this.#board.checkStone(x, y)) {
        this.#clearMessage();
        const changePos = this.#board.setStone(x, y);
        this.#highlightBoard(x, y, 1);
        for (const pos of changePos) {
          this.#highlightBoard(pos[0], pos[1], 2);
        }
      } else {
        this.#setMessage('そこには置けません');
      }
    }

    #setMessage(message) {
      this.#messageElm.textContent = message;
    }

    #clearMessage() {
      this.#setMessage('');
    }

    update() {
      this.#render();
      this.#turnEnd();
      if (this.#nextPlayer() === BoardView.PLAY_CPU) {
        // 少し待たす
        setTimeout(() => this.#cpu(), 1500);
      }
    }

    #render() {
      this.#renderMessage();
      this.#renderBoard();
    }

    #renderMessage() {
      const blackCount = this.#board.countStone(Board.STONE_BLACK);
      const whiteCount = this.#board.countStone(Board.STONE_WHITE);

      this.#countElm.textContent = `黒: ${blackCount}   白: ${whiteCount}`;
    }

    #renderBoard() {
      for (let y = 0; y < this.#board.maxY; y++) {
        for (let x = 0; x < this.#board.maxX; x++) {
          const tdElm = this.#trtds[y][x];
          tdElm.removeAttribute('class');
          tdElm.dataset.x = x;
          tdElm.dataset.y = y;
          tdElm.textContent = BoardView.STONE_IMAGE[this.#board.getStone(x, y)];
        }
      }
    }

    #highlightBoard(x, y, type) {
      this.#trtds[y][x].classList.add(type === 1 ? 'put' : 'change');
    }

    #nextPlayer() {
      return this.#players[this.#next];
    }

    #turnEnd() {
      this.#next = [1, 0][this.#next];
    }

    #cpu() {
      const canPutPos = this.#board.canPutPos;
      const pos = Math.floor(Math.random() * canPutPos.length);
      this.#board.setStone(canPutPos[pos][0], canPutPos[pos][1]);
    }
  }

  const board = new Board(8, 8, [[[3, 3], [4, 4]], [[3, 4], [4, 3]]], Board.STONE_BLACK);
  const boardView = new BoardView('#board tbody', '#status', board, [BoardView.PLAY_HUMAN, BoardView.PLAY_CPU]);
  board.addObserver(boardView);
})();
