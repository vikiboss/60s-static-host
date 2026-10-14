import { formatSavedData, localeDate, localeTime } from '../src/utils'
import { parsePostViaLLM } from '../src/services/parser'
import type { SavedData } from '../src/services/storage'

const url = 'https://mp.weixin.qq.com/s?__biz=MzkyNDE4NDQ0Nw==&mid=2247498883&idx=1&sn=4a427a0ac109208af8c11e3b8c65ebe6&chksm=c05a7a9a910d833a628e4cd98f06259be7128125226eb80c22e0fafab86ab1aa17ebac5ffb90#rd'

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
