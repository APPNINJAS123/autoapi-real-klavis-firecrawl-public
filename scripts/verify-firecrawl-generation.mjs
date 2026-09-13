import { readFile } from 'node:fs/promises'
import process from 'node:process'
import ts from '../mcp_servers/firecrawl/node_modules/typescript/lib/typescript.js'

const manifest = JSON.parse(await readFile(new URL('../mcp_servers/firecrawl/package.json', import.meta.url), 'utf8'))
const lock = JSON.parse(await readFile(new URL('../mcp_servers/firecrawl/package-lock.json', import.meta.url), 'utf8'))
const sourceText = await readFile(new URL('../mcp_servers/firecrawl/index.ts', import.meta.url), 'utf8')

const expectedVersion = '4.34.0'
if (manifest.dependencies?.['@mendable/firecrawl-js'] !== expectedVersion) {
  throw new Error(`expected @mendable/firecrawl-js@${expectedVersion} in package.json`)
}
if (manifest.dependencies?.firecrawl !== undefined) {
  throw new Error('migration changed package identity from @mendable/firecrawl-js to firecrawl')
}
const rootLock = lock.packages?.['']?.dependencies?.['@mendable/firecrawl-js']
const installedLock = lock.packages?.['node_modules/@mendable/firecrawl-js']?.version
if (rootLock !== expectedVersion || installedLock !== expectedVersion) {
  throw new Error('package-lock.json does not pin the exact reviewed Firecrawl SDK')
}

const source = ts.createSourceFile('index.ts', sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
const forbiddenMembers = new Set([
  'scrapeUrl', 'crawlUrl', 'mapUrl', 'asyncCrawlUrl', 'checkCrawlStatus',
  'checkCrawlErrors', 'batchScrapeUrls', 'asyncBatchScrapeUrls',
  'checkBatchScrapeStatus', 'checkBatchScrapeErrors', 'asyncExtract',
  'crawlUrlAndWatch', 'batchScrapeUrlsAndWatch',
])
const forbiddenTypes = new Set(['ScrapeParams', 'MapParams', 'CrawlParams', 'FirecrawlDocument'])
const violations = []

function walk(node) {
  if (ts.isPropertyAccessExpression(node) && forbiddenMembers.has(node.name.text)) {
    violations.push(`legacy member ${node.name.text}`)
  }
  if (ts.isImportSpecifier(node)) {
    const imported = (node.propertyName ?? node.name).text
    if (forbiddenTypes.has(imported)) violations.push(`legacy imported type ${imported}`)
  }
  ts.forEachChild(node, walk)
}
walk(source)

if (violations.length > 0) {
  throw new Error(`legacy Firecrawl v1 surface remains: ${[...new Set(violations)].join(', ')}`)
}

const requiredMembers = ['scrape', 'map', 'startCrawl', 'getCrawlStatus', 'search', 'startBatchScrape']
const present = new Set()
function collect(node) {
  if (ts.isPropertyAccessExpression(node)) present.add(node.name.text)
  ts.forEachChild(node, collect)
}
collect(source)
for (const member of requiredMembers) {
  if (!present.has(member)) throw new Error(`expected migrated Firecrawl member ${member}`)
}

process.stdout.write('Firecrawl v2 migration contract passed\n')
