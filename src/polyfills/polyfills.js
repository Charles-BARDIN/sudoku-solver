Array.prototype.remove = function (item) {
  if (item == null) {
    return;
  }

  let index = this.indexOf(item);

  if (index === -1) {
    return;
  }

  return this.splice(index, 1);
};

Array.copy = function (array) {
  return array.slice();
};