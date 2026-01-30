import * as core from '@actions/core'

export function getAwsPublishOptionsFromInputs() {
  const roleArn = core.getInput('aws-role-arn') || undefined
  const endpoint = core.getInput('aws-endpoint') || undefined
  const proxy = core.getInput('aws-proxy') || undefined
  const s3sse = core.getInput('aws-s3sse') || undefined
  const s3ForcePathStyleInput = core.getInput('aws-s3-force-path-style')
  const s3ForcePathStyle = s3ForcePathStyleInput
    ? s3ForcePathStyleInput === 'true'
    : undefined
  const maxAttemptsInput = core.getInput('aws-max-attempts')
  const maxAttempts = maxAttemptsInput
    ? parseInt(maxAttemptsInput, 10)
    : undefined
  if (
    roleArn === undefined &&
    endpoint === undefined &&
    proxy === undefined &&
    s3sse === undefined &&
    s3ForcePathStyle === undefined &&
    maxAttempts === undefined
  ) {
    return undefined
  }
  return {
    roleArn,
    endpoint,
    proxy,
    s3sse,
    s3ForcePathStyle,
    maxAttempts
  }
}

export function getAzurePublishOptionsFromInputs() {
  const accountName = core.getInput('azure-account-name')
  const accountKey = core.getInput('azure-account-key')
  if (accountName === '' || accountKey === '') {
    return undefined
  }
  return {
    accountName,
    accountKey
  }
}

export function getOpenStackPublishOptionsFromInputs() {
  const credentialId = core.getInput('openstack-credential-id')
  const credentialSecret = core.getInput('openstack-credential-secret')
  const authUrl = core.getInput('openstack-auth-url')
  const swiftUrl = core.getInput('openstack-swift-url')
  if (
    credentialId === '' ||
    credentialSecret === '' ||
    authUrl === '' ||
    swiftUrl === ''
  ) {
    return undefined
  }
  return {
    credentialId,
    credentialSecret,
    authUrl,
    swiftUrl
  }
}
