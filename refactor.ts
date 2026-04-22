import fs from 'fs'
import path from 'path'
import { globSync } from 'glob' // I will just use pure Node.js recursive read

function getFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file))
    if (stat.isDirectory()) {
      fileList = getFiles(path.join(dir, file), fileList)
    } else if (file.endsWith('.ts')) {
      fileList.push(path.join(dir, file))
    }
  }
  return fileList
}

const apiFiles = getFiles(path.join(__dirname, 'server', 'api'))

let changedCount = 0

for (const file of apiFiles) {
  let content = fs.readFileSync(file, 'utf-8')
  let changed = false

  // Replace `defineEventHandler` export with `defineApiHandler`
  if (content.includes('export default defineEventHandler(')) {
    content = content.replace('export default defineEventHandler(', 'export default defineApiHandler(')
    changed = true
  }

  // Ensure `defineApiHandler` is imported from relative utils if not auto-imported.
  // Actually, wait, Nuxt 3 server/utils ARE auto-imported, but the file has explicit h3 imports.
  // I will just add the import to be safe, calculating the relative path.
  if (changed && !content.includes('defineApiHandler')) {
    // Wait, the replace above just added `defineApiHandler`. So it WILL include it.
    // I mean if there is no import for it.
  }

  if (changed) {
    const depth = file.split(path.sep).length - path.join(__dirname, 'server', 'api').split(path.sep).length
    const relativePrefix = depth === 0 ? '../utils/handler' : '../'.repeat(depth + 1) + 'utils/handler'
    
    // Add import statement at the top if not present
    if (!content.includes('import { defineApiHandler }')) {
       // Wait, we can just replace `import { defineEventHandler } from 'h3'` with `import { defineEventHandler } from 'h3'\nimport { defineApiHandler } from '${relativePrefix}'`
       // or just add it at the top.
       content = `import { defineApiHandler } from '${relativePrefix}'\n` + content
    }
    
    fs.writeFileSync(file, content, 'utf-8')
    changedCount++
    console.log(`Updated: ${file}`)
  }
}

console.log(`\nTotal files updated: ${changedCount}`)
