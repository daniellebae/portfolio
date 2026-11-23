import { useEffect, useRef } from 'react'
import { decrypt } from '../lib/decrypt'
// decrypts its children the first time they scroll into view.
// `early` hides the text until the effect starts, for things visible on first paint.
export default function Decrypt({ as: Tag = 'span', early = false, children, ...rest }) {
  const ref = useRef(null)
  useEffect(() => {
    let cancel = () => {}
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { io.disconnect(); cancel = decrypt(ref.current) }
    })
    ref.current && io.observe(ref.current)
    return () => { io.disconnect(); cancel() }
  }, [])
  return <Tag ref={ref} data-decrypt-early={early ? '' : undefined} {...rest}>{children}</Tag>
}
