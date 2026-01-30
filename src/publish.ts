import * as exec from '@actions/exec'

export interface AWSPublishOptions {
  roleArn?: string
  endpoint?: string
  proxy?: string
  s3sse?: string
  s3ForcePathStyle?: boolean
  maxAttempts?: number
}

export interface AzurePublishOptions {
  accountName: string
  accountKey: string
}

export interface OpenStackPublishOptions {
  credentialId: string
  credentialSecret: string
  authUrl: string
  swiftUrl: string
}

export async function publish({
  publisherType,
  bucketRootPath,
  storageName,
  namespace,
  kind,
  name,
  siteDirectory,
  awsOptions,
  azureOptions,
  openStackOptions
}: {
  publisherType: string
  bucketRootPath: string
  storageName: string
  namespace: string
  kind: string
  name: string
  siteDirectory: string
  awsOptions?: AWSPublishOptions
  azureOptions?: AzurePublishOptions
  openStackOptions?: OpenStackPublishOptions
}): Promise<boolean> {
  if (publisherType === 'openStackSwift' && !openStackOptions) {
    throw new Error(
      'OpenStack Swift publish options must be provided for openStackSwift publisher type'
    )
  }
  if (publisherType === 'azureBlobStorage' && !azureOptions) {
    throw new Error(
      'Azure Blob Storage publish options must be provided for azureBlobStorage publisher type'
    )
  }
  const argv = [
    '--publisher-type',
    publisherType,
    '--storage-name',
    storageName,
    '--entity',
    `${namespace}/${kind}/${name}`,
    '--directory',
    siteDirectory
  ]
  if (bucketRootPath !== '') {
    if (publisherType === 'googleGcs') {
      argv.push('--gcsBucketRootPath', bucketRootPath)
    } else if (publisherType === 'awsS3') {
      argv.push('--awsBucketRootPath', bucketRootPath)
    }
  }
  if (awsOptions && publisherType === 'awsS3') {
    if (awsOptions.roleArn) {
      argv.push('--awsRoleArn', awsOptions.roleArn)
    }
    if (awsOptions.endpoint) {
      argv.push('--awsEndpoint', awsOptions.endpoint)
    }
    if (awsOptions.proxy) {
      argv.push('--awsProxy', awsOptions.proxy)
    }
    if (awsOptions.s3sse) {
      argv.push('--awsS3Sse', awsOptions.s3sse)
    }
    if (awsOptions.s3ForcePathStyle) {
      argv.push('--awsS3ForcePathStyle')
    }
    if (awsOptions.maxAttempts) {
      argv.push('--awsMaxAttempts', awsOptions.maxAttempts.toString())
    }
  }

  if (azureOptions && publisherType === 'azureBlobStorage') {
    argv.push('--azureAccountName', azureOptions.accountName)
    argv.push('--azureAccountKey', azureOptions.accountKey)
  }

  if (openStackOptions && publisherType === 'openStackSwift') {
    argv.push('--osCredentialId', openStackOptions.credentialId)
    argv.push('--osSecret', openStackOptions.credentialSecret)
    argv.push('--osAuthUrl', openStackOptions.authUrl)
    argv.push('--osSwiftUrl', openStackOptions.swiftUrl)
  }

  const status = await exec.exec('npx', ['@techdocs/cli', 'publish', ...argv])
  if (status !== 0) {
    return false
  }
  return true
}
