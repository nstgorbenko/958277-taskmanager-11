import {createElement} from "../utils.js";

const createCardsTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Cards {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
