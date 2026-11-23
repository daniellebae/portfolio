// cipher / decrypt text effect.
// every letter starts as an empty rectangle slot, scrambles through random glyphs,
// then locks into the real character, sweeping left to right.
// it only borrows react's text nodes for the ~1s it runs and puts the very same nodes back.
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789#%&*+=<>/?'
const rnd = () => GLYPHS[(Math.random() * GLYPHS.length) | 0]

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function done() { document.documentElement.classList.remove('dc-pending') }

export function decrypt(root) {
  if (!root || prefersReducedMotion()) { done(); return () => {} }

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(n) {
      if (!n.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      const p = n.parentElement
      if (!p || p.closest('[data-no-decrypt], script, style, textarea, .dc-wrap')) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)

  const chars = [], swaps = []
  for (const node of nodes) {
    const wrap = document.createElement('span')
    wrap.className = 'dc-wrap'
    for (const ch of node.nodeValue) {
      if (/\s/.test(ch)) { wrap.appendChild(document.createTextNode(ch)); continue }
      const s = document.createElement('span')
      s.className = 'dc'
      s.textContent = ch // the real glyph keeps the slot exactly one character wide
      wrap.appendChild(s)
      chars.push({ s, ch, state: 0, next: 0 })
    }
    node.parentNode.replaceChild(wrap, node)
    swaps.push([wrap, node])
  }
  done()
  if (!chars.length) return () => {}

  // fast and smooth: short text sweeps at ~14ms per letter, long paragraphs finish in under a second
  const stagger = Math.min(14, 520 / chars.length)
  chars.forEach((c, i) => {
    c.begin = i * stagger + Math.random() * 70
    c.end = c.begin + 110 + Math.random() * 150
  })

  let raf = 0, start = 0, finished = false
  function restore() {
    if (finished) return
    finished = true
    cancelAnimationFrame(raf)
    for (const [wrap, node] of swaps) if (wrap.parentNode) wrap.parentNode.replaceChild(node, wrap)
  }
  function frame(t) {
    if (!start) start = t
    const e = t - start
    let left = 0
    for (const c of chars) {
      if (c.state === 2) continue
      left++
      if (e >= c.end) { c.state = 2; c.s.className = ''; c.s.textContent = c.ch }
      else if (e >= c.begin) {
        if (c.state === 0) { c.state = 1; c.s.className = 'dc scr' }
        if (t >= c.next) { c.s.textContent = rnd(); c.next = t + 40 + Math.random() * 30 }
      }
    }
    if (left) raf = requestAnimationFrame(frame)
    else restore()
  }
  raf = requestAnimationFrame(frame)
  return restore
}
