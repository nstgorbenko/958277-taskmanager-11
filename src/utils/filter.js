import {isRepeating, isOneDay, isOverdueDate} from "./common.js";
import {FilterType} from "../const.js";


export const getArchiveCards = (cards) => {
  return cards.filter((card) => card.isArchive);
};

export const getNotArchiveCards = (cards) => {
  return cards.filter((card) => !card.isArchive);
};

export const getFavoriteCards = (cards) => {
  return cards.filter((card) => card.isFavorite);
};

export const getOverdueCards = (cards, date) => {
  return cards.filter((card) => {
    const dueDate = card.dueDate;

    if (!dueDate) {
      return false;
    }

    return isOverdueDate(dueDate, date);
  });
};

export const getRepeatingCards = (cards) => {
  return cards.filter((card) => isRepeating(card.repeatingDays));
};

export const getCardsInOneDay = (cards, date) => {
  return cards.filter((card) => isOneDay(card.dueDate, date));
};

export const getCardsByFilter = (cards, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.ALL:
      return getNotArchiveCards(cards);
    case FilterType.ARCHIVE:
      return getArchiveCards(cards);
    case FilterType.FAVORITES:
      return getFavoriteCards(getNotArchiveCards(cards));
    case FilterType.OVERDUE:
      return getOverdueCards(getNotArchiveCards(cards), nowDate);
    case FilterType.REPEATING:
      return getRepeatingCards(getNotArchiveCards(cards));
    case FilterType.TODAY:
      return getCardsInOneDay(getNotArchiveCards(cards), nowDate);
  }

  return cards;
};
