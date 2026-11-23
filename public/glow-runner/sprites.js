/*
 * Glow Runner — pixel art data
 * --------------------------------------------------------------
 * Every sprite is a list of strings. Each character is one pixel,
 * looked up in `palette` ('.' = transparent).
 * Edit the strings directly, or use sprite-studio.html to paint
 * and then paste the exported file over this one.
 *
 * All player frames are the same height so the feet line up.
 */
window.GLOW_SPRITES = {
  palette: {
    '.': null,
    // the glowing character
    o: '#1f4a24', // outline
    g: '#b8ff9e', // body glow
    h: '#effff0', // highlight
    s: '#86e070', // shade
    k: '#0b1a0c', // eyes / mouth
    p: '#ff9ec4', // blush
    // obstacles
    t: '#c96a4a', T: '#8a3f2a',            // flower pot
    l: '#3f8f4f', L: '#69c776',            // leaves
    r: '#b84a5a', u: '#4a6ab8', y: '#d9b44a', w: '#e8e0c8', // books
    c: '#3d3660', e: '#ffd84a',            // cat
    m: '#cbbcec', M: '#8a78b8'             // moth
  },


  /*
   * Characters: the game switches to the next one every round.
   * `palette` overrides colours, `head` replaces the top 4 rows of the
   * upright frames (16 wide), `duckHead` replaces the top-left 5x3 of
   * the duck frames. Leave them out to keep the base art.
   */
  variants: [
    { name: 'Sprout' },
    { name: 'Leafy',
      palette: { g: '#d6f5a8', s: '#a9d978', h: '#f7ffe8' },
      head: [
        '.........lL.....',
        '........lLL.....',
        '........ll......',
        '........o.......'
      ],
      duckHead: ['.lL..', 'lLL..', '.l...'] },
    { name: 'Sleepy',
      palette: { g: '#a8f0d8', s: '#72cfb0', h: '#effffa', n: '#7b8fd9', N: '#5568b8', f: '#ffffff' },
      head: [
        '..........ff....',
        '........nnNf....',
        '......nnnnN.....',
        '.....NNNNNNN....'
      ],
      duckHead: ['...f.', '.nNf.', 'NNNN.'] },
    { name: 'Bow',
      palette: { g: '#e6f7b0', s: '#bcd97a', h: '#fdfff0', P: '#e0609a' },
      head: [
        '................',
        '.......pp.pp....',
        '.......ppPpp....',
        '.......pp.pp....'
      ],
      duckHead: ['p.p..', 'pPp..', 'p.p..'] },
    { name: 'Twinkle',
      palette: { g: '#c8f7a0', s: '#98d870' },
      head: [
        '........e.......',
        '......eeeee.....',
        '.......eee......',
        '.......e.e......'
      ],
      duckHead: ['..e..', 'eeeee', '.e.e.'] },
    { name: 'Shroom',
      palette: { g: '#b0f0b8', s: '#80d090' },
      head: [
        '......rrrr......',
        '.....rwrrwr.....',
        '....rrrrrrrr....',
        '....rrwrrrwr....'
      ],
      duckHead: ['.rr..', 'rwrr.', 'rrrr.'] }
  ],

  frames: {
    run1: [
      '........oo......',
      '.......ohho.....',
      '........oo......',
      '........o.......',
      '.....oooooo.....',
      '....ohhggggo....',
      '...ohggggggso...',
      '...ohggggggso...',
      '...oggkggkgso...',
      '...ogpggggpso...',
      '...ogggggggso...',
      '....oggggsso....',
      '.....oggggso....',
      '...oogggggsoo...',
      '.....oggggso....',
      '.....oggggso....',
      '.....ogo.ogo....',
      '....ogo...ogo...',
      '....oo.....oo...'
    ],
    run2: [
      '........oo......',
      '.......ohho.....',
      '........oo......',
      '........o.......',
      '.....oooooo.....',
      '....ohhggggo....',
      '...ohggggggso...',
      '...ohggggggso...',
      '...oggkggkgso...',
      '...ogpggggpso...',
      '...ogggggggso...',
      '....oggggsso....',
      '.....oggggso....',
      '...oogggggsoo...',
      '.....oggggso....',
      '.....oggggso....',
      '.....ogoogo.....',
      '......oggo......',
      '......oooo......'
    ],
    jump: [
      '........oo......',
      '.......ohho.....',
      '........oo......',
      '........o.......',
      '.....oooooo.....',
      '....ohhggggo....',
      '...ohggggggso...',
      '...ohggggggso...',
      '...oggkggkgso...',
      '...ogpggggpso...',
      '...ogggggggso...',
      '....oggggsso....',
      '...o.oggggso.o..',
      '...oogggggsoo...',
      '.....oggggso....',
      '.....oggggso....',
      '....oggo.oggo...',
      '....ooo..ooo....',
      '................'
    ],
    dead: [
      '........oo......',
      '.......ohho.....',
      '........oo......',
      '........o.......',
      '.....oooooo.....',
      '....ohhggggo....',
      '...ohggggggso...',
      '...ohkgkkgkso...',
      '...oggkggkgso...',
      '...ogkgkkgkso...',
      '...ogggkkggso...',
      '....oggggsso....',
      '.....oggggso....',
      '...oogggggsoo...',
      '.....oggggso....',
      '.....oggggso....',
      '.....ogo.ogo....',
      '....ogo...ogo...',
      '....oo.....oo...'
    ],
    duck1: [
      '..oo................',
      '.ohho...............',
      '..oo.oooooooooo.....',
      '....ohhggggggggo....',
      '...ohggggggggggso...',
      '...oggggggkggkgso...',
      '...ogggggpggggpso...',
      '...oggggggggggsso...',
      '....oggggggggsso....',
      '.....oooggggooo.....',
      '......ogo..ogo......',
      '.....ogo....ogo.....',
      '.....oo......oo.....'
    ],
    duck2: [
      '..oo................',
      '.ohho...............',
      '..oo.oooooooooo.....',
      '....ohhggggggggo....',
      '...ohggggggggggso...',
      '...oggggggkggkgso...',
      '...ogggggpggggpso...',
      '...oggggggggggsso...',
      '....oggggggggsso....',
      '.....oooggggooo.....',
      '.......ogoogo.......',
      '........oggo........',
      '........oooo........'
    ],

    plant: [
      '....l.....',
      '..l.lL.l..',
      '.lL.lL.Ll.',
      '.lLllLlLl.',
      '..lLlLLl..',
      '...lLLl...',
      '....ll....',
      '.TTTTTTTT.',
      '.tttttttt.',
      '..tttttt..',
      '..tttttt..',
      '..tttttT..',
      '...TTTT...'
    ],
    books: [
      '..rrrrrrrr..',
      '..rwwwwwwr..',
      '..rrrrrrrr..',
      '.uuuuuuuuuu.',
      '.uwwwwwwwwu.',
      '.uuuuuuuuuu.',
      'yyyyyyyyyyy.',
      'ywwwwwwwwwy.',
      'yyyyyyyyyyy.'
    ],
    cat: [
      '.c.....c....',
      '.cc...cc....',
      '.ccccccc....',
      '.cecccec....',
      '.ccccccc....',
      '..ccccc.....',
      '..cccccc....',
      '.cccccccc...',
      '.cccccccc.c.',
      '.cccccccc.c.',
      '.cccccccccc.',
      '..cc..cc....'
    ],
    moth1: [
      'mm.......mm',
      'mmm.....mmm',
      'mmmm.M.mmmm',
      '.mmmMMMmmm.',
      '....MMM....',
      '.....M.....'
    ],
    moth2: [
      '...........',
      '...........',
      '.....M.....',
      'mmmmMMMmmmm',
      'mmmm.M.mmmm',
      '.mm.....mm.'
    ]
  }
};
