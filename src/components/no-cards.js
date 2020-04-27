import AbstractComponent from "./abstract-component.js";

const createNoCardsTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Click «ADD NEW TASK» in menu to create your first task
    </p>`
  );
};

export default class NoCards extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}
