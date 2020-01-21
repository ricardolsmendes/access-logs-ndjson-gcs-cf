'use strict';

const assert = require('assert');
const sinon = require('sinon');

const { RawToSchemaGCSFileConverter } = require('access-logs-dw-gcp-js');

const { convertRawIntoJsonLines } = require('./index');

describe('convertRawIntoJsonLines', () => {

  var jsonLinesStub;

  beforeEach(() => {
    jsonLinesStub = sinon.stub(RawToSchemaGCSFileConverter.prototype, 'jsonLines').returns(
      Promise.resolve());
  });

  it('returns a promise', () => {
    const response = convertRawIntoJsonLines({
      metageneration: '2',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    assert.strictEqual(Object.prototype.toString.call(response), '[object Promise]');
  });

  it('ignores a file that was not created, e.g. updated or deleted', () => {
    convertRawIntoJsonLines({
      metageneration: '2', // On create value is 1.
      bucket: 'testBucket',
      name: 'test.txt'
    });

    sinon.assert.notCalled(jsonLinesStub);
  });

  it('converts a file that was created', () => {
    convertRawIntoJsonLines({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const file = jsonLinesStub.getCall(0).args[0];

    assert.strictEqual(file.bucket.name, 'testBucket');
    assert.strictEqual(file.name, 'test.txt');
  });

  it('reads target bucket name from an environment variable', () => {
    process.env.TARGET_BUCKET = 'testTargetBucket';

    convertRawIntoJsonLines({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const targetBucket = jsonLinesStub.getCall(0).args[1];

    assert.strictEqual(targetBucket, 'testTargetBucket');

    delete process.env.TARGET_BUCKET;
  });

  it('reads JSON keys case from an environment variable', () => {
    process.env.JSON_KEYS_CASE = 'testSnake';

    convertRawIntoJsonLines({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const jsonKeysCase = jsonLinesStub.getCall(0).args[2];

    assert.strictEqual(jsonKeysCase, 'testSnake');

    delete process.env.JSON_KEYS_CASE;
  });

  afterEach(() => {
    jsonLinesStub.restore();
  });

});
