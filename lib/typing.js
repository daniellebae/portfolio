// the choppy, human typing rhythm shared by the hero greeting and the footer easter egg:
// uneven delays, longer beats after punctuation, the odd hesitation
export function typeDelay(text, n) {
  let d = 32 + Math.random() * 72
  if (Math.random() < 0.1) d += 110
  if ('!.?'.includes(text[n - 1])) d += 190
  return d
}
