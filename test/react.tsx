import fs from 'node:fs'
import { use } from 'react'
import { renderer } from '../src/services/renderer'
import { NewsCard } from '../src/components/news'

const Card = (props: { data: string[]; image: string }) => {
  const fetchedData = use(fetchData())

  return (
    <div className='text-xs size-full'>
      <div>List</div>
      <pre>{JSON.stringify(fetchedData, null, 2)}</pre>
      <div>
        {props.data.map((item, idx) => (
          <div key={item} className={idx % 2 === 0 ? 'text-amber-500' : 'text-lime-500'}>
            {item}
          </div>
        ))}
      </div>
      <img className='w-100px h-auto' src={props.image} alt='sorry' />
    </div>
  )
}

const fetchData = async () => await (await fetch('https://60s.viki.moe/v2/60s')).json()

async function renderReactComponent() {
  await renderer.prepare()

  const data = await fetchData()
  const buffer = await renderer.render(<NewsCard data={data} />)
  // const buffer = await renderer.render(<Card data={data} image={data.image} />)

  fs.writeFileSync('test/screenshot.png', buffer)

  await renderer.destroy()
}

renderReactComponent()
