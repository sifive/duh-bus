'use strict';

const chai = require('chai');
const lib = require('../index.js');

const expect = chai.expect;

describe('basic', () => {
  it('access', done => {
    expect(lib).to.be.a('object');
    expect(Object.keys(lib).length).eq(3);
    done();
  });
});

/* eslint-env mocha */
