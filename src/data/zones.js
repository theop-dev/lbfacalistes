// Polygon zones using real MediaPipe Face Mesh landmark indices.
// Each `poly` is an ORDERED list of landmark indices forming the zone boundary.
// Drawn as filled paths that perfectly follow face contours.
//
// Mirror note: canvas + video are CSS scaleX(-1).
// MP "left" (low x) = user's RIGHT (appears on RIGHT of mirrored screen).
// MP "right" (high x) = user's LEFT (appears on LEFT of mirrored screen).

const ZONES = [
  // ── FOREHEAD ─────────────────────────────────────────────────────────────
  // Top: face silhouette. Bottom: top edge of eyebrows + glabella.
  {
    id: 'forehead',
    name: 'Front',
    icon: '✦',
    color: '#FF9A82',
    poly: [
      10, 338, 297, 332, 284, 251, 389, 356,
      // jump to right eyebrow outer (user left, MP right)
      300, 293, 334, 296, 336,
      // glabella bridge
      9,
      // left eyebrow top (user right, MP left)
      107, 66, 105, 63, 70, 46,
      // up left face silhouette
      21, 54, 103, 67, 109,
    ],
    desc: 'Rides, hydratation, texture, éclat',
    tips: ['Appliquer sérum en mouvements ascendants', 'Toujours terminer avec un SPF', 'Zone la plus exposée au soleil'],
    tutorials: [
      { title: 'Routine anti-rides pour le front', q: 'routine soin anti-rides front visage beauté', dur: '~8 min' },
      { title: 'Appliquer sérum et crème hydratante', q: 'appliquer sérum hydratant visage technique', dur: '~6 min' },
      { title: 'Maquillage : lisser le front sans cake', q: 'maquillage fond de teint naturel front astuces', dur: '~5 min' },
    ],
  },

  // ── EYEBROWS (exact MediaPipe connections) ────────────────────────────────
  {
    id: 'right_brow', // user RIGHT, MP left
    name: 'Sourcil droit',
    icon: '〰',
    color: '#C88CFF',
    // Top edge: 46→53→52→65→55 | Bottom edge: 70→63→105→66→107
    poly: [46, 53, 52, 65, 55, 107, 66, 105, 63, 70],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser d\'abord dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait', 'Fixer avec un gel transparent'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage technique naturel', dur: '~5 min' },
      { title: 'Sourcils selon la forme du visage', q: 'sourcils forme visage architecture beauté tutoriel', dur: '~8 min' },
    ],
  },
  {
    id: 'left_brow', // user LEFT, MP right
    name: 'Sourcil gauche',
    icon: '〰',
    color: '#C88CFF',
    // Top edge: 276→283→282→295→285 | Bottom edge: 300→293→334→296→336
    poly: [276, 283, 282, 295, 285, 336, 296, 334, 293, 300],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser d\'abord dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait', 'Fixer avec un gel transparent'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage technique naturel', dur: '~5 min' },
    ],
  },

  // ── EYES (exact MediaPipe closed-loop connections) ────────────────────────
  {
    id: 'right_eye', // user RIGHT, MP left eye
    name: 'Œil droit',
    icon: '👁',
    color: '#6EB4FF',
    // Complete eye contour loop from MediaPipe FACEMESH_LEFT_EYE
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    desc: 'Eye-liner, mascara, cils, iris',
    tips: ['Tirer le trait d\'eye-liner en une seule ligne', 'Appliquer le mascara en zigzag à la base des cils'],
    tutorials: [
      { title: 'Eye-liner parfait pour débutantes', q: 'eye liner parfait tutoriel débutante technique', dur: '~9 min' },
      { title: 'Mascara : cils plus longs et plus volumineux', q: 'mascara cils longs volume tutoriel technique', dur: '~6 min' },
      { title: 'Agrandir les yeux avec le maquillage', q: 'agrandir yeux maquillage technique tutoriel', dur: '~8 min' },
    ],
  },
  {
    id: 'left_eye', // user LEFT, MP right eye
    name: 'Œil gauche',
    icon: '👁',
    color: '#6EB4FF',
    // Complete eye contour loop from MediaPipe FACEMESH_RIGHT_EYE
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466],
    desc: 'Eye-liner, mascara, cils, iris',
    tips: ['Tirer le trait d\'eye-liner en une seule ligne', 'Appliquer le mascara en zigzag à la base des cils'],
    tutorials: [
      { title: 'Eye-liner parfait pour débutantes', q: 'eye liner parfait tutoriel débutante technique', dur: '~9 min' },
      { title: 'Mascara : cils plus longs et plus volumineux', q: 'mascara cils longs volume tutoriel technique', dur: '~6 min' },
    ],
  },

  // ── UNDER-EYE / CERNES ───────────────────────────────────────────────────
  // Region between lower eyelid and upper cheek
  {
    id: 'right_undereye', // user RIGHT, MP left side
    name: 'Cerne droit',
    icon: '◔',
    color: '#96E6FF',
    // Lower arc of left eye + infraorbital landmarks below
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 243, 112, 26, 22, 23, 24, 110, 25, 130],
    desc: 'Cernes, poches, anti-fatigue',
    tips: ['Tapoter — ne jamais frotter', 'Teinte 1 demi-ton plus claire que le fond de teint', 'Crème contour des yeux matin et soir'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
      { title: 'Choisir la bonne teinte de correcteur', q: 'choisir teinte correcteur cernes maquillage', dur: '~6 min' },
    ],
  },
  {
    id: 'left_undereye', // user LEFT, MP right side
    name: 'Cerne gauche',
    icon: '◔',
    color: '#96E6FF',
    // Lower arc of right eye + infraorbital landmarks below
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 463, 341, 256, 252, 253, 254, 339, 255, 359],
    desc: 'Cernes, poches, anti-fatigue',
    tips: ['Tapoter — ne jamais frotter', 'Teinte 1 demi-ton plus claire que le fond de teint', 'Crème contour des yeux matin et soir'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
    ],
  },

  // ── NOSE (full nose region) ───────────────────────────────────────────────
  {
    id: 'nose',
    name: 'Nez',
    icon: '◈',
    color: '#FFD45A',
    // Nose outline: bridge top → sides → tip → base
    poly: [168, 193, 122, 196, 3, 51, 45, 4, 275, 281, 248, 456, 420, 429, 358, 2, 97, 99, 60, 75, 240, 115, 49, 129, 64],
    desc: 'Contouring, pores, arête, pointe',
    tips: ['Highlighter fin sur l\'arête pour l\'élever', 'Contouring sur les côtés pour affiner', 'Nettoyer les pores régulièrement'],
    tutorials: [
      { title: 'Contouring du nez : affinement visuel', q: 'contouring nez affinement tutoriel maquillage', dur: '~7 min' },
      { title: 'Highlighter arête du nez : effet nose-job', q: 'highlighter arête nez nose job makeup tutoriel', dur: '~5 min' },
      { title: 'Éliminer les points noirs du nez', q: 'éliminer points noirs nez routine soin efficace', dur: '~6 min' },
    ],
  },

  // ── NOSTRILS ─────────────────────────────────────────────────────────────
  {
    id: 'right_nostril', // user RIGHT, MP left side
    name: 'Aile droite du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [64, 49, 115, 220, 45, 4, 1, 19, 94, 2, 164, 0, 165, 167, 164, 393],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Exfoliant doux sur les ailes', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
      { title: 'Maquillage pour minimiser les ailes du nez', q: 'maquillage minimiser ailes nez contouring', dur: '~6 min' },
    ],
  },
  {
    id: 'left_nostril', // user LEFT, MP right side
    name: 'Aile gauche du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [294, 279, 344, 440, 275, 4, 1, 19, 94, 2, 164, 0, 391, 393, 164, 167],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Exfoliant doux sur les ailes', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
      { title: 'Maquillage pour minimiser les ailes du nez', q: 'maquillage minimiser ailes nez contouring', dur: '~6 min' },
    ],
  },

  // ── CHEEKBONES / POMMETTES ────────────────────────────────────────────────
  {
    id: 'right_cheekbone', // user RIGHT, MP left
    name: 'Pommette droite',
    icon: '✧',
    color: '#FFAAD2',
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112],
    desc: 'Highlighter, illuminateur, sculpture',
    tips: ['Highlighter sur le point le plus haut', 'Sourire pour trouver l\'emplacement exact du blush'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
    ],
  },
  {
    id: 'left_cheekbone', // user LEFT, MP right
    name: 'Pommette gauche',
    icon: '✧',
    color: '#FFAAD2',
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 463, 414, 286, 258, 257, 259, 260, 467, 359, 255, 339, 254, 253, 252, 256, 341],
    desc: 'Highlighter, illuminateur, sculpture',
    tips: ['Highlighter sur le point le plus haut', 'Sourire pour trouver l\'emplacement exact du blush'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
    ],
  },

  // ── CHEEKS / JOUES ────────────────────────────────────────────────────────
  {
    id: 'right_cheek', // user RIGHT, MP left
    name: 'Joue droite',
    icon: '🌸',
    color: '#FF8CC8',
    // Side face silhouette + cheek landmarks
    poly: [234, 93, 132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 435, 401, 366, 447, 376, 433, 416, 434, 432, 436, 426, 423, 266, 330, 425, 411, 376, 352, 345, 340, 346, 347, 348, 349, 350, 357, 277, 355, 429, 358, 279, 389, 251, 284],
    desc: 'Blush, contouring, hydratation',
    tips: ['Sourire pour trouver la zone du blush', 'Estomper vers les tempes pour un effet naturel', 'Hydrater matin et soir'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Contouring naturel des joues', q: 'contouring joues naturel maquillage tutoriel', dur: '~7 min' },
      { title: 'Soin hydratant joues : routine complète', q: 'soin hydratant joues visage routine beauté', dur: '~5 min' },
    ],
  },
  {
    id: 'left_cheek', // user LEFT, MP right
    name: 'Joue gauche',
    icon: '🌸',
    color: '#FF8CC8',
    poly: [454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 215, 138, 215, 177, 137, 123, 116, 111, 117, 118, 119, 120, 121, 128, 114, 217, 126, 209, 49, 129, 203, 205, 206, 216, 212, 214, 192, 213, 147, 187, 207, 138, 177, 93, 234],
    desc: 'Blush, contouring, hydratation',
    tips: ['Sourire pour trouver la zone du blush', 'Estomper vers les tempes pour un effet naturel'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Contouring naturel des joues', q: 'contouring joues naturel maquillage tutoriel', dur: '~7 min' },
    ],
  },

  // ── LIPS (exact outer MediaPipe boundary) ─────────────────────────────────
  {
    id: 'upper_lip',
    name: 'Lèvre supérieure',
    icon: '💄',
    color: '#FF6489',
    // Outer upper lip + inner upper boundary
    poly: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78],
    desc: 'Crayon, volume, contour, rouge à lèvres',
    tips: ['Dessiner le contour avant d\'appliquer la couleur', 'Un trait légèrement en dehors donne plus de volume'],
    tutorials: [
      { title: 'Dessiner un contour lèvres parfait', q: 'dessiner contour lèvres parfait crayon tutoriel', dur: '~6 min' },
      { title: 'Volume lèvre supérieure : toutes les astuces', q: 'volume lèvre supérieure maquillage astuces', dur: '~5 min' },
      { title: 'Rouge à lèvres longue tenue : technique pro', q: 'rouge lèvres longue tenue technique tutoriel', dur: '~7 min' },
    ],
  },
  {
    id: 'lower_lip',
    name: 'Lèvre inférieure',
    icon: '💋',
    color: '#FF4678',
    // Outer lower lip + inner lower boundary
    poly: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
    desc: 'Gloss, hydratation, volume, soin',
    tips: ['Gloss au centre pour l\'effet pulpeux', 'Exfolier les lèvres 1×/semaine'],
    tutorials: [
      { title: 'Lèvres pulpeuses : toutes les astuces', q: 'lèvres pulpeuses astuces maquillage tutoriel', dur: '~8 min' },
      { title: 'Gommage et hydratation des lèvres', q: 'gommage hydratation lèvres soin routine', dur: '~4 min' },
      { title: 'Bien appliquer le gloss lèvres', q: 'gloss lèvres appliquer tutoriel technique', dur: '~5 min' },
    ],
  },

  // ── PHILTRUM (entre nez et lèvre supérieure) ──────────────────────────────
  {
    id: 'philtrum',
    name: 'Philtrum',
    icon: '▽',
    color: '#E08AFF',
    poly: [2, 164, 0, 11, 12, 13, 14, 17, 18, 200, 199, 175, 152, 377, 400, 378, 379, 365, 397, 288, 361],
    desc: 'Arc de Cupidon, contour, lissage',
    tips: ['Zone clé pour le contour des lèvres', 'Highlighter sur le philtrum pour agrandir la bouche'],
    tutorials: [
      { title: 'Mettre en valeur l\'arc de Cupidon', q: 'arc cupidon contour lèvres maquillage tutoriel', dur: '~5 min' },
      { title: 'Highlighter philtrum : lèvres pulpeuses', q: 'highlighter philtrum lèvres pulpeuses maquillage', dur: '~4 min' },
    ],
  },

  // ── CHIN ─────────────────────────────────────────────────────────────────
  {
    id: 'chin',
    name: 'Menton',
    icon: '◇',
    color: '#A882FF',
    // Lower face silhouette segment around chin
    poly: [152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377],
    desc: 'Contouring, affinement, définition',
    tips: ['Contouring sous le menton affine le visage', 'Hydrater — zone souvent sèche'],
    tutorials: [
      { title: 'Affiner le menton avec le contouring', q: 'affiner menton contouring maquillage tutoriel', dur: '~6 min' },
      { title: 'Double menton : techniques de maquillage', q: 'double menton maquillage contouring tutoriel', dur: '~7 min' },
    ],
  },

  // ── JAWLINE ───────────────────────────────────────────────────────────────
  {
    id: 'right_jaw', // user RIGHT, MP left silhouette lower
    name: 'Mâchoire droite',
    icon: '◁',
    color: '#9682FF',
    poly: [58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356, 389],
    desc: 'Jawline, contouring, définition',
    tips: ['Appliquer le contouring le long de la mâchoire', 'Estomper vers le cou pour un fondu naturel'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
      { title: 'Contouring selon la morphologie du visage', q: 'contouring morphologie visage ovale carré tutoriel', dur: '~10 min' },
    ],
  },
  {
    id: 'left_jaw', // user LEFT, MP right silhouette lower
    name: 'Mâchoire gauche',
    icon: '▷',
    color: '#9682FF',
    poly: [288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162],
    desc: 'Jawline, contouring, définition',
    tips: ['Appliquer le contouring le long de la mâchoire', 'Estomper vers le cou pour un fondu naturel'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
    ],
  },
];

export default ZONES;
