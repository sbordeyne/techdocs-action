import * as github from '@actions/github'
import * as http from '@actions/http-client'
import Parser from 'rss-parser'

export async function resolveD2Version(version: string): Promise<string> {
  if (version === 'latest') {
    // Fetch the latest version from GitHub API
    const client = github.getOctokit(process.env.GITHUB_TOKEN || '')
    const response = await client.rest.repos.getLatestRelease({
      owner: 'terrastruct',
      repo: 'd2'
    })
    return response.data.tag_name.replace(/^v/, '')
  }
  return version
}

export async function resolvePlantUMLVersion(version: string): Promise<string> {
  if (version === 'latest') {
    // Fetch the RSS feed
    const client = new http.HttpClient()
    const response = await client.get(
      'https://sourceforge.net/projects/plantuml/rss/'
    )
    const rssText = await response.readBody()
    // Parse the RSS feed to find the latest version
    const parser = new Parser()
    const feed = await parser.parseString(rssText)
    if (feed.items && feed.items.length > 0) {
      for (const item of feed.items) {
        if (item.title?.match(/plantuml\.(\d+\.\d+(\.\d+)?)/)) {
          const match = item.title.match(/plantuml\.(\d+\.\d+(\.\d+)?)/)
          if (match && match[1]) {
            return match[1]
          }
        }
      }
    }
  }
  return version
}
