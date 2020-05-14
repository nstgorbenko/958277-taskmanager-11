import moment from "moment";

const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const formatDate = (date) => moment(date).format(`D MMMM`);

export const formatTime = (date) => moment(date).format(`HH:mm`);

export const isEscEvent = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;

export const isOneDay = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `days`) === 0 && dateA.getDate() === dateB.getDate();
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isOneDay(date, dueDate);
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};

