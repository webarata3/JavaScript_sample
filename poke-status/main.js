(() => {
  'use strict';

  const lvElm = document.querySelector('#lv');
  const hpElm = document.querySelector('#hp');
  const attackElm = document.querySelector('#attack');
  const defenceElm = document.querySelector('#defence');
  const spAttackElm = document.querySelector('#spAttack');
  const spDefenceElm = document.querySelector('#spDefence');
  const speedElm = document.querySelector('#speed');

  lvElm.addEventListener('input', calc);
  hpElm.addEventListener('input', calc);
  attackElm.addEventListener('input', calc);
  defenceElm.addEventListener('input', calc);
  spAttackElm.addEventListener('input', calc);
  spDefenceElm.addEventListener('input', calc);
  speedElm.addEventListener('input', calc);

  document.querySelector('#seikaku tbody').addEventListener('click', event => {
    document.querySelector('.selected').classList.remove('selected');
    const trElm = event.target.parentNode;
    trElm.classList.add('selected');
    calc();
  });

  const seikaku = [
    ['てれや', 0, 0, 0, 0, 0],
    ['がんばりや', 0, 0, 0, 0, 0],
    ['すなお', 0, 0, 0, 0, 0],
    ['きまぐれ', 0, 0, 0, 0, 0],
    ['まじめ', 0, 0, 0, 0, 0],
    ['さみしがり', 1, 2, 0, 0, 0],
    ['いじっぱり', 1, 0, 2, 0, 0],
    ['やんちゃ', 1, 0, 0, 2, 0],
    ['ゆうかん', 1, 0, 0, 0, 2],
    ['ずぶとい', 2, 1, 0, 0, 0],
    ['わんぱく', 0, 1, 2, 0, 0],
    ['のうてんき', 0, 1, 0, 2, 0],
    ['のんき', 0, 1, 0, 0, 2],
    ['ひかえめ', 2, 0, 1, 0, 0],
    ['おっとり', 0, 2, 1, 0, 0],
    ['うっかりや', 0, 0, 1, 2, 0],
    ['れいせい', 0, 0, 1, 0, 2],
    ['おだやか', 2, 0, 0, 1, 0],
    ['おとなしい', 0, 2, 0, 1, 0],
    ['しんちょう', 0, 0, 2, 1, 0],
    ['なまいき', 0, 0, 0, 1, 2],
    ['おくびょう', 2, 0, 0, 0, 1],
    ['せっかち', 0, 2, 0, 0, 1],
    ['ようき', 0, 0, 2, 0, 1],
    ['むじゃき', 0, 0, 0, 2, 1]
  ];
  const HOSEI = [1.0, 1.1, 0.9];
  const seikakuMap = new Map();
  for (const s of seikaku) {
    seikakuMap.set(s[0], {
      name: s[0],
      attack: HOSEI[s[1]],
      defence: HOSEI[s[2]],
      spAttack: HOSEI[s[3]],
      spDefence: HOSEI[s[4]],
      speed: HOSEI[s[5]]
    });
  }

  function viewSeikaku() {
    const tbodyElm = document.querySelector('#seikaku tbody');
    for (const s of seikaku) {
      tbodyElm.insertAdjacentHTML('beforeend', `<tr>
       <td>${s[0]}</td>
       ${viewSeikakuUpDown(s[1])}
       ${viewSeikakuUpDown(s[2])}
       ${viewSeikakuUpDown(s[3])}
       ${viewSeikakuUpDown(s[4])}
       ${viewSeikakuUpDown(s[5])}
      </tr>`);
    }
    document.querySelector('#seikaku tbody tr').classList.add('selected');
  }

  function viewSeikakuUpDown(updown) {
    if (updown === 1) return '<td class="up">UP</td>';
    if (updown === 2) return '<td class="down">DOWN</td>';
    return '<td>-</td>';
  }

  function calc() {
    const seikakuHosei = getSeikakuHosei();
    const tbodyElm = document.querySelector('#status tbody');
    tbodyElm.innerHTML = '';
    const shuzoku = getStatus();
    for (let kotai = 0; kotai <= 31; kotai++) {
      const hp = calcHp(shuzoku.lv, shuzoku.hp, kotai);
      const attack = calcABCDS(shuzoku.lv, shuzoku.attack, kotai, seikakuHosei.attack);
      const defence = calcABCDS(shuzoku.lv, shuzoku.defnece, kotai, seikakuHosei.defence);
      const spAttack = calcABCDS(shuzoku.lv, shuzoku.spAttack, kotai, seikakuHosei.spAttack);
      const spDefence = calcABCDS(shuzoku.lv, shuzoku.spDefence, kotai, seikakuHosei.spDefence);
      const speed = calcABCDS(shuzoku.lv, shuzoku.speed, kotai, seikakuHosei.speed);
      tbodyElm.insertAdjacentHTML('beforeend', `<tr>
       <td>${kotai}</td>
       <td>${hp}</td>
       <td>${attack}</td>
       <td>${defence}</td>
       <td>${spAttack}</td>
       <td>${spDefence}</td>
       <td>${speed}</td>
      </tr>`)
    }
  }

  function getStatus() {
    return {
      lv: parseInt(lvElm.value),
      hp: parseInt(hpElm.value),
      attack: parseInt(attackElm.value),
      defnece: parseInt(defenceElm.value),
      spAttack: parseInt(spAttackElm.value),
      spDefence: parseInt(spDefenceElm.value),
      speed: parseInt(speedElm.value)
    };
  }

  function calcHp(lv, shuzoku, kotai) {
    return Math.floor((shuzoku * 2 + kotai) * lv / 100) + lv + 10;
  }

  function calcABCDS(lv, shuzoku, kotai, seikakuHosei) {
    return Math.floor((Math.floor((shuzoku * 2 + kotai) * lv / 100) + 5) * seikakuHosei);
  }

  function getSeikakuHosei() {
    const selectedSeikaku = document.querySelector('.selected td').textContent;
    return seikakuMap.get(selectedSeikaku);
  }

  viewSeikaku();
  calc();
})();
