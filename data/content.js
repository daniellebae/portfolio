// ✏️ Edit everything here. Replace placeholders when you send me your materials.
export const site = {
  name: 'danielle',
  email: 'daniellebae06@gmail.com',
  resume: '/files/resume.pdf',
  portrait: '/images/portrait.jpg', // your photo (right side of the hero)
  // about me: english + korean, switched with the red stamp
  about: {
    en: {
      title: 'my name is danielle bae.',
      body: [
        'i study at the university of washington’s foster school of business, where i’m pursuing a double major in marketing and information systems.',
        'born into a household where korean was the primary language, i grew up fluent in my mother tongue, thanks to my parents.',
        'i think language is truly a gift. growing up bilingual has allowed me to connect with people across different backgrounds, including within my own family. it’s given me a way to bridge the gaps between generations and cultures, particularly with my grandmother, whose world and experiences differ from my own. it’s also taught me that some things simply don’t translate. there are words, expressions, and sentiments in korean that don’t quite exist in english, and i’ve come to appreciate the beauty of being able to understand both.',
        'my love for language and expression quickly evolved into something more tangible: marketing and writing. i have been responsible for marketing across nearly all of my school engagements: consulting clubs (american marketing association agency, business impact group), case competitions, internships and jobs (leonard resource group, livewell @ uw), and other registered student organizations (dubhacks next, uw’s premier undergraduate startup incubator). i’ve been involved in editorial work since freshman year of high school, and am proud to still have a home in writing through the daily @ uw.',
        'outside of everything, i spend my free time vlogging (and editing), learning motion graphics, and endlessly scrolling through different fujifilm cameras (i’m currently saving up for one). i love watching documentaries (my octopus teacher, you can see everything, and just about any nature/climate documentary), movies (whiplash, interstellar, begin again), and kdramas (misaeng, my liberation notes, reply 1988).',
        'i like to touch grass as well! i enjoy trekking through pnw hikes, driving along the coast and picnicking at the beach, and playing tennis (all three are infinitely better with friends).',
        'thanks for sticking by! scroll all the way to the end for a surprise :)',
      ],
      facts: [['based in', 'seattle'], ['studying', 'marketing + information systems'], ['currently', 'leading marketing for RSOs']],
      stamp: 'KOR', hint: 'click me', switchLabel: 'read my bio in korean',
    },
    ko: {
      title: '배시원 입니다 :)',
      body: [
        '저는 유덥 포스터 경영대학에서 마케팅과 정보시스템을 복수전공하고 있습니다.',
        '한국어를 주로 사용하는 가정에서 태어나고 자라, 부모님 덕분에 자연스럽게 한국어를 모국어로 익히며 자랐습니다.',
        '저는 언어가 정말 소중한 선물이라고 생각합니다. 두 언어를 사용하며 자란 덕분에 다양한 배경을 가진 사람들과 소통하고 관계를 맺을 수 있었고, 그중에서도 가족과의 소통은 제게 특히 의미가 있습니다. 특히 저와는 다른 세대와 문화, 그리고 삶의 경험을 가진 할머니와도 언어를 통해 서로를 이해하고 소통할 수 있었습니다. 동시에 모든 것이 언어로 완벽하게 전달되는 것은 아니라는 사실도 깨닫게 되었습니다. 한국어에는 영어로 온전히 표현하기 어려운 단어와 표현, 그리고 그 안에 담긴 감정들이 있습니다. 두 언어를 모두 이해할 수 있다는 것, 그리고 각 언어만이 전할 수 있는 고유한 의미를 알아갈 수 있다는 것이 참 좋습니다.',
        '언어와 표현에 대한 저의 관심은 자연스럽게 마케팅과 글쓰기라는 보다 구체적인 관심사로 발전했습니다. 학교에서 참여한 거의 모든 활동에서 마케팅 관련 업무를 맡아왔습니다. 컨설팅 동아리(american marketing association agency, business impact group), 케이스 경진대회, 인턴십 및 직장 경험(leonard resource group, livewell @ uw), 그리고 기타 교내 등록 학생 단체(dubhacks next, 유덥의 대표적인 학부생 스타트업 인큐베이터) 등이 그 예입니다. 고등학교 1학년 때부터 편집 및 출판 활동에 참여해 왔으며, 현재도 the daily @ uw를 통해 글쓰기를 이어가고 있다는 점이 자랑스럽습니다.',
        '이런 활동들 외에도 여가 시간에는 브이로그를 촬영하고 편집하거나, 모션 그래픽을 배우고, 다양한 후지필름 카메라를 끊임없이 찾아보곤 합니다(현재 한 대를 구매하기 위해 열심히 저축 중이에요). 다큐멘터리(my octopus teacher, you can see everything, 그리고 자연과 기후를 다룬 다큐멘터리라면 무엇이든), 영화(whiplash, interstellar, begin again), 그리고 한국 드라마(미생, 해방일지, 응답하라 1988)를 즐겨 봅니다.',
        '물론, 밖에 나가 자연을 즐기기도 합니다 :) 태평양 북서부 지역의 하이킹 코스를 누비고, 해안 도로를 따라 드라이브하며 해변에서 피크닉을 즐기고, 테니스도 칩니다. 이 세 가지 모두 친구들과 함께할 때 훨씬 더 즐겁습니다.',
        '끝까지 읽어주셔서 감사합니다! 맨 아래까지 스크롤하면 작은 깜짝 선물이 기다리고 있어요 :)',
      ],
      facts: [['거주지', '시애틀'], ['전공', '마케팅 + 정보시스템'], ['현재', '학생 단체 마케팅 리드']],
      stamp: '영어', hint: '눌러주세요', switchLabel: '영어로 소개 읽기',
    },
  },
}
export const gallery = [ // add files to /public/images/gallery and list them here
  // title is the photo's description (alt text) and its caption when enlarged
  { src: '/images/gallery/01.jpg', title: 'two people wading through the shallows at sunset' },
  { src: '/images/gallery/02.jpg', title: 'friends and a dog on the beach at golden hour' },
]
// ✏️ campaigns: each card opens its own page at /campaigns/<slug>
//   image:   the cover shown on the card
//   graphics: every graphic for that campaign (shown in a grid; click to enlarge)
//   details: paragraphs telling the story; results: short bullet points
export const campaigns = [
  {
    slug: 'campaign-one', org: 'RSO name', title: 'campaign title', type: 'social + graphics', date: '2026',
    blurb: 'one line about the goal and the result.',
    image: '',
    graphics: [{ src: '', caption: 'graphic caption' }, { src: '', caption: 'graphic caption' }, { src: '', caption: 'graphic caption' }],
    role: 'marketing director',
    details: ['the brief: what the organization needed and who it was for.', 'what i made: the concept, the visual direction, and how the pieces worked together.'],
    results: ['a result, e.g. +40% event sign-ups', 'another result, e.g. 2.1k impressions in a week'],
  },
  {
    slug: 'campaign-two', org: 'RSO name', title: 'campaign title', type: 'social + graphics', date: '2026',
    blurb: 'one line about the goal and the result.',
    image: '',
    graphics: [{ src: '', caption: 'graphic caption' }, { src: '', caption: 'graphic caption' }],
    role: 'marketing lead',
    details: ['the brief: what the organization needed and who it was for.', 'what i made: the concept, the visual direction, and how the pieces worked together.'],
    results: ['a result', 'another result'],
  },
  {
    slug: 'campaign-three', org: 'RSO name', title: 'campaign title', type: 'social + graphics', date: '2025',
    blurb: 'one line about the goal and the result.',
    image: '',
    graphics: [{ src: '', caption: 'graphic caption' }, { src: '', caption: 'graphic caption' }, { src: '', caption: 'graphic caption' }],
    role: 'designer',
    details: ['the brief: what the organization needed and who it was for.', 'what i made: the concept, the visual direction, and how the pieces worked together.'],
    results: ['a result', 'another result'],
  },
]

// ✏️ written works: each opens its own page at /writing/<slug>
//   body: the full piece (blank lines between paragraphs; for poems, line breaks are kept)
//   link: optional, the original publication (shows a "read the original" button)
export const writings = [
  { slug: 'article-one', kind: 'article', title: 'placeholder article title', date: '2026', publication: 'the daily @ uw', blurb: 'a short teaser.', link: '',
    body: 'the full article goes here.\n\nleave a blank line between paragraphs.' },
  { slug: 'poem-one', kind: 'poem', title: 'placeholder poem title', date: '2026', publication: '', blurb: 'a short teaser.', link: '',
    body: 'the poem goes here,\nline by line,\nexactly as you want it.\n\na blank line starts a new stanza.' },
  { slug: 'article-two', kind: 'article', title: 'placeholder article title', date: '2025', publication: 'the daily @ uw', blurb: 'a short teaser.', link: '',
    body: 'the full article goes here.' },
]

export const poemDirectory = [ // the easter egg: poems you love
  { title: 'poem title', author: 'poet name', text: 'poem text goes here.\nline breaks are kept.' },
]
