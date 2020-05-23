import API from "./api.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import CardsModel from "./models/cards.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import {MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import {setEndDate} from "./utils/common.js";

const AUTHORIZATION = `Basic jzkskbfjkse6788gisnfkj=`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;

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

const api = new API(END_POINT, AUTHORIZATION);

const cardsModel = new CardsModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
const statisticsComponent = new StatisticsComponent({cards: cardsModel, dateFrom, dateTo});
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, cardsModel, api);
const filterController = new FilterController(siteMainElement, cardsModel);

render(siteHeaderElement, menuComponent);
filterController.render();
render(siteMainElement, boardComponent);
render(siteMainElement, statisticsComponent);
statisticsComponent.hide();
boardController.showLoadingMessage();

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

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    boardController.render();
  })
  .catch((err) => {
    boardController.showNoCardsMessage();
    throw err;
  });
