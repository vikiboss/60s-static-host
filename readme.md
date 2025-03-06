# 60s Static Data Host

![Update Status](https://github.com/vikiboss/60s-static-host/workflows/schedule/badge.svg)

A lightweight repository hosting daily news data, automatically updated via GitHub Actions.

## Overview

- 🔄 Auto-updates daily
- 📰 Stores curated news data
- 🚀 Fast static hosting
- 🔑 Easy data access
- 📊 REST API friendly & JSON format

## Usage

Access the latest data through:

- Vercel CDN: https://60s-static-host.vercel.app
- GitHub Raw URL: https://raw.githubusercontent.com
- jsDelivr CDN: https://cdn.jsdelivr.net/gh

> [!TIP]
> Replace `[yyyy]-[MM]-[dd]` with the desired date in `YYYY-MM-DD` format, such as `2025-02-08`.

- Vercel CDN: `https://60s-static-host.vercel.app/60s/[yyyy]-[MM]-[dd].json`
- GitHub Raw URL: `https://raw.githubusercontent.com/vikiboss/60s-static-host/refs/heads/main/static/60s/[yyyy]-[MM]-[dd].json`
- jsDelivr CDN: `https://cdn.jsdelivr.net/gh/vikiboss/60s-static-host@main/static/60s/[yyyy]-[MM]-[dd].json`

Example:

- GitHub Raw URL: https://60s-static-host.vercel.app/60s/2025-03-01.json
- GitHub Raw URL: https://raw.githubusercontent.com/vikiboss/60s-static-host/refs/heads/main/static/60s/2025-03-01.json
- jsDelivr CDN: https://cdn.jsdelivr.net/gh/vikiboss/60s-static-host@main/static/60s/2025-03-01.json

## Data Format Example

All data is stored in JSON format with consistent structure, for example:

```json
{
  "date": "2025-03-01",
  "news": [
    "证监会：东方集团披露的2020年至2023年财务信息严重不实，涉嫌重大财务造假，可能触及重大违法强制退市情形",
    "湖南沅陵通报\"两船相撞致14人失联\"：截至2月28日晚，该起事故已致11人遇难，仍有5人失联",
    "湖南长沙发布物业收费新规，空置房实行阶梯式优惠，媒体：有助于减轻住房持有成本、鼓励住房消费",
    "黄山：3月3日起，黄山风景区、花山谜窟景区、太平湖景区三大景区对女性免门票7天，需至少提前1天预约",
    "国家统计局：2024年GDP同比增长5%，人均超9.5万元！居民人均可支配收入41314元，比上年增长5.3%",
    "28日，余华英被执行死刑，10年间拐卖17名儿童，连亲生骨肉也卖",
    "现货黄金跳水：一周内金价自高点回落逾一百美元，金饰克价3天跌了18元",
    "美方威胁以芬太尼问题为由对中国再加征10%关税，中方：望美方不要一错再错",
    "美媒：美商务称已有25万人排队买特朗普移民金卡，将带来1.25万亿美元收入，美智库警告投资者或成\"冤大头\"",
    "美媒：特朗普计划签署行政命令，将首次确定英语为美国官方语言",
    "28日，比特币突然崩了！跌破81000美元，超15万人爆仓，近段时间，比特币被不断抛售，从峰值下跌了25%",
    "尼加拉瓜宣布退出联合国人权理事会：滥用人权作为干预他国内政的借口",
    "美媒：美国公布爱泼斯坦案首批文件，包括通讯录和“按摩师”名单等，有近百页被大段涂黑，美司法部长斥FBI私藏数千页文件不提交",
    "微软宣布：已有21年历史的Skype，将于今年5月5日关停，建议用户迁移至Teams",
    "当地28日，特朗普与泽连斯基会晤不欢而散，双方多次发生争论。美方：不再谈了直接签，协议不含任何美国支持乌方的承诺！特朗普：泽连斯基不尊重美国，可以在准备好实现和平时再回来，泽连斯基：至少要一句安全保障"
  ],
  "audio": {
    "music": "https://res.wx.qq.com/voice/getvoice?mediaid=MzU2MDU4NDE1MV8yMjQ3NTI4NDY4",
    "news": "https://res.wx.qq.com/voice/getvoice?mediaid=MzU2MDU4NDE1MV8yMjQ3NTI4NDY3"
  },
  "tip": "不是每一次努力都会有收获，但是，每一次收获都必须努力，这是一个不公平的不可逆转的命题",
  "cover": "https://mmbiz.qpic.cn/sz_mmbiz_jpg/ftdBHhoElSUZiaskicl9Dic4U8BRibRUECnOm8ibvSWmmwshWYbrfjbribylhgqpx93JKib7tuo3emKrbTTnheibHwAKOQ/0?wx_fmt=jpeg",
  "link": "http://mp.weixin.qq.com/s?__biz=MzU2MDU4NDE1MQ==&mid=2247528469&idx=1&sn=bcf94efabe2079f576e694591c4400c3",
  "created": "2025/03/01 07:00:00",
  "created_at": 1740783600000,
  "updated": "2025/03/01 07:00:00",
  "updated_at": 1740783600000
}
```

## License

MIT
