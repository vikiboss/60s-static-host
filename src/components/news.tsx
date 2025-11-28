import { SolarDay } from 'tyme4ts'
import { localeTime } from '../utils'

interface NewsData {
  date: string
  news: string[]
  tip: string
  created_at: number
}

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

function getDayOfWeek(date?: string) {
  const day = date ? new Date(date) : new Date()
  return `星期${WEEK_DAYS[day.getDay()]}`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return { month: date.getMonth() + 1, day: date.getDate(), year: date.getFullYear() }
}

function Slash() {
  return <span className='mx-1 text-stone-500/36'>/</span>
}

export function NewsCard({ data }: { data: NewsData }) {
  const { month, day, year } = formatDate(data.date)
  const lunarDate = SolarDay.fromYmd(year, month, day).getLunarDay().toString().replace('农历', '')

  return (
    <div className='inline-flex flex-col w-2xl mx-auto bg-gradient-to-br from-stone-50/95 via-amber-50/90 to-stone-100/95 relative overflow-hidden'>
      <div className='absolute inset-0 opacity-[0.02]'>
        <div className='absolute top-12 left-8 w-2 h-2 bg-amber-400 rounded-full'></div>
        <div className='absolute top-20 right-12 w-1 h-1 bg-stone-400 rounded-full'></div>
        <div className='absolute bottom-20 left-12 w-1.5 h-1.5 bg-amber-300 rounded-full'></div>
      </div>

      <div className='absolute top-0 left-1/2 transform -translate-x-1/2 flex items-center space-x-2'>
        <div className='w-16 h-0.5 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent rounded-full'></div>
        <div className='w-1.5 h-1.5 bg-amber-400/50 rounded-full'></div>
        <div className='w-16 h-0.5 bg-gradient-to-l from-transparent via-amber-400/60 to-transparent rounded-full'></div>
      </div>

      <div className='bg-gradient-to-r from-stone-50/80 via-amber-50/60 to-stone-50/80 px-8 py-6 border-b border-stone-200/60'>
        <div className='flex flex-row items-center justify-between gap-4 relative'>
          <div className='absolute -top-2 left-1/2 transform -translate-x-1/2 flex space-x-1'>
            <div className='w-0.5 h-0.5 bg-amber-400/40 rounded-full'></div>
            <div className='w-1 h-0.5 bg-amber-300/40 rounded-full'></div>
            <div className='w-0.5 h-0.5 bg-amber-400/40 rounded-full'></div>
          </div>

          <div className='text-left shrink-0 flex flex-col gap-1'>
            <h1 className='text-3xl font-light text-stone-700 tracking-[0.15rem] leading-tight my-1'>
              每天 <span className='font-medium text-amber-600 tracking-normal'>60s</span> 读懂世界
            </h1>
            <div className='text-md text-stone-600 tracking-[0.15rem] font-light leading-tight'>
              <span>
                {year}年{month}月{day}日
              </span>
              <span className='mx-2 text-amber-500/60'>❋</span>
              <span>
                农历<span className='font-bold mx-1'>·</span>
                {lunarDate}
              </span>
            </div>
          </div>

          <div className='w-[3px] h-16 bg-stone-400/42 transform -skew-x-16'></div>

          <div className='flex-shrink-0 font-light text-right text-6xl text-stone-700 tracking-[0.3rem]'>
            {getDayOfWeek(data.date)}
          </div>
        </div>
      </div>

      <div className='px-8 py-5 bg-gradient-to-b from-white/80 to-stone-50/60 relative'>
        <div className='absolute top-4 right-6 w-8 h-px bg-gradient-to-r from-amber-200/30 to-transparent'></div>

        <div className='space-y-3'>
          {data.news.map((item, index) => (
            <div key={index} className='flex space-x-4'>
              <div className='flex-shrink-0 w-4 h-4 rounded-full bg-stone-200/60 flex items-center justify-center text-[10px] text-stone-500 border border-stone-300/60 translate-y-[3px]'>
                {String(index + 1)}
              </div>
              <div className='flex-1'>
                <p className='text-stone-800 text-base leading-6 tracking-wide break-words'>
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='relative bg-amber-50/50 border-t border-stone-300/50 px-8 py-4'>
        <div className='text-center relative'>
          <div className='relative inline-block'>
            <p className='text-stone-700 leading-relaxed text-center px-4 italic relative z-10'>
              <span className='font-bold text-amber-700/32 mx-2'>「</span>
              {data.tip}
              <span className='font-bold text-amber-700/32 mx-2'>」</span>
            </p>
            <div className='absolute inset-0 bg-amber-50/30 rounded-lg transform rotate-0.5 scale-105 -z-10'></div>
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-r from-stone-100/70 via-amber-50/40 to-stone-100/70 border-t border-stone-300/50 px-8 py-5'>
        <div className='flex items-center justify-between text-[10px] relative'>
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-px bg-gradient-to-r from-transparent via-amber-300/30 to-transparent'></div>

          <div className='text-stone-500 text-left space-y-1.5'>
            <div className='tracking-wide'>
              新闻联播
              <Slash />
              人民日报
              <Slash />
              新华网
              <Slash />
              腾讯新闻
              <Slash />
              环球网
              <Slash />
              澎湃新闻
            </div>
            <div className='tracking-wide'>
              共 {data.news.length} 条国内外精选新闻
              <Slash />
              更新于 {localeTime(data.created_at)}
            </div>
          </div>

          <div className='text-stone-500 text-right space-y-1.5'>
            <div className='tracking-wide'>@GitHub vikiboss/60s</div>
            <div className='tracking-wide'>
              React 界面
              <Slash />
              TailwindCSS 样式
              <Slash />
              Puppeteer 渲染
              <Slash />
              抖音美好体
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
