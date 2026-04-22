const fs = require('fs')
const path = require('path')

function getFiles(dir, fileList = []) {
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

const apiDir = path.join(__dirname, 'server', 'api')
const apiFiles = getFiles(apiDir)

let changedCount = 0

for (const file of apiFiles) {
  let content = fs.readFileSync(file, 'utf-8')
  let changed = false

  if (content.includes('export default defineEventHandler(')) {
    content = content.replace('export default defineEventHandler(', 'export default defineApiHandler(')
    changed = true
  }

  if (changed) {
    // Calculate relative path to server/utils/handler
    const fileDir = path.dirname(file)
    const utilsDir = path.join(__dirname, 'server', 'utils')
    let relativePath = path.relative(fileDir, utilsDir)
    // format as posix
    relativePath = relativePath.split(path.sep).join('/')
    const importPath = relativePath + '/handler'

    if (!content.includes('import { defineApiHandler }')) {
       content = `import { defineApiHandler } from '${importPath}'\n` + content
    }
    
    fs.writeFileSync(file, content, 'utf-8')
    changedCount++
    console.log(`Updated: ${file}`)
  }
}

console.log(`\nTotal files updated: ${changedCount}`)
