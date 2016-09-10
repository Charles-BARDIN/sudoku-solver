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
  if(!(array instanceof Array)) {
    throw new TypeError('Array.copy accepts an array as parameter');
  }

  return array.slice();
};