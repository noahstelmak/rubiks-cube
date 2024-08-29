const viewHeight = document.scrollingElement.scrollHeight;

const size = Math.floor(viewHeight / Math.sqrt(3));

const ssize = Math.floor(size / 3);

export { size, ssize }; 