import fs from 'node:fs'
import path from 'node:path'
import pangu from 'pangu'
import { PATHS } from '../src/constants'

import type { SavedData } from '../src/services/storage'

async function addSpacingToNews(): Promise<void> {
  const static60sPath = PATHS.STATIC_60S

  // 获取所有 JSON 文件
  const jsonFiles = fs
    .readdirSync(static60sPath)
    .filter(file => file.endsWith('.json'))
    .sort()

  console.log(`Found ${jsonFiles.length} JSON files`)

  let updatedCount = 0
  let skippedCount = 0
  let errorCount = 0

  // 遍历每个 JSON 文件
  for (const file of jsonFiles) {
    const filePath = path.resolve(static60sPath, file)

    try {
      // 读取 JSON 文件
      const content = fs.readFileSync(filePath, 'utf-8')
      const data: SavedData = JSON.parse(content)

      // 标记是否有更新
      let hasUpdates = false

      // 处理 news 数组中的每一条新闻
      const updatedNews = data.news.map(newsItem => {
        const spacedNews = pangu.spacingText(newsItem)
        if (spacedNews !== newsItem) {
          hasUpdates = true
        }
        return spacedNews
      })

      // 如果没有更新,跳过
      if (!hasUpdates) {
        skippedCount++
        continue
      }

      // 更新 news 数组
      data.news = updatedNews

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

addSpacingToNews().catch(error => {
  console.error('Error adding spacing to news:', error)
  process.exit(1)
})
