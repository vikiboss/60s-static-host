import { formatSavedData, localeDate, localeTime } from '../src/utils'
import { parsePostViaLLM } from '../src/services/parser'
import type { SavedData } from '../src/services/storage'

const url = 'https://mp.weixin.qq.com/s?__biz=MzkyNDE4NDQ0Nw==&mid=2247498972&idx=1&sn=419f4b6a58665dd18dea556cb121bfbd&chksm=c0ba4b2863c90431bc47b725e6e50ab4c23389d90ae13d60a1b51ab7e35ff2ffefd88f107ec3#rd'

const parsed = await parsePostViaLLM(url)

const data: SavedData = {
  date: localeDate(),
  ...parsed,
  image: `https://cdn.jsdmirror.com/gh/vikiboss/60s-static-host@main/static/images/${localeDate()}.png`,
  cover: parsed.cover,
  link: url,
  created: localeTime(new Date()),
  created_at: new Date().getTime(),
  updated: localeTime(new Date()),
  updated_at: new Date().getTime(),
}

console.log(formatSavedData(data))

// import { wechat } from '../src/services/wechat'

// wechat
//   .fetchPosts({ fakeId: 'MzkyNDE4NDQ0Nw==', query: '7月30日 读懂世界' })
//   .then(console.log)
//   .catch(console.error)
