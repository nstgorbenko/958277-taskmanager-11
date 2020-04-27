import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterComponent from "./components/filter.js";
import MenuComponent from "./components/menu.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils/render.js";

const CARD_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const cards = generateCards(CARD_COUNT);
const cardsToShow = cards.filter((it) => !it.isArchive);
const filters = generateFilters(cards);

render(siteHeaderElement, new MenuComponent());
render(siteMainElement, new FilterComponent(filters));

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent);
boardController.render(cardsToShow);
