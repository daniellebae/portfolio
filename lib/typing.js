// the choppy, human typing rhythm shared by the hero greeting and the footer easter egg:
// uneven delays, longer beats after punctuation, the odd hesitation
export function typeDelay(text, n) {
  let d = 50 + Math.random() * 110
  if (Math.random() < 0.12) d += 160
  if ('!.?'.includes(text[n - 1])) d += 260
  return d
}
