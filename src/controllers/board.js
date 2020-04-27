import CardEditComponent from "../components/card-edit.js";
import CardComponent from "../components/card.js";
import CardsComponent from "../components/cards.js";
import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoCardsComponent from "../components/no-cards.js";
import SortComponent from "../components/sort.js";
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

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noCardsComponent = new NoCardsComponent();
    this._sortComponent = new SortComponent();
    this._cardsComponent = new CardsComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  render(cards) {
    const container = this._container.getElement();

    if (cards.length === 0) {
      render(container, this._noCardsComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._cardsComponent);

    const cardListElement = this._cardsComponent.getElement();

    let showingCardsCount = SHOWING_CARDS_COUNT_ON_START;

    cards
    .slice(0, showingCardsCount)
    .forEach((card) => renderCard(cardListElement, card));

    if (cards.length > SHOWING_CARDS_COUNT_ON_START) {
      render(container, this._loadMoreButtonComponent);

      this._loadMoreButtonComponent.setClickHandler(() => {
        const prevCardsCount = showingCardsCount;
        showingCardsCount += SHOWING_CARDS_COUNT_BY_BUTTON;

        cards
        .slice(prevCardsCount, showingCardsCount)
        .forEach((card) => renderCard(cardListElement, card));

        if (showingCardsCount >= cards.length) {
          remove(this._loadMoreButtonComponent);
        }
      });
    }
  }
}
