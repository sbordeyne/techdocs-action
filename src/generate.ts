import * as exec from '@actions/exec'
import * as github from '@actions/github'

export async function generate({
  sourceDir,
  outputDir,
  techDocsRef,
  siteName
}: {
  sourceDir?: string
  outputDir?: string
  techDocsRef?: string
  siteName?: string
}): Promise<boolean> {
  const argv = ['--etag', github.context.ref, '--no-docker', '--verbose']
  if (sourceDir !== undefined) {
    argv.push('--source-dir', sourceDir)
  }
  if (outputDir !== undefined) {
    argv.push('--output-dir', outputDir)
  }
  if (techDocsRef !== undefined) {
    argv.push('--techdocs-ref', techDocsRef)
  }
  if (siteName !== undefined) {
    argv.push('--site-name', siteName)
  }
  const status = await exec.exec('npx', ['@techdocs/cli', 'generate', ...argv])
  if (status !== 0) {
    return false
  }
  return true
}
