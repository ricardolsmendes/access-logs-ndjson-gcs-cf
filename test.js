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

    assert.strictEqual('[object Promise]', Object.prototype.toString.call(
      response));
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

    assert.strictEqual('testBucket', file.bucket.name);
    assert.strictEqual('test.txt', file.name);
  });

  it('reads target bucket name from an environment variable', async () => {
    process.env.TARGET_BUCKET = 'testTargetBucket';

    await convertRawIntoNDJson({
      metageneration: '1',
      bucket: 'testBucket',
      name: 'test.txt'
    });

    const targetBucket = convertStub.getCall(0).args[1];

    assert.strictEqual('testTargetBucket', targetBucket);

    delete process.env.TARGET_BUCKET;
  });

  afterEach(() => {
    convertStub.restore();
  });

});
