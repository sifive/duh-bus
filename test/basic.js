'use strict';

const chai = require('chai');
const schema = require('duh-schema');
const Ajv = require('ajv');

const lib = require('../index.js');

const expect = chai.expect;

describe('basic', () => {
  it('access', done => {
    expect(lib).to.be.a('object');
    expect(Object.keys(lib).length).eq(3);
    done();
  });
  it('schema', done => {
    const ajv = new Ajv;
    const validate = ajv
      .addSchema(schema.defs)
      .compile(schema.any);

    Object.keys(lib).map(vendor => {
      const o1 = lib[vendor];
      Object.keys(o1).map(library => {
        const o2 = o1[library];
        Object.keys(o2).map(name => {
          const o3 = o2[name];
          Object.keys(o3).map(version => {
            const o4 = o3[version];
            if (!validate(o4)) console.log(
              vendor, library, name, version,
              o4,
              validate.errors
            );
          });
        });
      });
    });
    done();
  });
});

/* eslint-env mocha */
