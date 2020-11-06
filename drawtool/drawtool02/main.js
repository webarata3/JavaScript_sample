(() => {
  'use strict';

  class MousePosition {
    #observers = [];
    #dragging = false;
    #position = {
      begin: {
        x: null,
        y: null
      },
      end: {
        x: null,
        y: null
      }
    };

    constructor() {
    }

    addObserver(observer) {
      this.#observers.push(observer);
    }

    beginDrag(x, y) {
      this.#dragging = true;
      this.#changePosition(x, y);
    }

    endDrag() {
      this.#dragging = false;
      this.#clearPosition();
    }

    move(x, y) {
      if (!this.#dragging) return;
      this.#changePosition(x, y);
      this.#notifyUpdate();
    }

    get linePosition() {
      return this.#position;
    }

    #changePosition(x, y) {
      this.#position.end.x = this.#position.begin.x;
      this.#position.end.y = this.#position.begin.y;

      this.#position.begin.x = x;
      this.#position.begin.y = y;
    }

    #clearPosition() {
      this.#position.begin.x = null;
      this.#position.begin.y = null;
      this.#position.end.x = null;
      this.#position.end.y = null;
    }

    #notifyUpdate() {
      this.#observers.forEach(observer => observer.update());
    }
  }

  class Draw {
    #canvasElm;
    #ctx;
    #mousePosition;
    constructor(canvasElmSelector, mousePosition) {
      this.#canvasElm = document.querySelector(canvasElmSelector);
      this.#ctx = this.#canvasElm.getContext('2d');
      this.#mousePosition = mousePosition;

      this.#setEvent();
    }

    #setEvent() {
      this.#canvasElm.addEventListener('mousedown', event => {
        this.#mousePosition.beginDrag(event.offsetX, event.offsetY);
      });
      this.#canvasElm.addEventListener('mouseup', event => {
        this.#mousePosition.endDrag();
      });
      this.#canvasElm.addEventListener('mousemove', event => {
        this.#mousePosition.move(event.offsetX, event.offsetY);
      });
    }

    update() {
      const position = this.#mousePosition.linePosition;
      console.log(position.begin, position.end);

      this.#ctx.lineWidth = 10;
      this.#ctx.lineCap = 'round';
      this.#ctx.beginPath();
      this.#ctx.moveTo(position.begin.x, position.begin.y);
      this.#ctx.lineTo(position.end.x, position.end.y);
      this.#ctx.stroke();
    }
  }

  const mousePosition = new MousePosition();
  const draw = new Draw('canvas', mousePosition);
  mousePosition.addObserver(draw);

  document.querySelector('button').addEventListener('click', () => {
    const downloadLink = document.createElement('a');
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.download = 'image.png';
    downloadLink.click();
    downloadLink.remove();
  });
})();
