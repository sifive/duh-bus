'use strict';

const chai = require('chai');
const lib = require('../index.js');

const expect = chai.expect;

describe('basic', () => {
  it('access', done => {
    expect(lib).to.be.a('object');
    done();
  });
});

/* eslint-env mocha */
