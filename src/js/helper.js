export function createElement(tag, className, parent, children) {
  const element = document.createElement(tag);
  element.classList.add(className);
  parent.append(element);

  if (children) {
    element.append(children);
  }

  return element;
}
