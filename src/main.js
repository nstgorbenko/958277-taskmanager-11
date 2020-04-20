import {createBoardTemplate} from "./components/board.js";
import {createCardEditTemplate} from "./components/card-edit.js";
import {createCardTemplate} from "./components/card.js";
import {createFilterTemplate} from "./components/filter.js";
import {createLoadMoreButton} from "./components/load-more-button.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortingTemplate} from "./components/sorting.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/filter.js";

const TASK_COUNT = 22;
const SHOWING_TASK_COUNT_ON_START = 8;
const SHOWING_TASK_COUNT_BY_BUTTON = 8;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);

const cards = generateCards(TASK_COUNT);
const cardsToShow = cards.filter((it) => !it.isArchive);
const filters = generateFilters(cards);

render(siteMenuElement, createMenuTemplate());
render(siteMainElement, createFilterTemplate(filters));
render(siteMainElement, createBoardTemplate());

const siteBoardElement = siteMainElement.querySelector(`.board`);
render(siteBoardElement, createSortingTemplate(), `afterbegin`);

const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);
render(siteTaskListElement, createCardEditTemplate(cardsToShow[0]));

let showingTaskCount = SHOWING_TASK_COUNT_ON_START;

cardsToShow
.slice(1, showingTaskCount)
.forEach((task) => render(siteTaskListElement, createCardTemplate(task)));

render(siteBoardElement, createLoadMoreButton());

const loadMoreButton = siteBoardElement.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTaskCount;
  showingTaskCount += SHOWING_TASK_COUNT_BY_BUTTON;

  cardsToShow
  .slice(prevTasksCount, showingTaskCount)
  .forEach((task) => {
    render(siteTaskListElement, createCardTemplate(task));
  });

  if (showingTaskCount >= cardsToShow.length) {
    loadMoreButton.remove();
  }
});
