const assign = require('chai').assign;

const Grid = require('./grid');
const Cell = require('../cell/cell');

describe('Class: Grid', () => {
    describe('Methods', () => {
        describe('assignValue', () => {
            it('Should call eliminateValuesFromCell', () => {

            });
        });

        describe('eliminateValuesFromCell', () => {
            it('Should call the eliminatePossibleValue method of the cell', () => {

            });

            it('Should call the isSolved method of the cell', () => {

            });

            it('Should call eliminateValueFromSiblings if the isSolved method of the cell returned true', () => {

            });

            it('Should call checkIfSiblingsAcceptValue', () => {

            });

            it('Should return false if it encounter any inconsistency', () => {

            });

            it('Should return true and have removed the values from the cell\'s possible values if it does not encounter any inconsistency', () => {

            });
        });

        describe('eliminateValueFromSiblings', () => {
            it('Should call getSiblings', () => {

            });

            it('Should call the eliminatePossibleValue method of every sibling', () => {

            });

            it('Should have eliminated the value from all the siblings', () => {

            });

            it('Should return false if it encounters any inconsistency', () => {

            });

            it('Should return true if it does not encounter any inconsistency', () => {

            });
        });

        describe('checkIfSiblingsAcceptValue', () => {
            it('Should call getSiblings', () => {

            });

            it('Should call the acceptsValue method of every sibling', () => {

            });

            it('Should call assignValue if only one sibling accepts the value', () => {

            });

            it('Should return false if it encounters any inconsistency', () => {

            });

            it('Should return true if it does not encounter any inconsistency', () => {

            });
        });

        describe('getSiblings', () => {
            it('Should call getRow', () => {

            });

            it('Should call getColumn', () => {

            });

            it('Should call getSquare', () => {

            });

            it('Should return an array of 20 cells', () => {

            });
        });

        describe('getRow', () => {
            it('Should return an array of 8 cells', () => {

            });
        });

        describe('getColumn', () => {
            it('Should return an array of 8 cells', () => {

            });
        });

        describe('getSquare', () => {
            it('Should return an array of 8 cells', () => {

            });
        });
    });
});