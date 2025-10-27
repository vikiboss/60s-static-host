import fs from 'node:fs'
import path from 'node:path'
import { renderer } from '../src/services/renderer'
import { storage } from '../src/services/storage'
import { NewsCard } from '../src/components/news'
import { PATHS } from '../src/constants'
import { log } from '../src/utils'

generateImages().catch(error => {
  console.error('Error generating images:', error)
  process.exit(1)
})

async function generateImages(): Promise<void> {
  // 获取所有 JSON 文件
  const jsonFiles = fs
    .readdirSync(PATHS.STATIC_60S)
    .filter(file => file.endsWith('.json'))
    .sort()

  log(`Found ${jsonFiles.length} JSON files`)

  // 查找缺失图片的日期
  const missingDates: string[] = []
  for (const file of jsonFiles) {
    const date = file.replace('.json', '')
    const imagePath = path.resolve(PATHS.STATIC_IMAGES, `${date}.png`)
    if (!fs.existsSync(imagePath)) {
      missingDates.push(date)
    }
  }

  if (missingDates.length === 0) {
    log('All images already exist!')
    return
  }

  log(`Found ${missingDates.length} missing images`)
  log(
    `Missing dates: ${missingDates.slice(0, 10).join(', ')}${missingDates.length > 10 ? '...' : ''}`
  )

  // 初始化渲染器
  await renderer.prepare()

  let successCount = 0
  let failedCount = 0

  // 为每个缺失的日期生成图片
  for (let i = 0; i < missingDates.length; i++) {
    const date = missingDates[i]!
    try {
      log(`[${i + 1}/${missingDates.length}] Generating image for ${date}...`)

      // 加载数据
      const data = await storage.loadData(date)
      if (!data) {
        console.warn(`  ⚠️  No data found for ${date}, skipping...`)
        failedCount++
        continue
      }

      // 渲染图片
      const buffer = await renderer.render(<NewsCard data={data} />)

      // 保存图片
      await storage.saveImage(date, buffer)
      successCount++
    } catch (error) {
      console.error(`  ✗ Failed to generate image for ${date}:`, error)
      failedCount++
    }
  }

  // 销毁渲染器
  await renderer.destroy()

  log('=== Generation Summary ===')
  log(`Total: ${missingDates.length}`)
  log(`Success: ${successCount}`)
  log(`Failed: ${failedCount}`)
}
