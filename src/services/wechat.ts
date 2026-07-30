import { debug } from '../utils'
import { DEFAULT_WECHAT_FAKE_ID, WECHAT_TOKEN, WECHAT_COOKIE, USER_AGENT } from '../constants'

class WeChat {
  constructor(
    private readonly token = WECHAT_TOKEN,
    private readonly cookie = WECHAT_COOKIE,
  ) {}

  get headers() {
    return {
      Cookie: this.cookie,
      'X-Requested-With': 'XMLHttpRequest',
      Referer: this.#createReferer(),
      'User-Agent': USER_AGENT,
    }
  }

  #createReferer() {
    const sp = new URLSearchParams({
      t: 'media/appmsg_edit_v2',
      action: 'edit',
      isNew: '1',
      type: '10',
      token: this.token,
      lang: 'zh_CN',
      timestamp: Date.now().toString(),
    })

    return `https://mp.weixin.qq.com/cgi-bin/appmsg?${sp.toString()}`
  }

  async fetchPosts(options: {
    fakeId?: string
    begin?: number
    count?: number
    query?: string
  }): Promise<{ isOK: boolean; posts: PostItem[]; count: number; error: string | null }> {
    const { fakeId = DEFAULT_WECHAT_FAKE_ID, query = '', begin = 0, count = 6 } = options

    debug('options', options)

    const sp = new URLSearchParams({
      action: 'list_ex',
      fakeid: fakeId,
      query,
      begin: begin.toString(),
      count: count.toString(),
      type: '9',
      need_author_name: '1',
      token: this.token,
      lang: 'zh_CN',
      f: 'json',
      ajax: '1',
    })

    const url = `https://mp.weixin.qq.com/cgi-bin/appmsg?${sp.toString()}`

    debug('url', url.toString())

    const response = await fetch(url, { headers: this.headers })

    if (response.status !== 200) {
      throw new Error(`fetch failed, status: ${response.status}, result: ${response.text()}`)
    }

    const data = (await response.json()) as {
      app_msg_cnt: number
      app_msg_list: PostItem[]
      base_resp: { ret: number; err_msg: string }
    }

    const isOK = data?.base_resp?.ret === 0

    debug('app_msg_cnt', data?.app_msg_cnt || null)
    debug('app_msg_list', data?.app_msg_list || null)

    debug(
      'app_msg_list title list',
      `\n${
        data?.app_msg_list
          ?.map((e, idx) => `${idx + 1}. ${e.title}`.replace(/<\/?em>/g, ''))
          ?.join('\n') || null
      }`,
    )

    return {
      isOK: isOK,
      posts: data?.app_msg_list || [],
      count: data?.app_msg_cnt || 0,
      error: isOK ? null : (data?.base_resp?.err_msg ?? JSON.stringify(data?.base_resp || {})),
    }
  }
}

export const wechat = new WeChat()

interface PostItem {
  aid: string
  album_id: string
  appmsg_album_infos: any[]
  appmsgid: number
  audio_info?: {
    audio_infos: {
      audio_id: string
      masssend_audio_id: string
      play_length: number
      title: string
      trans_state: number
      voice_verify_state: number
    }[]
  }
  author_name: string
  checking: number
  copyright_type: number
  cover: string
  create_time: number
  digest: string
  has_red_packet_cover: number
  is_pay_subscribe: number
  item_show_type: number
  itemidx: number
  link: string
  media_duration: string
  mediaapi_publish_status: number
  pay_album_info: {
    appmsg_album_infos: any[]
  }
  tagid: any[]
  title: string
  update_time: number
}
