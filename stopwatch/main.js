(() => {
  'use strict';

  const startButton = document.querySelector('#startButton');
  const stopButton = document.querySelector('#stopButton');

  const timerDisplay = document.querySelector('#timerDisplay');

  let startTimestamp;
  let counter = 0;
  let started = false;

  setInterval(() => {
    if (!started) return;
    counter = Date.now() - startTimestamp;
    displayTimer(counter);
  }, 10);

  startButton.addEventListener('click', () => {
    started = true;
    startTimestamp = Date.now();
  });

  stopButton.addEventListener('click', () => {
    started = false;
  });

  function displayTimer(time) {
    const minute = Math.floor(time / 1000);
    const ms = time - (minute * 1000);
    const msStr = String(ms).padStart(3, '0');
    timerDisplay.textContent = `${minute}:${msStr}`;
  }
})();
