import AbstractComponent from "./abstract-component.js";

const createCardsTemplate = () => {
  return (
    `<div class="board__tasks"></div>`
  );
};

export default class Cards extends AbstractComponent {
  getTemplate() {
    return createCardsTemplate();
  }
}
