import pangu from 'pangu'

import type { SavedData } from './services/storage'

export function debug(name: string, ...values: unknown[]): void {
  console.log(
    `[${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}] [DEBUG] [${name}] => `,
    ...values,
    `\n`
  )
}

export function log(...values: unknown[]): void {
  console.log(
    `[${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}] [LOG]`,
    ...values,
    `\n`
  )
}

export function getInputArgValue(argName: string): string | undefined {
  return process.argv
    .find(arg => arg.startsWith(`--${argName}`))
    ?.split('=')[1]
    ?.trim()
}

export function localeDate(ts: number | string | Date = Date.now()) {
  const today = ts instanceof Date ? ts : new Date(ts)

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  })

  return formatter.format(today).replace(/\//g, '-')
}

export function localeTime(ts: number | string | Date = Date.now()) {
  const now = ts instanceof Date ? ts : new Date(ts)

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hourCycle: 'h23',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
  })

  return formatter.format(now)
}

export function isValidDateFormat(dateString: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
}

/**
 * 格式化保存的数据:
 * 1. 为 news 添加可读性空格
 * 2. 重新排序字段
 */
export function formatSavedData(data: SavedData): SavedData {
  const formatted = {
    ...data,
    news: data.news.map(newsItem => pangu.spacingText(newsItem)),
  }

  /**
   * 按照指定顺序重新排序 JSON 对象的字段
   */
  function reorderFields<T extends Record<string, any>>(data: T): T {
    // 定义字段顺序
    const FIELD_ORDER = [
      'date',
      'news',
      'cover',
      'tip',
      'image',
      'link',
      'created',
      'created_at',
      'updated',
      'updated_at',
    ]

    const ordered: any = {}

    // 按照指定顺序添加字段
    for (const field of FIELD_ORDER) {
      if (field in data) {
        ordered[field] = data[field]
      }
    }

    // 添加任何未在 FIELD_ORDER 中列出的字段
    for (const key in data) {
      if (!FIELD_ORDER.includes(key)) {
        ordered[key] = data[key]
      }
    }

    // 删除 audio 字段
    delete ordered.audio

    return ordered
  }

  return reorderFields(formatted)
}
