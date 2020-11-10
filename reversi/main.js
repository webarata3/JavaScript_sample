(() => {
  'use strict';

  const board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
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
  let canPutPos = [];

  function updateBoard() {
    const tds = document.querySelectorAll('td');
    for (let x = 0; x < BOARD_MAX_X; x++) {
      for (let y = 0; y < BOARD_MAX_Y; y++) {
        tds[y * 8 + x].textContent = koma[board[y][x]];
        tds[y * 8 + x].classList.remove('can-put');
      }
    }
    canPutPos = getCanPutPos(next);
    for (const pos of canPutPos) {
      tds[pos[1] * 8 + pos[0]].classList.add('can-put');
    }

    let kuroCount = 0;
    let shiroCount = 0;
    for (let x = 0; x < BOARD_MAX_X; x++) {
      for (let y = 0; y < BOARD_MAX_Y; y++) {
        if (board[y][x] === KOMA_KURO) kuroCount++;
        if (board[y][x] === KOMA_SHIRO) shiroCount++;
      }
    }
    document.querySelector('#count').textContent = `黒:${kuroCount}  白:${shiroCount}`;

    const status = confirmFinish(kuroCount, shiroCount, canPutPos);
    if (status === null) return;
    if (status === 'not put') {
      if (next === KOMA_KURO) messageElm.textContent = '白の勝ち';
      if (next === KOMA_SHIRO) messageElm.textContent = '黒の勝ち';
    }
    if (status === 'kuro') messageElm.textContent = '黒の勝ち';
    if (status === 'shiro') messageElm.textContent = '白の勝ち';
    if (status === 'draw') messageElm.textContent = '引き分け';
  }

  function confirmFinish(kuroCount, shiroCount, canPutPos) {
    const MAX_COUNT = BOARD_MAX_X * BOARD_MAX_Y;
    if (kuroCount + shiroCount === MAX_COUNT) {
      if (kuroCount > shiroCount) return 'kuro';
      if (kuroCount < shiroCount) return 'shiro';
      return 'draw';
    }
    if (canPutPos.length === 0) {
      return 'not put';
    }
    return null;
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

  function init() {
    const tbody = document.querySelector('tbody');
    for (let y = 0; y < BOARD_MAX_Y; y++) {
      const tr = document.createElement('tr');
      for (let x = 0; x < BOARD_MAX_X; x++) {
        const td = document.createElement('td');
        td.dataset.x = x;
        td.dataset.y = y;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    tbody.addEventListener('click', event => {
      const tag = event.target;
      if (tag.tagName !== 'TD') return;
      const x = parseInt(tag.dataset.x);
      const y = parseInt(tag.dataset.y);
      if (canPut(x, y)) {
        messageElm.textContent = '';
        board[y][x] = next;
        turn(x, y);
        next = next === KOMA_KURO ? KOMA_SHIRO : KOMA_KURO;
        updateBoard();
      } else {
        messageElm.textContent = 'そこには置けません';
      }
    });
  }

  function canPut(x, y) {
    for (const pos of canPutPos) {
      if (pos[0] === x && pos[1] === y) return true;
    }
    return false;
  }

  function turn(checkX, checkY) {
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
          if (checkKomaIro === next) {
            let endX = tempX;
            let endY = tempY;
            tempX = checkX;
            tempY = checkY;
            while (true) {
              if (endX === tempX && endY === tempY) break;
              tempX = tempX + direction[0];
              tempY = tempY + direction[1];
              board[tempY][tempX] = next;
            }
            break;
          };
        } else {
          if (checkKomaIro === next) break;
          other = true;
        }
      }
    }
  }

  init();
  updateBoard();
})();
