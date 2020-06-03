import API from "./api/index.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import CardsModel from "./models/cards.js";
import FilterController from "./controllers/filter.js";
import MenuComponent from "./components/menu.js";
import Provider from "./api/provider.js";
import StatisticsComponent from "./components/statistics.js";
import Store from "./api/store.js";
import {MenuItem} from "./const.js";
import {render} from "./utils/render.js";
import {setEndDate} from "./utils/common.js";

const AUTHORIZATION = `Basic jzkskbfjkse6788gisnfkj=`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager`;
const STORE_PREFIX = `taskmanager-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

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
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const cardsModel = new CardsModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const menuComponent = new MenuComponent();
const statisticsComponent = new StatisticsComponent({cards: cardsModel, dateFrom, dateTo});
const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, cardsModel, apiWithProvider);
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

apiWithProvider.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);
    boardController.render();
  })
  .catch((err) => {
    boardController.showNoCardsMessage();
    throw err;
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
