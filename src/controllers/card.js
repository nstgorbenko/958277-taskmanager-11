import CardComponent from "../components/card.js";
import CardEditComponent from "../components/card-edit.js";
import {isEscEvent} from "../utils/common.js";
import {render, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;
    this._cardComponent = null;
    this._cardEditComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._cardEditComponent.setSubmitHandler(() => {
      this._replaceEditToCard();
    });

    this._cardComponent.setArchiveButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isArchive: !card.isArchive,
      }));
    });

    this._cardComponent.setFavoritesButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite,
      }));
    });

    if (oldCardComponent && oldCardEditComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._cardEditComponent, oldCardEditComponent);
    } else {
      render(this._container, this._cardComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  _onEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      this._replaceEditToCard();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _replaceCardToEdit() {
    this._onViewChange();
    replace(this._cardEditComponent, this._cardComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToCard() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._cardEditComponent.reset();
    replace(this._cardComponent, this._cardEditComponent);
    this._mode = Mode.DEFAULT;
  }
}
