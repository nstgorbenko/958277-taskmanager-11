import CardsComponent from "../components/cards.js";
import CardController from "./card.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoCardsComponent from "../components/no-cards.js";
import SortComponent, {SortType} from "../components/sort.js";
import {remove, render} from "../utils/render.js";

const SHOWING_CARDS_COUNT_ON_START = 8;
const SHOWING_CARDS_COUNT_BY_BUTTON = 8;

const renderCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardListElement, onDataChange, onViewChange);
    cardController.render(card);

    return cardController;
  });
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

    this._cards = [];
    this._showedCardControllers = [];
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;

    const container = this._container.getElement();

    if (this._cards.length === 0) {
      render(container, this._noCardsComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._cardsComponent);

    const cardListElement = this._cardsComponent.getElement();
    const newCards = renderCards(cardListElement, this._cards.slice(0, this._showingCardsCount), this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    const container = this._container.getElement();

    if (this._cards.length > this._showingCardsCount) {
      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevCardsCount = this._showingCardsCount;
        this._showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

        const cardListElement = this._cardsComponent.getElement();

        const sortedCards = getSortedCards(this._cards, this._sortComponent.getSortType(), prevCardsCount, this._showingCardsCount);
        const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);
        this._showedCardControllers = this._showedCardControllers.concat(newCards);

        if (this._showingCardsCount >= this._cards.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));

    cardController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const cardListElement = this._cardsComponent.getElement();
    this._showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    cardListElement.innerHTML = ``;
    const sortedCards = getSortedCards(this._cards, sortType, 0, this._showingCardsCount);
    const newCards = renderCards(cardListElement, sortedCards, this._onDataChange, this._onViewChange);

    this._showedCardControllers = newCards;
    this._renderLoadMoreButton();
  }
}
