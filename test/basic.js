'use strict';

const chai = require('chai');
const schema = require('duh-schema');
const Ajv = require('ajv');

const lib = require('../index.js');

const expect = chai.expect;

describe('basic', () => {
  it('access', done => {
    expect(lib).to.be.a('object');
    expect(Object.keys(lib).length).eq(4);
    done();
  });
  it('schema', () => {
    const validate = new Ajv({ strict: false }).compile(schema.root);
    const failures = [];

    Object.keys(lib).forEach(vendor => {
      Object.keys(lib[vendor]).forEach(library => {
        Object.keys(lib[vendor][library]).forEach(name => {
          Object.keys(lib[vendor][library][name]).forEach(version => {
            const o4 = lib[vendor][library][name][version];
            if (!validate(o4)) {
              failures.push(
                vendor + ':' + library + ':' + name + ':' + version,
                ...validate.errors.map(e =>
                  '  ' + (e.keyword + ' at ' + (e.instancePath || '/'))
                  + ': ' + e.message
                  + (e.params && e.params.missingProperty
                    ? ' (missing: ' + e.params.missingProperty + ')'
                    : '')
                )
              );
            }
          });
        });
      });
    });

    expect(failures, failures.length + ' schema violation(s):\n' + failures.join('\n'))
      .to.eql([]);
  });
});

/* eslint-env mocha */
