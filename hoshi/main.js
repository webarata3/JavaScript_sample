(() => {
  'use strict';

  const messageElm = document.querySelector('#message');
  const rateElm = document.querySelector('#rate');
  const addButtonElm = document.querySelector('#addButton');
  const ratesElm = document.querySelector('#rates');
  document.querySelectorAll('#shortcut button').forEach(buttonElm => {
    buttonElm.addEventListener('click', () => {
      const rate = buttonElm.dataset.rate;
      values.push(parseInt(rate, 10));
      viewValues();
    });
  });

  const values = [];

  const addRate = () => {
    const errorMessage = checkRate(rateElm.value);
    if (errorMessage !== null) {
      messageElm.textContent = errorMessage;
      return;
    }
    messageElm.textContent = '1～100までの耐性を入力してください。';

    values.push(parseInt(rateElm.value, 10));
    viewValues();
  };

  const checkRate = rate => {
    if (!isNumber(rate)) {
      return '数字のみ入力してください。';
    }
    const num = parseInt(rate, 10);
    if (num < 1 || num > 100) {
      return '1～100までの数値で入力してください。'
    }
    return null;
  };

  const regexp = new RegExp(/^[+-]?([1-9]\d*|0)$/);
  const isNumber = value => regexp.test(value);

  rateElm.addEventListener('keypress', event => {
    if (event.keyCode === 13) addRate;
  });
  addButtonElm.addEventListener('click', addRate);

  const viewValues = () => {
    ratesElm.innerHTML = `
    <table class="resist">
     <thead>
      <tr>
       <th>耐性</th>
       <th class="total">トータルの<br>耐性</th>
       <th>減少率</th>
       <th></th>
      </tr>
     </thead>
     <tbody>
     </tbody>
    </table>`;
    const tbodyElm = ratesElm.querySelector('tbody');
    values.sort((a, b) => b - a);
    let currentRate = 100;
    for (let i = 0; i < values.length; i++) {
      let r = currentRate * (values[i] / 100);
      if (r < 1) {
        r = 1;
      } else {
        r = Math.floor(r);
      }
      currentRate = currentRate - r;
      if (currentRate < 0) {
        currentRate = 0;
      }

      tbodyElm.insertAdjacentHTML('beforeend', `<tr><td class="number">${values[i]}%</td> <td class="total number">${currentRate}%</td><td class="number">${r}%</td><td><button data-index="${i}">削除</tr>`);
    }
    tbodyElm.querySelectorAll('button').forEach(buttonElm => {
      buttonElm.addEventListener('click', () => {
        values.splice(buttonElm.dataset.index, 1);
        viewValues();
      });
    });
  };
})();
