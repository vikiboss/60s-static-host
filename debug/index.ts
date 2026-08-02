import { parsePostViaLLM } from '../src/services/parser'

const url =
  'https://mp.weixin.qq.com/s/1ZhaR1E_77o6aADmO2dUyA'

await parsePostViaLLM(url)

// import { wechat } from '../src/services/wechat'

// wechat
//   .fetchPosts({ fakeId: 'MzkyNDE4NDQ0Nw==', query: '7月30日 读懂世界' })
//   .then(console.log)
//   .catch(console.error)
