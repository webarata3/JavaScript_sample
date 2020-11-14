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

  document.querySelector('#nature tbody').addEventListener('click', event => {
    document.querySelector('.selected').classList.remove('selected');
    const trElm = event.target.parentNode;
    trElm.classList.add('selected');
    calc();
  });

  const natures = [
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
  const natureMap = new Map();
  for (const nature of natures) {
    natureMap.set(nature[0], {
      name: nature[0],
      attack: nature[1],
      defence: nature[2],
      spAttack: nature[3],
      spDefence: nature[4],
      speed: nature[5]
    });
  }

  function viewNature() {
    const tbodyElm = document.querySelector('#nature tbody');
    for (const nature of natures) {
      tbodyElm.insertAdjacentHTML('beforeend', `<tr>
       <td>${nature[0]}</td>
       ${viewNatureUpDown(nature[1])}
       ${viewNatureUpDown(nature[2])}
       ${viewNatureUpDown(nature[3])}
       ${viewNatureUpDown(nature[4])}
       ${viewNatureUpDown(nature[5])}
      </tr>`);
    }
    document.querySelector('#nature tbody tr').classList.add('selected');
  }

  function viewNatureUpDown(updown) {
    if (updown === 1) return '<td class="up">UP</td>';
    if (updown === 2) return '<td class="down">DOWN</td>';
    return '<td>-</td>';
  }

  function calc() {
    const natureHosei = getNatureHosei();
    const tbodyElm = document.querySelector('#status tbody');
    tbodyElm.innerHTML = '';
    const shuzoku = getStatus();
    for (let kotai = 0; kotai <= 31; kotai++) {
      const hp = calcHp(shuzoku.lv, shuzoku.hp, kotai);
      const attack = calcABCDS(shuzoku.lv, shuzoku.attack, kotai, HOSEI[natureHosei.attack]);
      const defence = calcABCDS(shuzoku.lv, shuzoku.defnece, kotai, HOSEI[natureHosei.defence]);
      const spAttack = calcABCDS(shuzoku.lv, shuzoku.spAttack, kotai, HOSEI[natureHosei.spAttack]);
      const spDefence = calcABCDS(shuzoku.lv, shuzoku.spDefence, kotai, HOSEI[natureHosei.spDefence]);
      const speed = calcABCDS(shuzoku.lv, shuzoku.speed, kotai, HOSEI[natureHosei.speed]);
      tbodyElm.insertAdjacentHTML('beforeend', `<tr>
       <td>${kotai}</td>
       <td>${hp}</td>
       <td${viewNatureUpDownClass(natureHosei.attack)}>${attack}</td>
       <td${viewNatureUpDownClass(natureHosei.defence)}>${defence}</td>
       <td${viewNatureUpDownClass(natureHosei.spAttack)}>${spAttack}</td>
       <td${viewNatureUpDownClass(natureHosei.spDefence)}>${spDefence}</td>
       <td${viewNatureUpDownClass(natureHosei.speed)}>${speed}</td>
      </tr>`)
    }
  }

  function viewNatureUpDownClass(updown) {
    if (updown === 1) return ' class="up"';
    if (updown === 2) return ' class="down"';
    return '';
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

  function calcABCDS(lv, shuzoku, kotai, natureHosei) {
    return Math.floor((Math.floor((shuzoku * 2 + kotai) * lv / 100) + 5) * natureHosei);
  }

  function getNatureHosei() {
    const selectedNature = document.querySelector('.selected td').textContent;
    return natureMap.get(selectedNature);
  }

  viewNature();
  calc();
})();
