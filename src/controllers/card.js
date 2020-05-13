import CardComponent from "../components/card.js";
import CardEditComponent from "../components/card-edit.js";
import {EmptyCard, Mode} from "../const.js";
import {isEscEvent} from "../utils/common.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

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

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardEditComponent = this._cardEditComponent;
    this._mode = mode;

    this._cardComponent = new CardComponent(card);
    this._cardEditComponent = new CardEditComponent(card);

    this._cardComponent.setEditButtonClickHandler(() => {
      this._replaceCardToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
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

    this._cardEditComponent.setSubmitHandler(() => {
      const data = this._cardEditComponent.getData();
      this._onDataChange(this, card, data);
    });

    this._cardEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, card, null));

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardEditComponent && oldCardComponent) {
          replace(this._cardComponent, oldCardComponent);
          replace(this._cardEditComponent, oldCardEditComponent);
          remove(oldCardComponent);
          remove(oldCardEditComponent);
          this._replaceEditToCard();
        } else {
          render(this._container, this._cardComponent);
        }
        break;
      case Mode.ADDING:
        this._onViewChange();
        if (oldCardEditComponent && oldCardComponent) {
          remove(oldCardComponent);
          remove(oldCardEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._cardEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToCard();
    }
  }

  destroy() {
    remove(this._cardEditComponent);
    remove(this._cardComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _onEscKeyDown(evt) {
    if (isEscEvent(evt)) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyCard, null);
      }
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

    if (document.contains(this._cardEditComponent.getElement())) {
      replace(this._cardComponent, this._cardEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }
}
