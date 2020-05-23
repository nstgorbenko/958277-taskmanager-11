export const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

export const COLORS = Object.values(Color);

export const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

export const EmptyCard = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: Color.BLACK,
  isFavorite: false,
  isArchive: false,
};

export const FilterType = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

export const MenuItem = {
  NEW_CARD: `control__new-task`,
  STATISTICS: `control__statistic`,
  CARDS: `control__task`,
};

export const Message = {
  NO_CARDS: `Click «ADD NEW TASK» in menu to create your first task`,
  LOADING: `Loading...`
};

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};
