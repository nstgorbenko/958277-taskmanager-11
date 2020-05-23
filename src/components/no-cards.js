import AbstractComponent from "./abstract-component.js";

const createNoCardsTemplate = (message) => {
  return (
    `<p class="board__no-tasks">
      ${message}
    </p>`
  );
};

export default class NoCards extends AbstractComponent {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createNoCardsTemplate(this._message);
  }
}
