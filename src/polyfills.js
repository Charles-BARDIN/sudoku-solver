if (!Array.prototype.remove) {
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
}

if (!Array.copy) {
  Array.copy = function (array) {
    return array.slice();
  };
}