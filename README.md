# access-logs-ndjson-gcs-gcf

Google Cloud Function to convert raw access log files into newline delimited JSON.

[![js-standard-style][1]][2] [![CircleCI][3]][4]

_This repository is part a project described in the article
[Serverless ETL on Google Cloud, a case study: raw data into JSON Lines][5]._

## Environment variables

Below environment variables are used by the function:

| NAME | DESCRIPTION | MANDATORY |
| ---- | ----------- | --------- |
| TARGET_BUCKET | GCS Bucket to store the output. | Y |
| JSON_KEYS_CASE | Character case of the output JSON object keys; defaults to `camel`, accepts `snake` as well. | N |

## Using Cloud Build to deploy

Present function is deployable through Cloud Build (build spec file: `.cloudbuild/cloudbuild.yaml`).

Below substitution variables are used by the build job:

| NAME | DESCRIPTION | MANDATORY |
| ---- | ----------- | --------- |
| _FUNCTION_NAME | ID or fully qualified identifier for the function. | Y |
| _JSON_KEYS_CASE | Character case of the output JSON object keys. | Y |
| _MAX_INSTANCES | Maximum number of instances for the function. | Y |
| _SERVICE_ACCOUNT | The email address of the IAM service account associated with the function at runtime. | Y |
| _SOURCE | Location of source code to deploy. | Y |
| _TARGET_BUCKET | GCS Bucket to store the output. | Y |
| _TRIGGER_BUCKET | GCS Bucket that will trigger the Cloud Function on file-related events. | Y |

You may refer to [gcloud functions deploy docs][6] for instructions on how to fulfill some of the
variables.

[1]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[2]: http://standardjs.com
[3]: https://circleci.com/gh/ricardolsmendes/access-logs-ndjson-gcs-gcf.svg?style=svg
[4]: https://circleci.com/gh/ricardolsmendes/access-logs-ndjson-gcs-gcf
[5]: https://medium.com/google-cloud/serverless-etl-on-google-cloud-a-case-study-raw-data-into-json-lines-d20711cd3917
[6]: https://cloud.google.com/sdk/gcloud/reference/functions/deploy
