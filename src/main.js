import BoardComponent from "./components/board.js";
import CardEditComponent from "./components/card-edit.js";
import CardComponent from "./components/card.js";
import CardsComponent from "./components/cards.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import MenuComponent from "./components/menu.js";
import SortComponent from "./components/sort.js";
import {generateCards} from "./mock/card.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils.js";

const CARD_COUNT = 22;
const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCard = (cardListElement, card) => {
  const onEditButtonClick = () => {
    cardListElement.replaceChild(cardEditComponent.getElement(), cardComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    cardListElement.replaceChild(cardComponent.getElement(), cardEditComponent.getElement());
  };

  const cardComponent = new CardComponent(card);
  const editButton = cardComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const cardEditComponent = new CardEditComponent(card);
  const editForm = cardEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  render(cardListElement, cardComponent.getElement());
};

const renderBoard = (boardComponent, cards) => {
  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new CardsComponent().getElement());

  const cardListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

  cards
  .slice(0, showingCardsCount)
  .forEach((card) => renderCard(cardListElement, card));

  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  if (cards.length > SHOWING_CARDS_COUNT_ON_START) {
    render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

    loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
      const prevCardsCount = showingCardsCount;
      showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

      cards
      .slice(prevCardsCount, showingCardsCount)
      .forEach((card) => renderCard(cardListElement, card));

      if (showingCardsCount >= cards.length) {
        loadMoreButtonComponent.getElement().remove();
        loadMoreButtonComponent.removeElement();
      }
    });
  }
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const cards = generateCards(CARD_COUNT);
const cardsToShow = cards.filter((it) => !it.isArchive);
const filters = generateFilters(cards);

render(siteHeaderElement, new MenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, cardsToShow);
