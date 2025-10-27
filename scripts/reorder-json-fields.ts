import fs from 'node:fs'
import path from 'node:path'
import { PATHS } from '../src/constants'
import { formatSavedData } from '../src/utils'

import type { SavedData } from '../src/services/storage'

async function reorderJsonFields(): Promise<void> {
  // 获取所有 JSON 文件
  const jsonFiles = fs
    .readdirSync(PATHS.STATIC_60S)
    .filter(file => file.endsWith('.json'))
    .sort()

  console.log(`Found ${jsonFiles.length} JSON files`)

  let updatedCount = 0
  let errorCount = 0

  // 遍历每个 JSON 文件
  for (const file of jsonFiles) {
    const filePath = path.resolve(PATHS.STATIC_60S, file)

    try {
      // 读取 JSON 文件
      const content = fs.readFileSync(filePath, 'utf-8')
      const data: SavedData = JSON.parse(content)

      // 重新排序字段
      const reordered = formatSavedData(data)

      // 写回文件
      fs.writeFileSync(filePath, JSON.stringify(reordered, null, 2) + '\n', 'utf-8')
      console.log(`✓ Reordered ${file}`)
      updatedCount++
    } catch (error) {
      console.error(`✗ Failed to reorder ${file}:`, error)
      errorCount++
    }
  }

  console.log('\n=== Reorder Summary ===')
  console.log(`Total: ${jsonFiles.length}`)
  console.log(`Updated: ${updatedCount}`)
  console.log(`Failed: ${errorCount}`)
}

reorderJsonFields().catch(error => {
  console.error('Error reordering JSON fields:', error)
  process.exit(1)
})
