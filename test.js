'use strict';

const assert = require('assert');
const sinon = require('sinon');

const { RawToSchemaGCSFileConverter } = require('access-logs-dw-gcp-js');

const { convertRawIntoJsonLines } = require('./index');

describe('convertRawIntoJsonLines', () => {

  let jsonLinesStub;

  beforeEach(() => {
    jsonLinesStub = sinon.stub(RawToSchemaGCSFileConverter.prototype, 'jsonLines').returns(
      Promise.resolve());
  });

  it('returns a promise', () => {
    const convertRawIntoJsonLinesReturn = convertRawIntoJsonLines({
      metageneration: '2',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    assert.strictEqual(Object.prototype.toString.call(convertRawIntoJsonLinesReturn),
      '[object Promise]');
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

    const sourceBucketName = jsonLinesStub.getCall(0).args[0];
    const sourceFileName = jsonLinesStub.getCall(0).args[1];

    assert.strictEqual(sourceBucketName, 'testBucket');
    assert.strictEqual(sourceFileName, 'test.txt');
  });

  it('reads target bucket name from an environment variable', () => {
    process.env.TARGET_BUCKET = 'testTargetBucket';

    convertRawIntoJsonLines({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const targetBucketName = jsonLinesStub.getCall(0).args[2];

    assert.strictEqual(targetBucketName, 'testTargetBucket');

    delete process.env.TARGET_BUCKET;
  });

  it('reads JSON keys case from an environment variable', () => {
    process.env.JSON_KEYS_CASE = 'testSnake';

    convertRawIntoJsonLines({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const jsonKeysCase = jsonLinesStub.getCall(0).args[3];

    assert.strictEqual(jsonKeysCase, 'testSnake');

    delete process.env.JSON_KEYS_CASE;
  });

  afterEach(() => {
    jsonLinesStub.restore();
  });

});
