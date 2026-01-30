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

| Input                       | Required           | Default              | Note                                                        |
| --------------------------- | ------------------ | -------------------- | ----------------------------------------------------------- |
| namespace                   | :cross_mark:       | default              |                                                             |
| kind                        | :cross_mark:       | Component            | Backstage entity kind to use                                |
| name                        | :green_check_mark: |                      | name of your entity                                         |
| publisher-type              | :green_check_mark: |                      | can be googleGcs, awsS3, azureBlobStorage or openStackSwift |
| bucketRootPath              | :cross_mark:       | .                    |                                                             |
| storage-name                | :green_check_mark: |                      | Name of the bucket                                          |
| install-d2                  | :cross_mark:       | false                | Whether to install terrastruct/d2                           |
| d2-version                  | :cross_mark:       | latest               |                                                             |
| install-plantuml            | :cross_mark:       | false                |                                                             |
| plantuml-version            | :cross_mark:       | latest               |                                                             |
| mkdocs-plugins              | :cross_mark:       | mkdocs-techdocs-core | newline-separated list of mkdocs plugins to install         |
| source-dir                  | :cross_mark:       | .                    | Directory containing mkdocs.yml and docs folder             |
| site-name                   | :cross_mark:       |                      | The name of the techdocs site if not in mkdocs.yml          |
| aws-role-arn                | :cross_mark:       |                      |                                                             |
| aws-endpoint                | :cross_mark:       |                      |                                                             |
| aws-proxy                   | :cross_mark:       |                      |                                                             |
| aws-s3-sse                  | :cross_mark:       |                      |                                                             |
| aws-s3-force-path-style     | :cross_mark:       |                      |                                                             |
| aws-max-attempts            | :cross_mark:       |                      |                                                             |
| azure-storage-account-name  | :cross_mark:       |                      |                                                             |
| azure-storage-account-key   | :cross_mark:       |                      |                                                             |
| openstack-credential-id     | :cross_mark:       |                      |                                                             |
| openstack-credential-secret | :cross_mark:       |                      |                                                             |
| openstack-auth-url          | :cross_mark:       |                      |                                                             |
| openstack-swift-url         | :cross_mark:       |                      |                                                             |

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
