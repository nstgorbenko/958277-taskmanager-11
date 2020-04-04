import {createBoardTemplate} from "./components/board.js";
import {createCardFormTemplate} from "./components/card-form.js";
import {createCardTemplate} from "./components/card.js";
import {createFilterTemplate} from "./components/filter.js";
import {createLoadMoreButton} from "./components/load-more-button.js";
import {createMenuTemplate} from "./components/menu.js";
import {createSortingTemplate} from "./components/sorting.js";

const TASK_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteMenuElement = siteMainElement.querySelector(`.main__control`);

render(siteMenuElement, createMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const siteBoardElement = siteMainElement.querySelector(`.board`);
render(siteBoardElement, createSortingTemplate(), `afterbegin`);

const siteTaskListElement = siteBoardElement.querySelector(`.board__tasks`);
render(siteTaskListElement, createCardFormTemplate());

for (let i = 0; i < TASK_COUNT; i++) {
  render(siteTaskListElement, createCardTemplate());
}

render(siteBoardElement, createLoadMoreButton());
