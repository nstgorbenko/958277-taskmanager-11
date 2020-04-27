const addZero = (number) => String(number).padStart(2, `0`);

const EscapeKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const isEscEvent = (evt) => evt.key === EscapeKey.ESCAPE || evt.key === EscapeKey.ESC;

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${addZero(hours)}:${addZero(minutes)}`;
};

export {isEscEvent, formatTime};
