import {FILTER_NAMES} from "../const.js";

const generateFiltersCount = (cards) => {
  return {
    all: cards.filter((it) => !it.isArchive).length,
    overdue: cards.filter((it) => it.dueDate instanceof Date && it.dueDate < Date.now()).length,
    today: cards.filter((it) => it.dueDate instanceof Date ? it.dueDate.toDateString() === new Date().toDateString() : false).length,
    favorites: cards.filter((it) => it.isFavorite).length,
    repeating: cards.filter((it) => Object.values(it.repeatingDays).some(Boolean)).length,
    archive: cards.filter((it) => it.isArchive).length,
  };
};

const generateFilters = (cards) => {
  return FILTER_NAMES.map((it) => {
    return {
      name: it,
      count: generateFiltersCount(cards)[it],
    };
  });
};

export {generateFilters};
