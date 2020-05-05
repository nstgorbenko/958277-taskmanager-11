import moment from "moment";

const KeyboardKey = {
  ESCAPE: `Escape`,
  ESC: `Esc`
};

export const isEscEvent = ({key}) => key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;

export const formatDate = (date) => moment(date).format(`D MMMM`);

export const formatTime = (date) => moment(date).format(`HH:mm`);
