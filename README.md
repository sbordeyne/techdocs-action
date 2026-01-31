# TechDocs GitHub Action

Generate and publish TechDocs for backstage from a single GitHub Action call

## Usage

Use it in your GitHub workflows:

```yaml
# file://./.github/workflows/techdocs.yaml
name: Generate Techdocs site

on:
  push:
    branches:
      - master
      - main
    paths:
      - docs/**
      - mkdocs.yml
      - .github/workflows/techdocs.yaml

jobs:
  techdocs:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v6.2.0
        with:
          node-version: '22'

      - uses: actions/setup-python@v6.2.0
        with:
          python-version: '3.11'

      - name: Build & Publish techdocs
        uses: sbordeyne/techdocs-action@v1
        with:
          name: my-component
          publisher-type: googleGcs
          storage-name: my-bucket
```

## Inputs

| Input                       | Required | Default              | Note                                                        |
| --------------------------- | -------- | -------------------- | ----------------------------------------------------------- |
| namespace                   | ❌       | default              |                                                             |
| kind                        | ❌       | Component            | Backstage entity kind to use                                |
| name                        | ✅       |                      | name of your entity                                         |
| publisher-type              | ✅       |                      | can be googleGcs, awsS3, azureBlobStorage or openStackSwift |
| bucketRootPath              | ❌       | .                    |                                                             |
| storage-name                | ✅       |                      | Name of the bucket                                          |
| install-d2                  | ❌       | false                | Whether to install terrastruct/d2                           |
| d2-version                  | ❌       | latest               |                                                             |
| install-plantuml            | ❌       | false                |                                                             |
| plantuml-version            | ❌       | latest               |                                                             |
| mkdocs-plugins              | ❌       | mkdocs-techdocs-core | newline-separated list of mkdocs plugins to install         |
| source-dir                  | ❌       | .                    | Directory containing mkdocs.yml and docs folder             |
| site-name                   | ❌       |                      | The name of the techdocs site if not in mkdocs.yml          |
| aws-role-arn                | ❌       |                      |                                                             |
| aws-endpoint                | ❌       |                      |                                                             |
| aws-proxy                   | ❌       |                      |                                                             |
| aws-s3-sse                  | ❌       |                      |                                                             |
| aws-s3-force-path-style     | ❌       |                      |                                                             |
| aws-max-attempts            | ❌       |                      |                                                             |
| azure-storage-account-name  | ❌       |                      |                                                             |
| azure-storage-account-key   | ❌       |                      |                                                             |
| openstack-credential-id     | ❌       |                      |                                                             |
| openstack-credential-secret | ❌       |                      |                                                             |
| openstack-auth-url          | ❌       |                      |                                                             |
| openstack-swift-url         | ❌       |                      |                                                             |

## Authenticate to your cloud provider

### Google GCS

Set the environment variable `GOOGLE_APPLICATION_CREDENTIALS` on the step of the
workflow

```yaml
- name: Generate Google Application Credentials
  env:
    GCP_GITHUB_SA_CREDENTIALS: ${{ secrets.GCP_GITHUB_SA_CREDENTIALS }}
  run: |
    echo "${GCP_GITHUB_SA_CREDENTIALS}" > ./gcp-github-sa-credentials.json
    echo "GOOGLE_APPLICATION_CREDENTIALS=$(pwd)/gcp-github-sa-credentials.json" >> $GITHUB_ENV
- name: Generate & Publish
  uses: sbordeyne/techdocs-action@v1
  with:
    name: my-component
    publisher-type: googleGcs
    storage-name: my-bucket
- name: Clean up Google Application Credentials
  if: always()
  run: |
    rm -f $GOOGLE_APPLICATION_CREDENTIALS
```

### Amazon AWS

### Openstack Swift

### Azure Blob Storage
