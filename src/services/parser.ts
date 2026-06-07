import { load } from 'cheerio'
import { debug } from '../utils'
import { USER_AGENT } from '../constants'

import type { ParsedArticle } from './storage'

const EMPTY_RESULT = { news: [], cover: '', image: '', tip: '', audio: { music: '', news: '' } }

const prompt = `
# 你是一个 HTML 结构解析工具，能够熟练、完美的完成 HTML 内容解析和文本优化目标。接下来你需要解析一个微信公众号文章的 HTML，并按照要求通过指定的格式返回指定的内容。

## 返回 JSON 字段说明

- news: 新闻列表，string[] 类型，大概 15 条，以具实际况决定，是 html 里正文的主要内容。
- cover: 新闻封面图片 URL，string 类型，在 "今日简报" 标题下面方、农历等信息的上面的长方形封面图片，如果不存在则返回空字符串。
- tip: 每日一句，string 类型，可能是【微语】、【每日一句】、【每日金句】 等 prefix 文本的后面，通常是文章的最后一段。

## 针对每一项新闻文本的要求

- 移除每条新闻的前缀序号和标点或其他标记和末尾的标点符号。
- 移除可能出现在新闻后面的广告，如"；公众号：每天100秒看世界"类似格式。
- 移除可能存在的异常字符、转义字符，如 "\\n"、"\\t"、"&nbsp;" 等。
- 保持原文内容，不要添加或删除空格，文本格式化将在后续处理中完成。

你完全遵循原始 HTML 文本内容，不会添加、构造任何不存在的新闻和 URL 链接。 以下是示例解析结果的格式和 URL 格式，仅供参考。请以实际 HTML 为准。

## 示例格式

请不要返回示例数据或基于这个数据进行生成。请遵循原文进行解析。

{
  "news": [
      "中央气象台：25日至29日寒潮来袭，我国大部地区降温剧烈，大部地区气温下降8～12℃，局地最高降幅超20℃",
      "民政部：截至2024年底，我国60岁及以上老年人口达到3.1亿，占总人口22%",
      "海南10岁小孩哥出海钓鱼从陵水漂流一夜到三亚，邻居：捕鱼遇风浪被漂走，系疍家人水性好，家长：回家怕挨打又躲起来了",
      "加拿大、德国、英国、芬兰、丹麦等国提醒本国赴美公民：小心被捕",
      "宇树科技发布H2仿生人形机器人：身高180cm，重70kg，能跳舞会武术还能走猫步",
      "统计局：今年前三季度国内GDP 1015036亿元，同比增长5.2%；专家分析完成全年5%左右的目标概率较大"
  ],
  "cover": "https://mmbiz.qpic.cn/sz_mmbiz_png/O3P1rGdfJibIX7H04XgRWzlvibEHuj3rBSEoIElyBGOumg51zy9okALUEia96Ezqc66jccSzgNnUPBNHvnXKSowqg/640?wx_fmt=png&from=appmsg&tp=webp&wxfrom=5&wx_lazy=1",
  "tip": "人生中有些事，不竭尽全力，你永远无法知晓自己的出色"
}
`

const generationConfig = {
  responseMimeType: 'application/json',
  responseSchema: {
    type: 'object',
    properties: {
      news: { type: 'array', items: { type: 'string' } },
      cover: { type: 'string' },
      image: { type: 'string' },
      tip: { type: 'string' },
    },
    propertyOrdering: ['news', 'cover', 'image', 'tip'],
    required: ['news', 'cover', 'image', 'tip'],
  },
}

export async function parsePostViaLLM(url: string): Promise<ParsedArticle> {
  debug('url', url)

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error("No Gemini API key provided, can't use LLM to parse article.")
    return EMPTY_RESULT
  }

  const model = 'gemini-3.5-flash'

  debug('model', model)

  const html = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    .then(e => e.text())
    .catch(() => fetch(url).then(e => e.text()))

  const $ = load(html)

  const mainHtml = $('#page-content').html() || ''

  if (!mainHtml) {
    console.error('No main HTML content found in the article.')
    return EMPTY_RESULT
  }

  debug('main html length', mainHtml.length)

  const timeStart = performance.now()

  const options = {
    method: 'POST',
    headers: {
      'x-goog-api-key': apiKey,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: prompt }] },
      contents: [{ role: 'user', parts: [{ text: mainHtml }] }],
      generationConfig,
    }),
  }

  const thirdApi = `https://google-ai.deno.dev/v1beta/models/${model}:generateContent?key=${apiKey}`
  const officialApi = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  let response: { candidates: { content: { parts: { text: string }[] } }[] } | null = null

  try {
    response = (await (await fetch(thirdApi, options)).json()) as any
  } catch (error) {
    console.warn('First Gemini API request failed, retrying official domain...', error)

    try {
      response = (await (await fetch(officialApi, options)).json()) as any
    } catch (error) {
      console.error('Gemini API request failed:', error)
    }
  }

  if (!response) {
    console.error('No response from Gemini API.')
    return EMPTY_RESULT
  }

  debug(
    'LLM request cost (ms)',
    (Math.round((performance.now() - timeStart) * 1000) / 1000).toLocaleString('zh-CN')
  )

  // log('Gemini response:', JSON.stringify(response, null, 2))

  try {
    debug('LLM response', response)

    const data = JSON.parse(response?.candidates?.[0]?.content?.parts?.[0]?.text || '{}')

    debug('LLM data', data)

    if (!('news' in data) || !('cover' in data) || !('image' in data) || !('tip' in data)) {
      console.error('Invalid Gemini response format:', data)

      return EMPTY_RESULT
    }

    return {
      news: data.news || [],
      cover: data.cover || '',
      tip: data.tip || '',
    }
  } catch {
    console.error('Failed to parse Gemini response:', response?.candidates?.[0]?.content?.parts)

    return EMPTY_RESULT
  }
}
