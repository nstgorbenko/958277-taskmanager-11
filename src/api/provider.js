import Card from "../models/card";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedCards = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    if (isOnline()) {
      return this._api.getCards()
        .then((cards) => {
          const items = createStoreStructure(cards.map((card) => card.toRAW()));
          this._store.setItems(items);

          return cards;
        });
    }

    const storeCards = Object.values(this._store.getItems());
    return Promise.resolve(Card.parseCards(storeCards));
  }

  createCard(card) {
    if (isOnline()) {
      return this._api.createCard(card)
        .then((newCard) => {
          this._store.setItem(newCard.id, newCard.toRAW());

          return newCard;
        });
    }

    const localNewCardId = nanoid();
    const localNewCard = Card.clone(Object.assign(card, {id: localNewCardId}));
    this._store.setItem(localNewCard.id, localNewCard.toRAW());

    return Promise.resolve(localNewCard);
  }

  updateCard(id, card) {
    if (isOnline()) {
      return this._api.updateCard(id, card)
        .then((newCard) => {
          this._store.setItem(newCard.id, newCard.toRAW());
          return newCard;
        });
    }

    const localCard = Card.clone(Object.assign(card, {id}));
    this._store.setItem(id, localCard.toRAW());

    return Promise.resolve(localCard);
  }

  deleteCard(id) {
    if (isOnline()) {
      return this._api.deleteCard(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storeCards = Object.values(this._store.getItems());

      return this._api.sync(storeCards)
        .then((response) => {
          const createdCards = getSyncedCards(response.created);
          const updatedCards = getSyncedCards(response.updated);
          const items = createStoreStructure([...createdCards, ...updatedCards]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
