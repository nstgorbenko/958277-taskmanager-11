import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import CardsModel from "./models/cards.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import {generateCards} from "./mock/card.js";
import {MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import {setEndDate} from "./utils/common.js";

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

const dateTo = (() => {
  const date = new Date();
  setEndDate(date);
  return date;
})();

const dateFrom = (() => {
  const date = new Date(dateTo);
  date.setDate(date.getDate() - 6);
  return date;
})();

const statisticsComponent = new StatisticsComponent({cards: cardsModel, dateFrom, dateTo});
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_CARD:
      menuComponent.setActiveItem(MenuItem.CARDS);
      statisticsComponent.hide();
      boardController.show();
      boardController.createCard();
      break;

    case MenuItem.STATISTICS:
      boardController.resetToDefault();
      boardController.hide();
      statisticsComponent.show();
      break;

    case MenuItem.CARDS:
      statisticsComponent.hide();
      boardController.show();
      break;
  }
});
