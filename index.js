'use strict';

const { RawToNDJsonGCSFileConverter } = require('access-logs-dw-gcp-js');
const { Storage } = require('@google-cloud/storage');

/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} data The event payload.
 */
exports.convertRawIntoNDJson = data => {
  // Metageneration attribute is updated on metadata changes. On create value is 1.
  if (data.metageneration !== '1') {
    return Promise.resolve();
  }

  const file = new Storage()
    .bucket(data.bucket)
    .file(data.name);

  return new RawToNDJsonGCSFileConverter()
    .convert(file, process.env.TARGET_BUCKET, process.env.JSON_KEYS_CASE);
};
