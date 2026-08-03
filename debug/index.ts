import { formatSavedData, localeDate, localeTime } from '../src/utils'
import { parsePostViaLLM } from '../src/services/parser'
import type { SavedData } from '../src/services/storage'

const url = 'https://mp.weixin.qq.com/s/XoOERCD6a1FsTxl3hgPW4A'

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
