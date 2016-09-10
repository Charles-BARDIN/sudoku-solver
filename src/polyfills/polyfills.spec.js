const chai = require('chai');
const expect = chai.expect;

require('./polyfills');

let arr;

describe('Polyfills', () => {
  beforeEach(() => {
    arr = [];
  });

  describe('Array', () => {
    beforeEach(() => {
      arr = [1, 2, 3];
    });

    describe('remove', () => {
      it('Should have removed the item from the array', () => {
        arr.remove(1);

        expect(arr).to.have.members([2, 3]);
      });

      it('Should return the item removed in an array', () => {
        let res = arr.remove(1);

        expect(res).to.have.members([1]);
      });
    });

    describe('copy', () => {
      it('Should accept an array as a parameter', () => {
        expect(() => { Array.copy([]); }).to.not.throw();
      });

      it('Should throw an error if the parameter is not an array', () => {
        expect(() => { Array.copy(); }).to.throw(TypeError);
        expect(() => { Array.copy('1'); }).to.throw(TypeError);
        expect(() => { Array.copy(1); }).to.throw(TypeError);
        expect(() => { Array.copy({}); }).to.throw(TypeError);
        expect(() => { Array.copy(false); }).to.throw(TypeError);
      });

      it('Should return a copy of the array', () => {
        let _arr = Array.copy(arr);

        expect(_arr).to.have.members(arr);

        arr.splice(1, 1);

        expect(_arr).to.have.members([1, 2, 3]);
      });
    });
  });
});