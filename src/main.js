import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import CardsModel from "./models/cards.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import {generateCards} from "./mock/card.js";
import {MenuItem} from "./const.js";
import {render} from "./utils/render.js";

const CARD_COUNT = 22;
const cards = generateCards(CARD_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
render(siteHeaderElement, menuComponent);

const cardsModel = new CardsModel();
cardsModel.setCards(cards);

const filterController = new FilterController(siteMainElement, cardsModel);
filterController.render();

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent);

const boardController = new BoardController(boardComponent, cardsModel);
boardController.render();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_CARD:
      menuComponent.setActiveItem(MenuItem.CARDS);
      boardController.createCard();
      break;
  }
});
