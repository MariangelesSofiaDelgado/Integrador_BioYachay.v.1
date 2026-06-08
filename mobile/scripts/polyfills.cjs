if (typeof Array.prototype.toReversed !== 'function') {
  Object.defineProperty(Array.prototype, 'toReversed', {
    value: function toReversed() {
      return this.slice().reverse();
    },
    writable: true,
    configurable: true,
  });
}

if (typeof Array.prototype.toSorted !== 'function') {
  Object.defineProperty(Array.prototype, 'toSorted', {
    value: function toSorted(compareFn) {
      return this.slice().sort(compareFn);
    },
    writable: true,
    configurable: true,
  });
}

if (typeof Array.prototype.toSpliced !== 'function') {
  Object.defineProperty(Array.prototype, 'toSpliced', {
    value: function toSpliced(start, deleteCount, ...items) {
      const copy = this.slice();
      copy.splice(start, deleteCount, ...items);
      return copy;
    },
    writable: true,
    configurable: true,
  });
}
