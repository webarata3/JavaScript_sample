(() => {
  'use strict';

  let dragging = false;
  let beforeX = null;
  let beforeY = null;
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  canvas.addEventListener('mousedown', event => {
    dragging = true;
    changeCoordinate(event.offsetX, event.offsetY);
  });
  canvas.addEventListener('mouseup', event => {
    dragging = false;
    removeCoordinate();
  });
  canvas.addEventListener('mousemove', event => {
    if (!dragging) return;
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(beforeX, beforeY);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    changeCoordinate(event.offsetX, event.offsetY);
  });
  function changeCoordinate(x, y) {
    [beforeX, beforeY] = [x, y];
  }
  function removeCoordinate() {
    changeCoordinate(null, null);
  }

  document.querySelector('button').addEventListener('click', () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'image.png';
    downloadLink.click();
    downloadLink.remove();
  });
})();
