(() => {
  'use strict';

  const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ];

  const BOARD_MAX_Y = board.length;
  const BOARD_MAX_X = board[0].length;

  const KOMA_NOTHING = 0;
  const KOMA_KURO = 1;
  const KOMA_SHIRO = 2;

  const koma = ['', '●', '○'];
  let next = KOMA_KURO;

  const messageElm = document.querySelector('#message');

  function updateBoard() {
    const tds = document.querySelectorAll('td');
    for (let x = 0; x < BOARD_MAX_X; x++) {
      for (let y = 0; y < BOARD_MAX_Y; y++) {
        tds[y * 8 + x].textContent = koma[board[y][x]];
        tds[y * 8 + x].classList.remove('can-put');
      }
    }
    const canPutPos = getCanPutPos(next);
    for (const pos of canPutPos) {
      tds[pos[1] * 8 + pos[0]].classList.add('can-put');
    }
  }

  function getCanPutPos(komaIro) {
    const pos = [];
    for (let x = 0; x < board.length; x++) {
      for (let y = 0; y < board[x].length; y++) {
        if (board[y][x] !== KOMA_NOTHING) continue;
        if (checkPos(x, y, komaIro)) pos.push([x, y]);
      }
    }
    return pos;
  }

  const CHECK_DIRECTIONS = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1]
  ];

  function checkPos(checkX, checkY, komaIro) {
    for (const direction of CHECK_DIRECTIONS) {
      let other = false;
      let tempX = checkX;
      let tempY = checkY;
      while (true) {
        tempX = tempX + direction[0];
        tempY = tempY + direction[1];
        if (tempX < 0 || tempX >= BOARD_MAX_X) break;
        if (tempY < 0 || tempY >= BOARD_MAX_Y) break;
        const checkKomaIro = board[tempY][tempX];
        if (checkKomaIro === KOMA_NOTHING) break;
        if (other) {
          if (checkKomaIro === komaIro) return true;
        } else {
          if (checkKomaIro === komaIro) break;
          other = true;
        }
      }
    }
    return false;
  }

  updateBoard();
})();
