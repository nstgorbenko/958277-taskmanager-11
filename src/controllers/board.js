import CardEditComponent from "../components/card-edit.js";
import CardComponent from "../components/card.js";
import CardsComponent from "../components/cards.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoCardsComponent from "../components/no-cards.js";
import SortComponent, {SortType} from "../components/sort.js";
import {isEscEvent} from "../utils/common.js";
import {remove, render, replace} from "../utils/render.js";

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCard = (cardListElement, card) => {
  const replaceCardToEdit = () => replace(cardEditComponent, cardComponent);
  const replaceEditToCard = () => replace(cardComponent, cardEditComponent);
  const onEscKeyDown = (evt) => {
    if (isEscEvent(evt)) {
      replaceEditToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const cardComponent = new CardComponent(card);
  const cardEditComponent = new CardEditComponent(card);

  cardComponent.setEditButtonClickHandler(() => {
    replaceCardToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  cardEditComponent.setSubmitHandler(() => {
    replaceEditToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(cardListElement, cardComponent);
};

const renderCards = (cardListElement, cards) => {
  cards.forEach((card) =>
    renderCard(cardListElement, card));
};

const getSortedCards = (cards, sortType, from, to) => {
  let sortedCards = [];
  const showingCards = cards.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedCards = showingCards.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedCards = showingCards.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedCards = showingCards;
      break;
  }

  return sortedCards.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(cards) {
    const renderLoadMoreButton = () => {
      if (cards.length > SHOWING_CARDS_COUNT_ON_START) {
        render(container, this._loadMoreButtonComponent);

        this._loadMoreButtonComponent.setClickHandler(() => {
          const prevCardsCount = showingCardsCount;
          showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

          const sortedCards = getSortedCards(cards, this._sortComponent.getSortType(), prevCardsCount, showingCardsCount);
          renderCards(cardListElement, sortedCards);

          if (showingCardsCount >= cards.length) {
            remove(this._loadMoreButtonComponent);
          }
        });
      }
    };

    const container = this._container.getElement();

    if (cards.length === 0) {
      render(container, this._noCardsComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._cardsComponent);

    const cardListElement = this._cardsComponent.getElement();
    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    renderCards(cardListElement, cards.slice(0, showingCardsCount));
    renderLoadMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      cardListElement.innerHTML = ``;
      showingCardsCount = SHOWING_CARDS_COUNT_ON_START;
      const sortedCards = getSortedCards(cards, sortType, 0, showingCardsCount);

      renderCards(cardListElement, sortedCards);
      renderLoadMoreButton();
    });
  }
}
