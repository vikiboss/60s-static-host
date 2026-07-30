import path from 'node:path'

// prettier-ignore
export const WECHAT_ACCOUNTS = [
  { name: '小叮读报', query: '天下事', fakeId: 'MzkyNDE4NDQ0Nw==', wechatId: '未设置' }, // 最早的备用号
  { name: '早间一分钟小读', query: '小读', fakeId: 'Mzk0MDY1MjUzMA==', wechatId: 'ZJYFZXD' }, // 更新时间较早
  { name: '每天60秒知天下', query: '知天下', fakeId: 'MzIxNzczMjE0OQ==', wechatId: 'zhitx365' }, // 更新时间较早
  // { name: '每天60秒读懂世界', query: '读懂世界', fakeId: 'MzkwNDc5NTA0Mw==', wechatId: 'mt36501' }, // 白咖啡主号
  // { name: '每天1分钟读世界', query: '读懂世界', fakeId: 'Mzk3NTMzOTU1Mg==', wechatId: 'new60s' }, // 蓝色备用号
  // { name: '每天3分钟读懂世界', query: '读懂世界', fakeId: 'MzkwNjY1ODIxNw==', wechatId: 'hao36501' }, // 紫色备用号
  // { name: '每天100秒读懂世界', query: '读懂世界', fakeId: 'Mzg3NTQ0MjQwNg==', wechatId: 'TT100s-News' }, // 有图片的号，但有广告
]

export const IS_IN_CI = !!process.env.CI

export const DEFAULT_WECHAT_FAKE_ID = WECHAT_ACCOUNTS[0]?.fakeId ?? ''
export const WECHAT_TOKEN = process.env.WECHAT_TOKEN ?? ''
export const WECHAT_COOKIE = process.env.WECHAT_COOKIE ?? ''
export const USER_AGENT = 'Mozilla/5.0 AppleWebKit/537.36 Chrome/132.0.0.0 Safari/537.36'

export const PROJECT_ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '')

export const PATHS = {
  STATIC_60S: path.resolve(PROJECT_ROOT, 'static/60s'),
  STATIC_IMAGES: path.resolve(PROJECT_ROOT, 'static/images'),
}
