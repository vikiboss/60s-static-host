import fs from 'node:fs/promises'
import path from 'node:path'
import { log } from '../utils'
import { Suspense } from 'react'
import { IS_IN_CI, PROJECT_ROOT } from '../constants'
import puppeteer, { Browser } from 'puppeteer-core'
import { renderToReadableStream } from 'react-dom/server'

// 字体配置
const FONTS = [{ name: 'DouyinSansBold', file: 'DouyinSansBold.otf' }]

class RenderService {
  #browser: Browser | null = null
  #fontFaceCSS: string = ''

  async prepare(): Promise<void> {
    log('Prepare renderer...')

    // 预加载字体为 base64
    await this.#loadFonts()

    const executablePath = IS_IN_CI
      ? './.chromium/chrome-linux/chrome'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

    this.#browser = await puppeteer.launch({
      headless: 'shell',
      executablePath,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--no-zygote',
        '--no-sandbox',
        '--hide-scrollbars',
        '--font-render-hinting=medium',
        '--lang=zh-CN',
      ],
    })
  }

  async #loadFonts(): Promise<void> {
    log('Loading fonts...')
    const fontFaces: string[] = []

    for (const font of FONTS) {
      const fontPath = path.join(PROJECT_ROOT, 'assets', font.file)
      try {
        const fontBuffer = await fs.readFile(fontPath)
        const base64 = fontBuffer.toString('base64')
        const type = font.file.endsWith('.otf') ? 'opentype' : 'truetype'

        fontFaces.push(`
          @font-face {
            font-family: '${font.name}';
            src: url('data:font/${type};base64,${base64}') format('${type}');
            font-weight: normal;
            font-style: normal;
          }
        `)
        log(`  ✓ Loaded font: ${font.name}`)
      } catch (error) {
        console.warn(`  ⚠️  Failed to load font ${font.name}:`, error)
      }
    }

    this.#fontFaceCSS = fontFaces.join('\n')
  }

  async destroy(): Promise<void> {
    log('Destroy renderer...')
    await this.#browser?.close()
    log('Renderer destroyed')
  }

  async render(children: React.ReactElement): Promise<Buffer> {
    const domString = await this.renderReactToString(children)
    const html = await this.wrapHtmlAndUnocss(domString)
    return await this.screenshot(html)
  }

  async screenshot(html: string): Promise<Buffer> {
    if (!this.#browser) {
      throw new Error('Browser not initialized')
    }

    log('Create browser context...')
    const context = await this.#browser.createBrowserContext()

    log('Create new page...')
    const page = await context.newPage()

    log('Set viewport...')
    await page.setViewport({ deviceScaleFactor: 2, height: 2400, width: 1200 })

    await fs.writeFile('./debug-html.html', html)

    log('Set html content...')
    await page.setContent(html)

    log('Wait for main selector...')
    await page.waitForSelector('#main')

    log('Get main selector...')
    const el = (await page.$('#main'))!

    log('Screenshot...')
    const screenshot = await el.screenshot({
      type: 'png',
      encoding: 'binary',
      optimizeForSpeed: false,
    })

    log('Close browser context...')
    await context.close()

    return Buffer.from(screenshot)
  }

  async renderReactToString(children: React.ReactElement): Promise<string> {
    log('Render React to string...')
    const element = <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    const stream = await renderToReadableStream(element)
    await stream.allReady
    return new Response(stream).text()
  }

  async wrapHtmlAndUnocss(html: string): Promise<string> {
    const __dirname = new URL('.', import.meta.url).pathname
    const template = await fs.readFile(path.join(__dirname, 'template.html'), 'utf-8')
    return template.replace('__FONT_FACE__', this.#fontFaceCSS).replace('__HTML__', html)
  }
}

export const renderer = new RenderService()
