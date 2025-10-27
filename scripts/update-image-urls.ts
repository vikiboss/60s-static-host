import fs from 'node:fs'
import path from 'node:path'
import { PATHS } from '../src/constants'

import type { SavedData } from '../src/services/storage'

const CDN_BASE_URL = 'https://cdn.jsdmirror.com/gh/vikiboss/60s-static-host@main/static/images'

async function updateImageUrls(): Promise<void> {
  // 获取所有 JSON 文件
  const jsonFiles = fs
    .readdirSync(PATHS.STATIC_60S)
    .filter(file => file.endsWith('.json'))
    .sort()

  console.log(`Found ${jsonFiles.length} JSON files`)

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  // 遍历每个 JSON 文件
  for (const file of jsonFiles) {
    const filePath = path.resolve(PATHS.STATIC_60S, file)
    const date = file.replace('.json', '')

    try {
      // 读取 JSON 文件
      const content = fs.readFileSync(filePath, 'utf-8')
      const data: SavedData = JSON.parse(content)

      // 期望的图片 URL
      const expectedImageUrl = `${CDN_BASE_URL}/${date}.png`

      // 检查是否需要更新
      if (data.image === expectedImageUrl) {
        skippedCount++
        continue
      }

      // 更新 image 字段
      data.image = expectedImageUrl

      // 写回文件
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
      console.log(`✓ Updated ${file}`)
      updatedCount++
    } catch (error) {
      console.error(`✗ Failed to update ${file}:`, error)
      errorCount++
    }
  }

  console.log('=== Update Summary ===')
  console.log(`Total: ${jsonFiles.length}`)
  console.log(`Updated: ${updatedCount}`)
  console.log(`Skipped: ${skippedCount}`)
  console.log(`Failed: ${errorCount}`)
}

updateImageUrls().catch(error => {
  console.error('Error updating image URLs:', error)
  process.exit(1)
})
