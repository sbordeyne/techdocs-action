import * as core from '@actions/core'
import * as io from '@actions/io'
import * as utils from './utils.js'
import { installD2, installPlantUML, installMkDocsPlugins } from './install.js'
import { generate } from './generate.js'
import { publish } from './publish.js'
import { resolveD2Version, resolvePlantUMLVersion } from './version.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const namespace = core.getInput('namespace')
    const kind = core.getInput('kind')
    const name = core.getInput('name')
    const publisherType = core.getInput('publisher-type')
    const bucketRootPath = core.getInput('bucket-root-path')
    const storageName = core.getInput('storage-name')
    const sourceDir = core.getInput('source-dir')
    const siteName = core.getInput('site-name') || undefined
    const shouldInstallD2 = core.getBooleanInput('install-d2')
    const shouldInstallPlantUML = core.getBooleanInput('install-plantuml')
    const mkDocsPlugins = core.getMultilineInput('mkdocs-plugins')
    const d2Version = core.getInput('d2-version') || 'latest'
    const plantUMLVersion = core.getInput('plantuml-version') || 'latest'
    const awsOptions = utils.getAwsPublishOptionsFromInputs()
    const azureOptions = utils.getAzurePublishOptionsFromInputs()
    const openStackOptions = utils.getOpenStackPublishOptionsFromInputs()
    // Install dependencies
    if (shouldInstallD2) {
      const resolvedD2Version = await resolveD2Version(d2Version)
      core.info(`Installing d2 version ${resolvedD2Version}...`)
      if (!(await installD2(resolvedD2Version))) {
        throw new Error('Failed to install d2')
      }
    }

    if (shouldInstallPlantUML) {
      const resolvedPlantUMLVersion =
        await resolvePlantUMLVersion(plantUMLVersion)
      core.info(`Installing PlantUML version ${resolvedPlantUMLVersion}...`)
      if (!(await installPlantUML(resolvedPlantUMLVersion))) {
        throw new Error('Failed to install PlantUML')
      }
    }
    core.info('Installing mkdocs plugins...')
    if (!(await installMkDocsPlugins(mkDocsPlugins))) {
      throw new Error('Failed to install mkdocs plugins')
    }

    // Generate the docs site
    core.info('Generating the docs site...')
    const outputDir = '../techdocs-site'
    core.saveState('OUTPUT_DIR', outputDir)
    await io.mkdirP(outputDir)
    const generationSuccess = await generate({
      sourceDir,
      outputDir,
      siteName
    })
    if (!generationSuccess) {
      throw new Error('Failed to generate the docs site')
    }

    // Publish the docs site
    core.info('Publishing the docs site...')
    const publishSuccess = await publish({
      publisherType,
      bucketRootPath,
      storageName,
      namespace,
      kind,
      name,
      siteDirectory: outputDir,
      awsOptions,
      azureOptions,
      openStackOptions
    })
    if (!publishSuccess) {
      throw new Error('Failed to publish the docs site')
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export async function post(): Promise<void> {
  const outputDir = core.getState('OUTPUT_DIR')
  const mkdocsVenv = core.getState('MKDOCS_VENV_PATH')
  await Promise.all([io.rmRF(outputDir), io.rmRF(mkdocsVenv)])
}
