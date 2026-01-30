import * as tc from '@actions/tool-cache'
import * as core from '@actions/core'
import * as fs from 'fs/promises'
import * as exec from '@actions/exec'

export async function installD2(version: string): Promise<boolean> {
  const d2ArchivePath = await tc.downloadTool(
    `https://github.com/terrastruct/d2/releases/download/v${version}/d2-v${version}-linux-amd64.tar.gz`
  )
  const d2ExtractedPath = await tc.extractTar(d2ArchivePath)
  const d2Path = await tc.cacheDir(d2ExtractedPath, 'd2', version)
  core.addPath(d2Path)
  return true
}

export async function installPlantUML(version: string): Promise<boolean> {
  const plantUMLArchivePath = await tc.downloadTool(
    `https://sourceforge.net/projects/plantuml/files/plantuml.${version}.jar/download`
  )

  const plantUMLJarPath = await tc.cacheFile(
    plantUMLArchivePath,
    'plantuml.jar',
    'plantuml.jar',
    version
  )
  const script = `
  #!/bin/sh
  java -jar '${plantUMLJarPath}' \${@}
  `
  await fs.writeFile('plantuml', script, { mode: 0o777 })
  const plantUMLPath = await tc.cacheFile(
    'plantuml',
    'plantuml',
    'plantuml',
    version
  )
  core.addPath(plantUMLPath)
  return true
}

export async function installMkDocsPlugins(
  plugins: string[]
): Promise<boolean> {
  for (const plugin of plugins) {
    const exitCode = await exec.exec(`python3 -m pip install ${plugin}`)
    if (exitCode !== 0) {
      return false
    }
  }
  return true
}
