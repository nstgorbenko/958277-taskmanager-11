const addZero = (number) => String(number).padStart(2, `0`);

const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return `${addZero(hours)}:${addZero(minutes)}`;
};

const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const render = (container, element, place) => {
  if (place === `afterbegin`) {
    container.prepend(element);
  } else {
    container.append(element);
  }
};

export {createElement, formatTime, render};
