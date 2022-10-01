var assert = require('assert'); //link in assertion library
var http = require("http");

describe('Tests for function one', () => { // test
    describe('Test Case 1 #fnOne()',() => { // test case #1
        it('should return -1 when the value is not present', () => {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
    describe('Test Case #fnOne()', () => { // test case #2
        it('should return 3 as the value is present', () => {
            assert.equal([1,2,3,4,5].indexOf(4), 3);
        });
    });
});












