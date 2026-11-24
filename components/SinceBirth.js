import { useEffect, useState } from 'react'

// live counter since jan 9, 2006, 4:30 am (pacific time). ticks on the real second.
const BORN = [2006, 1, 9, 4, 30, 0]
const TZ = 'America/Los_Angeles'
const UNITS = ['year', 'month', 'day', 'hour', 'minute', 'second']

let fmt
function nowParts() {
  fmt = fmt || new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23' })
  const o = {}
  fmt.formatToParts(new Date()).forEach(p => { o[p.type] = +p.value })
  return [o.year, o.month, o.day, o.hour % 24, o.minute, o.second]
}

function elapsed() {
  const n = nowParts()
  let [y, mo, d, h, mi, s] = n.map((v, i) => v - BORN[i])
  if (s < 0) { s += 60; mi-- }
  if (mi < 0) { mi += 60; h-- }
  if (h < 0) { h += 24; d-- }
  if (d < 0) { mo--; d += new Date(n[0], n[1] - 1, 0).getDate() } // days in last month
  if (mo < 0) { mo += 12; y-- }
  return [y, mo, d, h, mi, s]
}

export default function SinceBirth() {
  const [v, setV] = useState(null)
  useEffect(() => {
    let t
    const tick = () => { setV(elapsed()); t = setTimeout(tick, 1000 - (Date.now() % 1000) + 8) }
    tick()
    return () => clearTimeout(t)
  }, [])
  return (
    <p className="since" title="since jan 9, 2006 · 4:30 am">
      <span className="since-label">i’ve been here since:</span>{' '}
      {v ? UNITS.map((u, i) => (
        <span key={u} className="since-unit">
          <b key={i === 5 ? v[5] : undefined} className={i === 5 ? 'since-tick' : undefined}>{i > 2 ? String(v[i]).padStart(2, '0') : v[i]}</b>
          {' '}{u}{v[i] === 1 ? '' : 's'}
        </span>
      )) : <span className="since-unit">&nbsp;</span>}
    </p>
  )
}
