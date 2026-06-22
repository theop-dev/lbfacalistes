// Polygon zones — MediaPipe Face Mesh landmark indices.
// Face oval (silhouette) going clockwise from top (10):
//   RIGHT side (user LEFT, MP high-x): 338,297,332,284,251,389,356,454 → ear 454,323,361,288,397,365,379,378,400,377 → chin 152
//   LEFT side (user RIGHT, MP low-x): 148,176,149,150,136,172,58,132,93 → ear 234,127,162,21,54,103,67,109 → top
//
// Canvas is CSS scaleX(-1). MP "left" (low x) = user RIGHT on screen.
// sortByAngle: true — vertices are automatically sorted by angle around centroid
//   before drawing, preventing self-intersecting polygons. Use for all roughly
//   convex/star-shaped zones. Do NOT use for eyes or lips (concave MediaPipe paths).

const ZONES = [

  // ── FRONT (hairline → above eyebrows) ───────────────────────────────────────
  {
    id: 'forehead',
    name: 'Front',
    icon: '✦',
    color: '#FF9A82',
    sortByAngle: true,
    poly: [10, 338, 297, 332, 284, 251,
           300, 293, 334, 296, 336,
           9,
           107, 66, 105, 63, 70, 46, 53, 52, 65, 55,
           54, 103, 67, 109],
    desc: 'Rides, tension, hydratation, éclat',
    tips: ['Appliquer sérum en mouvements ascendants', 'Protéger avec un SPF chaque matin', 'Zone la plus exposée au soleil'],
    tutorials: [
      { title: 'Massage frontal : libérer les tensions', q: 'massage front tension beauté technique visage', dur: '~8 min' },
      { title: 'Routine anti-rides pour le front', q: 'routine soin anti-rides front visage beauté', dur: '~6 min' },
    ],
  },

  // ── GLABELLE (entre sourcils) ────────────────────────────────────────────────
  {
    id: 'glabella',
    name: 'Glabelle',
    icon: '◈',
    color: '#FFD45A',
    sortByAngle: true,
    poly: [9, 107, 66, 105, 63, 70, 46, 53, 52, 65, 55,
           285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
    desc: 'Ride du lion, point de pression, réflexologie',
    tips: ['Point de pression anti-stress et anti-migraine', 'Massage circulaire doux pour soulager les headaches'],
    tutorials: [
      { title: 'Effacer la ride du lion', q: 'effacer ride lion front tutoriel soin beauté', dur: '~7 min' },
      { title: 'Massage glabelle : point de pression', q: 'massage glabelle point pression réflexologie visage', dur: '~5 min' },
    ],
  },

  // ── SOURCIL DROIT (user right = MP left, low-x) ─────────────────────────────
  {
    id: 'right_brow',
    name: 'Sourcil droit',
    icon: '〰',
    color: '#C88CFF',
    sortByAngle: true,
    poly: [46, 53, 52, 65, 55, 107, 66, 105, 63, 70],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage naturel', dur: '~5 min' },
    ],
  },

  // ── SOURCIL GAUCHE (user left = MP right, high-x) ───────────────────────────
  {
    id: 'left_brow',
    name: 'Sourcil gauche',
    icon: '〰',
    color: '#C88CFF',
    sortByAngle: true,
    poly: [276, 283, 282, 295, 285, 336, 296, 334, 293, 300],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage naturel', dur: '~5 min' },
    ],
  },

  // ── ŒIL DROIT (user right, MP FACEMESH_LEFT_EYE) ────────────────────────────
  {
    id: 'right_eye',
    name: 'Œil droit',
    icon: '👁',
    color: '#6EB4FF',
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    desc: 'Eye-liner, mascara, cils, iris, paupières',
    tips: ['Tirer le trait d\'eye-liner en une seule ligne', 'Appliquer le mascara en zigzag à la base des cils'],
    tutorials: [
      { title: 'Eye-liner parfait pour débutantes', q: 'eye liner parfait tutoriel débutante technique', dur: '~9 min' },
      { title: 'Mascara : cils plus longs et volumineux', q: 'mascara cils longs volume tutoriel technique', dur: '~6 min' },
    ],
  },

  // ── ŒIL GAUCHE (user left, MP FACEMESH_RIGHT_EYE) ───────────────────────────
  {
    id: 'left_eye',
    name: 'Œil gauche',
    icon: '👁',
    color: '#6EB4FF',
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466],
    desc: 'Eye-liner, mascara, cils, iris, paupières',
    tips: ['Tirer le trait d\'eye-liner en une seule ligne', 'Appliquer le mascara en zigzag à la base des cils'],
    tutorials: [
      { title: 'Eye-liner parfait pour débutantes', q: 'eye liner parfait tutoriel débutante technique', dur: '~9 min' },
      { title: 'Mascara : cils plus longs et volumineux', q: 'mascara cils longs volume tutoriel technique', dur: '~6 min' },
    ],
  },

  // ── CERNE DROIT (user right, under MP left eye) ──────────────────────────────
  // Sub-orbital ONLY — no upper eyelid landmarks (those caused a huge polygon
  // wrapping the entire eye area when convex hull was applied).
  {
    id: 'right_undereye',
    name: 'Cerne droit',
    icon: '◔',
    color: '#96E6FF',
    sortByAngle: true,
    poly: [243, 112, 26, 22, 23, 24, 110, 25, 130, 120, 121, 119, 118, 117],
    desc: 'Cernes, poches, anti-fatigue, contour des yeux',
    tips: ['Tapoter — ne jamais frotter', 'Crème contour des yeux matin et soir'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
    ],
  },

  // ── CERNE GAUCHE (user left, under MP right eye) ─────────────────────────────
  {
    id: 'left_undereye',
    name: 'Cerne gauche',
    icon: '◔',
    color: '#96E6FF',
    sortByAngle: true,
    poly: [463, 341, 256, 252, 253, 254, 339, 255, 359, 349, 350, 348, 347, 346],
    desc: 'Cernes, poches, anti-fatigue, contour des yeux',
    tips: ['Tapoter — ne jamais frotter', 'Crème contour des yeux matin et soir'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
    ],
  },

  // ── TEMPE DROITE (user right, lateral face strip from outer eye to jaw) ───────
  // Strictly outer lateral face — no shared landmarks with cheek/jaw/cheekbone.
  {
    id: 'right_temple',
    name: 'Tempe droite',
    icon: '◉',
    color: '#FF6060',
    sortByAngle: true,
    poly: [21, 162, 127, 234, 54, 103, 67, 109],
    desc: 'Zone temporale, migraines, détente, réflexologie',
    tips: ['Point de pression anti-migraine sur la tempe', 'Massage circulaire doux pour relâcher les tensions', 'Zone très sensible — pression légère uniquement'],
    tutorials: [
      { title: 'Massage temporal : soulager les migraines', q: 'massage temporal soulager migraines technique beauté', dur: '~6 min' },
      { title: 'Contouring tempes : affinement du visage', q: 'contouring tempes affinement visage tutoriel', dur: '~5 min' },
    ],
  },

  // ── TEMPE GAUCHE (user left, lateral face strip from outer eye to jaw) ────────
  {
    id: 'left_temple',
    name: 'Tempe gauche',
    icon: '◉',
    color: '#FF6060',
    sortByAngle: true,
    poly: [251, 389, 356, 454, 284, 332, 297, 338],
    desc: 'Zone temporale, migraines, détente, réflexologie',
    tips: ['Point de pression anti-migraine sur la tempe', 'Massage circulaire doux pour relâcher les tensions'],
    tutorials: [
      { title: 'Massage temporal : soulager les migraines', q: 'massage temporal soulager migraines technique beauté', dur: '~6 min' },
      { title: 'Contouring tempes : affinement du visage', q: 'contouring tempes affinement visage tutoriel', dur: '~5 min' },
    ],
  },

  // ── POMMETTE DROITE (user right, outer cheekbone under right eye) ────────────
  // Outer sub-orbital area only — no shared landmarks with cheek or undereye.
  {
    id: 'right_cheekbone',
    name: 'Pommette droite',
    icon: '✧',
    color: '#FFAAD2',
    sortByAngle: true,
    poly: [247, 30, 29, 27, 28, 56, 190, 120, 121, 119, 118],
    desc: 'Highlighter, sculpture, blush',
    tips: ['Highlighter sur le point le plus haut de la pommette', 'Sourire pour trouver l\'emplacement exact du blush'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
    ],
  },

  // ── POMMETTE GAUCHE (user left, outer cheekbone under left eye) ──────────────
  {
    id: 'left_cheekbone',
    name: 'Pommette gauche',
    icon: '✧',
    color: '#FFAAD2',
    sortByAngle: true,
    poly: [467, 260, 259, 257, 258, 286, 414, 349, 350, 348, 347],
    desc: 'Highlighter, sculpture, blush',
    tips: ['Highlighter sur le point le plus haut de la pommette', 'Sourire pour trouver l\'emplacement exact du blush'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
    ],
  },

  // ── JOUE DROITE (user right) ─────────────────────────────────────────────────
  // Middle cheek only — no shared landmarks with jaw, temple, or cheekbone.
  {
    id: 'right_cheek',
    name: 'Joue droite',
    icon: '🌸',
    color: '#FF8CC8',
    sortByAngle: true,
    poly: [92, 165, 206, 207, 147, 116, 123, 143, 111],
    desc: 'Blush, contouring, hydratation, drainage lymphatique',
    tips: ['Sourire pour trouver la zone du blush', 'Massage drainant vers les oreilles', 'Hydrater matin et soir'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Drainage lymphatique facial : joues', q: 'drainage lymphatique facial joues massage technique', dur: '~7 min' },
    ],
  },

  // ── JOUE GAUCHE (user left) — mirror of right_cheek ─────────────────────────
  {
    id: 'left_cheek',
    name: 'Joue gauche',
    icon: '🌸',
    color: '#FF8CC8',
    sortByAngle: true,
    poly: [322, 391, 426, 427, 376, 345, 352, 372, 340],
    desc: 'Blush, contouring, hydratation, drainage lymphatique',
    tips: ['Sourire pour trouver la zone du blush', 'Massage drainant vers les oreilles'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Drainage lymphatique facial : joues', q: 'drainage lymphatique facial joues massage technique', dur: '~7 min' },
    ],
  },

  // ── ARÊTE DU NEZ (nose bridge) ───────────────────────────────────────────────
  // Old polygon had landmarks 429,358,327,326 which are nasolabial/cheek area —
  // they were pulling the polygon far out to the sides. Replaced with correct
  // symmetric nose-dorsum landmarks only.
  {
    id: 'nose_bridge',
    name: 'Arête du nez',
    icon: '◈',
    color: '#FFE87A',
    sortByAngle: true,
    poly: [168, 417, 351, 419, 248, 281, 275, 4, 45, 51, 3, 196, 122, 193],
    desc: 'Contouring, highlighter, arête, affinement',
    tips: ['Highlighter fin sur l\'arête pour l\'élever', 'Contouring sur les côtés pour affiner'],
    tutorials: [
      { title: 'Highlighter arête du nez : effet nose-job', q: 'highlighter arête nez nose job makeup tutoriel', dur: '~5 min' },
      { title: 'Contouring du nez : affinement visuel', q: 'contouring nez affinement tutoriel maquillage', dur: '~7 min' },
    ],
  },

  // ── POINTE & AILES DU NEZ ────────────────────────────────────────────────────
  {
    id: 'nose_tip',
    name: 'Pointe du nez',
    icon: '◉',
    color: '#FFD45A',
    sortByAngle: true,
    poly: [4, 45, 220, 115, 49, 64, 294, 279, 344, 440, 275],
    desc: 'Pointe, pores, soin purifiant',
    tips: ['Nettoyer les pores régulièrement', 'Exfoliant doux 2×/semaine'],
    tutorials: [
      { title: 'Éliminer les points noirs du nez', q: 'éliminer points noirs nez routine soin efficace', dur: '~6 min' },
      { title: 'Contouring pointe du nez', q: 'contouring pointe nez maquillage tutoriel', dur: '~5 min' },
    ],
  },

  // ── AILE DROITE (user right, MP left nostril) ────────────────────────────────
  {
    id: 'right_nostril',
    name: 'Aile droite du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [49, 64, 98, 97, 99, 60, 75, 240, 115, 220, 45],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
    ],
  },

  // ── AILE GAUCHE (user left, MP right nostril) ────────────────────────────────
  {
    id: 'left_nostril',
    name: 'Aile gauche du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [279, 294, 328, 327, 290, 305, 460, 344, 440, 275],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
    ],
  },

  // ── PHILTRUM (entre base du nez et lèvre sup) ────────────────────────────────
  {
    id: 'philtrum',
    name: 'Philtrum',
    icon: '▽',
    color: '#E08AFF',
    poly: [1, 2, 267, 0, 37],
    desc: 'Arc de Cupidon, contour lèvres, highlighter',
    tips: ['Highlighter sur le philtrum pour agrandir la bouche', 'Zone clé pour le contour des lèvres'],
    tutorials: [
      { title: 'Mettre en valeur l\'arc de Cupidon', q: 'arc cupidon contour lèvres maquillage tutoriel', dur: '~5 min' },
      { title: 'Highlighter philtrum : lèvres pulpeuses', q: 'highlighter philtrum lèvres pulpeuses maquillage', dur: '~4 min' },
    ],
  },

  // ── LÈVRE SUPÉRIEURE ─────────────────────────────────────────────────────────
  {
    id: 'upper_lip',
    name: 'Lèvre supérieure',
    icon: '💄',
    color: '#FF6489',
    poly: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78],
    desc: 'Crayon, volume, contour, rouge à lèvres',
    tips: ['Dessiner le contour avant d\'appliquer la couleur', 'Un trait légèrement en dehors donne plus de volume'],
    tutorials: [
      { title: 'Dessiner un contour lèvres parfait', q: 'dessiner contour lèvres parfait crayon tutoriel', dur: '~6 min' },
      { title: 'Volume lèvre supérieure : astuces', q: 'volume lèvre supérieure maquillage astuces', dur: '~5 min' },
    ],
  },

  // ── LÈVRE INFÉRIEURE ─────────────────────────────────────────────────────────
  {
    id: 'lower_lip',
    name: 'Lèvre inférieure',
    icon: '💋',
    color: '#FF4678',
    poly: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
    desc: 'Gloss, hydratation, volume, soin',
    tips: ['Gloss au centre pour l\'effet pulpeux', 'Exfolier les lèvres 1×/semaine'],
    tutorials: [
      { title: 'Lèvres pulpeuses : toutes les astuces', q: 'lèvres pulpeuses astuces maquillage tutoriel', dur: '~8 min' },
      { title: 'Gommage et hydratation des lèvres', q: 'gommage hydratation lèvres soin routine', dur: '~4 min' },
    ],
  },

  // ── MENTON ───────────────────────────────────────────────────────────────────
  {
    id: 'chin',
    name: 'Menton',
    icon: '◇',
    color: '#A882FF',
    sortByAngle: true,
    poly: [17, 91, 176, 148, 152, 377, 400, 321],
    desc: 'Contouring, affinement, définition, soin',
    tips: ['Contouring sous le menton affine le visage', 'Hydrater — zone souvent sèche'],
    tutorials: [
      { title: 'Affiner le menton avec le contouring', q: 'affiner menton contouring maquillage tutoriel', dur: '~6 min' },
      { title: 'Double menton : techniques de maquillage', q: 'double menton maquillage contouring tutoriel', dur: '~7 min' },
    ],
  },

  // ── MÂCHOIRE DROITE (user right) ─────────────────────────────────────────────
  // Strictly outer jaw silhouette — no shared landmarks with cheek or chin.
  {
    id: 'right_jaw',
    name: 'Mâchoire droite',
    icon: '◁',
    color: '#9682FF',
    sortByAngle: true,
    poly: [234, 93, 132, 58, 172, 136, 150, 149],
    desc: 'Masséter, jawline, contouring, détente musculaire',
    tips: ['Massage du masséter pour relâcher les tensions', 'Zone clé pour les serrements de mâchoire (bruxisme)'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
      { title: 'Massage masséter : relâcher la tension', q: 'massage masséter relâcher tension mâchoire', dur: '~6 min' },
    ],
  },

  // ── MÂCHOIRE GAUCHE (user left) ──────────────────────────────────────────────
  {
    id: 'left_jaw',
    name: 'Mâchoire gauche',
    icon: '▷',
    color: '#9682FF',
    sortByAngle: true,
    poly: [454, 323, 361, 288, 397, 365, 379, 378],
    desc: 'Masséter, jawline, contouring, détente musculaire',
    tips: ['Massage du masséter pour relâcher les tensions', 'Zone clé pour les serrements de mâchoire (bruxisme)'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
      { title: 'Massage masséter : relâcher la tension', q: 'massage masséter relâcher tension mâchoire', dur: '~6 min' },
    ],
  },

];

export default ZONES;
