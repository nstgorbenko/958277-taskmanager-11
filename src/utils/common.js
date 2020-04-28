const addZero = (number) => String(number).padStart(2, `0`);

const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

const isEscEvent = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${addZero(hours)}:${addZero(minutes)}`;
};

export {isEscEvent, formatTime};
