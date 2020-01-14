'use strict';

const assert = require('assert');
const sinon = require('sinon');

const { RawToNDJsonGCSFileConverter } = require('access-logs-dw-gcp-js');

const { convertRawIntoNDJson } = require('./index');

describe('convertRawIntoNDJson', () => {

  var convertStub;

  beforeEach(() => {
    convertStub = sinon.stub(RawToNDJsonGCSFileConverter.prototype, 'convert').returns(
      Promise.resolve());
  });

  it('returns a promise', () => {
    const response = convertRawIntoNDJson({
      metageneration: '2',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    assert.strictEqual(Object.prototype.toString.call(response), '[object Promise]');
  });

  it('ignores a file that was not created, e.g. updated or deleted', async () => {
    await convertRawIntoNDJson({
      metageneration: '2', // On create value is 1.
      bucket: 'testBucket',
      name: 'test.txt'
    });

    sinon.assert.notCalled(convertStub);
  });

  it('converts a file that was created', async () => {
    await convertRawIntoNDJson({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const file = convertStub.getCall(0).args[0];

    assert.strictEqual(file.bucket.name, 'testBucket');
    assert.strictEqual(file.name, 'test.txt');
  });

  it('reads target bucket name from an environment variable', async () => {
    process.env.TARGET_BUCKET = 'testTargetBucket';

    await convertRawIntoNDJson({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const targetBucket = convertStub.getCall(0).args[1];

    assert.strictEqual(targetBucket, 'testTargetBucket');

    delete process.env.TARGET_BUCKET;
  });

  it('reads JSON keys case from an environment variable', async () => {
    process.env.JSON_KEYS_CASE = 'testSnake';

    await convertRawIntoNDJson({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const jsonKeysCase = convertStub.getCall(0).args[2];

    assert.strictEqual(jsonKeysCase, 'testSnake');

    delete process.env.JSON_KEYS_CASE;
  });

  afterEach(() => {
    convertStub.restore();
  });

});
