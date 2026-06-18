// Polygon zones using real MediaPipe Face Mesh landmark indices.
// Mirror: canvas + video are CSS scaleX(-1).
// MP "left" (low-x) = user's RIGHT on mirrored screen.
// MP "right" (high-x) = user's LEFT on mirrored screen.

const ZONES = [

  // ── FOREHEAD ────────────────────────────────────────────────────────────────
  {
    id: 'forehead',
    name: 'Front',
    icon: '✦',
    color: '#FF9A82',
    poly: [10, 338, 297, 332, 284, 251, 389, 356,
           300, 293, 334, 296, 336,
           9,
           107, 66, 105, 63, 70, 46, 53, 52, 65, 55,
           162, 21, 54, 103, 67, 109],
    desc: 'Rides, tension, hydratation, éclat',
    tips: ['Appliquer sérum en mouvements ascendants', 'Protéger avec un SPF chaque matin', 'Zone la plus exposée au soleil'],
    tutorials: [
      { title: 'Massage frontal : libérer les tensions', q: 'massage front tension beauté technique visage', dur: '~8 min' },
      { title: 'Routine anti-rides pour le front', q: 'routine soin anti-rides front visage beauté', dur: '~6 min' },
      { title: 'Appliquer sérum et crème hydratante', q: 'appliquer sérum hydratant visage technique', dur: '~5 min' },
    ],
  },

  // ── GLABELLE (entre les sourcils) ────────────────────────────────────────────
  {
    id: 'glabella',
    name: 'Glabelle',
    icon: '◈',
    color: '#FFD45A',
    poly: [9, 107, 66, 105, 63, 70, 46, 53, 52, 65, 55,
           285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
    desc: 'Ride du lion, point de pression, réflexologie',
    tips: ['Point de pression anti-stress et anti-migraine', 'Massage circulaire doux pour soulager headaches', 'Zone clé de la ride du lion'],
    tutorials: [
      { title: 'Effacer la ride du lion', q: 'effacer ride lion front tutoriel soin beauté', dur: '~7 min' },
      { title: 'Massage glabelle : point de pression', q: 'massage glabelle point pression réflexologie visage', dur: '~5 min' },
    ],
  },

  // ── SOURCIL DROIT (user right, MP left) ─────────────────────────────────────
  {
    id: 'right_brow',
    name: 'Sourcil droit',
    icon: '〰',
    color: '#C88CFF',
    poly: [46, 53, 52, 65, 55, 107, 66, 105, 63, 70],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait', 'Fixer avec un gel transparent'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage technique naturel', dur: '~5 min' },
      { title: 'Sourcils selon la forme du visage', q: 'sourcils forme visage architecture beauté', dur: '~8 min' },
    ],
  },

  // ── SOURCIL GAUCHE (user left, MP right) ─────────────────────────────────────
  {
    id: 'left_brow',
    name: 'Sourcil gauche',
    icon: '〰',
    color: '#C88CFF',
    poly: [276, 283, 282, 295, 285, 336, 296, 334, 293, 300],
    desc: 'Architecture, dessin, densification',
    tips: ['Brosser dans le sens du poil', 'Dessiner poil par poil pour un naturel parfait', 'Fixer avec un gel transparent'],
    tutorials: [
      { title: 'Dessiner des sourcils parfaits', q: 'tutoriel dessiner sourcils parfaits crayon poudre', dur: '~7 min' },
      { title: 'Combler les trous dans les sourcils', q: 'combler trous sourcils maquillage technique naturel', dur: '~5 min' },
    ],
  },

  // ── ŒIL DROIT (user right, MP left eye) ─────────────────────────────────────
  {
    id: 'right_eye',
    name: 'Œil droit',
    icon: '👁',
    color: '#6EB4FF',
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    desc: 'Eye-liner, mascara, cils, iris, paupières',
    tips: ['Tirer le trait d\'eye-liner en une seule ligne', 'Appliquer le mascara en zigzag à la base des cils', 'Démaquiller délicatement en tapotant'],
    tutorials: [
      { title: 'Eye-liner parfait pour débutantes', q: 'eye liner parfait tutoriel débutante technique', dur: '~9 min' },
      { title: 'Mascara : cils plus longs et volumineux', q: 'mascara cils longs volume tutoriel technique', dur: '~6 min' },
      { title: 'Agrandir les yeux avec le maquillage', q: 'agrandir yeux maquillage technique tutoriel', dur: '~8 min' },
    ],
  },

  // ── ŒIL GAUCHE (user left, MP right eye) ─────────────────────────────────────
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

  // ── CERNE DROIT (user right, MP left) ────────────────────────────────────────
  {
    id: 'right_undereye',
    name: 'Cerne droit',
    icon: '◔',
    color: '#96E6FF',
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 243, 112, 26, 22, 23, 24, 110, 25, 130],
    desc: 'Cernes, poches, anti-fatigue, contour des yeux',
    tips: ['Tapoter — ne jamais frotter', 'Teinte 1 demi-ton plus claire que le fond de teint', 'Crème contour des yeux matin et soir'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
      { title: 'Choisir la bonne teinte de correcteur', q: 'choisir teinte correcteur cernes maquillage', dur: '~6 min' },
    ],
  },

  // ── CERNE GAUCHE (user left, MP right) ────────────────────────────────────────
  {
    id: 'left_undereye',
    name: 'Cerne gauche',
    icon: '◔',
    color: '#96E6FF',
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 463, 341, 256, 252, 253, 254, 339, 255, 359],
    desc: 'Cernes, poches, anti-fatigue, contour des yeux',
    tips: ['Tapoter — ne jamais frotter', 'Teinte 1 demi-ton plus claire que le fond de teint'],
    tutorials: [
      { title: 'Estomper les cernes : toutes les techniques', q: 'estomper cernes correcteur tutoriel maquillage', dur: '~7 min' },
      { title: 'Soin contour des yeux anti-cernes', q: 'soin contour yeux anti-cernes crème routine', dur: '~5 min' },
    ],
  },

  // ── ARÊTE DU NEZ ──────────────────────────────────────────────────────────────
  {
    id: 'nose_bridge',
    name: 'Arête du nez',
    icon: '◈',
    color: '#FFE87A',
    poly: [168, 193, 122, 196, 3, 51, 45, 4, 275, 281, 248, 456, 420, 429, 358, 327, 326, 2],
    desc: 'Contouring, highlighter, arête, affinement',
    tips: ['Highlighter fin sur l\'arête pour l\'élever', 'Contouring sur les côtés pour affiner', 'Blush under-eye pour sculpter'],
    tutorials: [
      { title: 'Highlighter arête du nez : effet nose-job', q: 'highlighter arête nez nose job makeup tutoriel', dur: '~5 min' },
      { title: 'Contouring du nez : affinement visuel', q: 'contouring nez affinement tutoriel maquillage', dur: '~7 min' },
    ],
  },

  // ── POINTE DU NEZ ─────────────────────────────────────────────────────────────
  {
    id: 'nose_tip',
    name: 'Pointe du nez',
    icon: '◉',
    color: '#FFD45A',
    poly: [4, 45, 220, 115, 49, 64, 98, 97, 2, 326, 327, 294, 279, 344, 440, 275],
    desc: 'Pointe, pores, points noirs, soin purifiant',
    tips: ['Nettoyer les pores régulièrement', 'Exfoliant doux 2×/semaine'],
    tutorials: [
      { title: 'Éliminer les points noirs du nez', q: 'éliminer points noirs nez routine soin efficace', dur: '~6 min' },
      { title: 'Contouring pointe du nez', q: 'contouring pointe nez maquillage tutoriel', dur: '~5 min' },
    ],
  },

  // ── AILE DROITE DU NEZ (user right, MP left) ─────────────────────────────────
  {
    id: 'right_nostril',
    name: 'Aile droite du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [49, 64, 98, 97, 2, 97, 99, 60, 75, 240, 115, 220, 45],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Exfoliant doux sur les ailes', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
      { title: 'Minimiser les ailes du nez au maquillage', q: 'maquillage minimiser ailes nez contouring', dur: '~6 min' },
    ],
  },

  // ── AILE GAUCHE DU NEZ (user left, MP right) ─────────────────────────────────
  {
    id: 'left_nostril',
    name: 'Aile gauche du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [279, 294, 327, 326, 2, 326, 328, 290, 305, 460, 344, 440, 275],
    desc: 'Points noirs, pores, soin purifiant',
    tips: ['Patch purifiant 1×/semaine', 'Exfoliant doux sur les ailes', 'Ne jamais presser à mains nues'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant beauté', dur: '~5 min' },
    ],
  },

  // ── POMMETTE DROITE (user right, MP left) ────────────────────────────────────
  {
    id: 'right_cheekbone',
    name: 'Pommette droite',
    icon: '✧',
    color: '#FFAAD2',
    poly: [130, 247, 30, 29, 27, 28, 56, 190, 243, 25, 110, 24, 23, 22, 26, 112],
    desc: 'Highlighter, sculpture, blush, pommette',
    tips: ['Highlighter sur le point le plus haut', 'Sourire pour trouver l\'emplacement exact du blush', 'Massage circulaire pour stimuler la circulation'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
      { title: 'Massage pommettes : drainage et éclat', q: 'massage pommettes drainage facial éclat', dur: '~5 min' },
    ],
  },

  // ── POMMETTE GAUCHE (user left, MP right) ─────────────────────────────────────
  {
    id: 'left_cheekbone',
    name: 'Pommette gauche',
    icon: '✧',
    color: '#FFAAD2',
    poly: [359, 467, 260, 259, 257, 258, 286, 414, 463, 255, 339, 254, 253, 252, 256, 341],
    desc: 'Highlighter, sculpture, blush, pommette',
    tips: ['Highlighter sur le point le plus haut', 'Sourire pour trouver l\'emplacement exact du blush'],
    tutorials: [
      { title: 'Highlighter pommettes : effet lumineux', q: 'highlighter pommettes effet lumineux tutoriel', dur: '~7 min' },
      { title: 'Sculpter les pommettes au contouring', q: 'sculpter pommettes contouring maquillage tutoriel', dur: '~8 min' },
    ],
  },

  // ── JOUE DROITE (user right, MP left) ────────────────────────────────────────
  {
    id: 'right_cheek',
    name: 'Joue droite',
    icon: '🌸',
    color: '#FF8CC8',
    poly: [234, 93, 132, 58, 172, 136, 150, 149, 176, 391, 393, 164, 2, 97, 99, 60, 75, 240, 115, 220, 45, 51, 3, 196, 122, 193, 168, 8, 55, 65, 52, 53, 46, 162, 127],
    desc: 'Blush, contouring, hydratation, drainage lymphatique',
    tips: ['Sourire pour trouver la zone du blush', 'Massage drainant vers les oreilles', 'Hydrater matin et soir'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Drainage lymphatique facial : joues', q: 'drainage lymphatique facial joues massage technique', dur: '~7 min' },
      { title: 'Contouring naturel des joues', q: 'contouring joues naturel maquillage tutoriel', dur: '~6 min' },
    ],
  },

  // ── JOUE GAUCHE (user left, MP right) ─────────────────────────────────────────
  {
    id: 'left_cheek',
    name: 'Joue gauche',
    icon: '🌸',
    color: '#FF8CC8',
    poly: [454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10, 109, 67, 103, 54, 21, 162, 127, 234],
    desc: 'Blush, contouring, hydratation, drainage lymphatique',
    tips: ['Sourire pour trouver la zone du blush', 'Massage drainant vers les oreilles'],
    tutorials: [
      { title: 'Appliquer le blush selon sa morphologie', q: 'appliquer blush joues morphologie visage tutoriel', dur: '~8 min' },
      { title: 'Drainage lymphatique facial : joues', q: 'drainage lymphatique facial joues massage technique', dur: '~7 min' },
    ],
  },

  // ── PHILTRUM ──────────────────────────────────────────────────────────────────
  {
    id: 'philtrum',
    name: 'Philtrum',
    icon: '▽',
    color: '#E08AFF',
    // Small triangle between nose base and Cupid's bow
    poly: [2, 164, 0, 267, 37, 39, 40, 185, 61, 40, 39, 37, 0, 267, 270, 269, 0, 164, 2],
    desc: 'Arc de Cupidon, contour lèvres, highlighter',
    tips: ['Highlighter sur le philtrum pour agrandir la bouche', 'Zone clé pour le contour des lèvres'],
    tutorials: [
      { title: 'Mettre en valeur l\'arc de Cupidon', q: 'arc cupidon contour lèvres maquillage tutoriel', dur: '~5 min' },
      { title: 'Highlighter philtrum : lèvres pulpeuses', q: 'highlighter philtrum lèvres pulpeuses maquillage', dur: '~4 min' },
    ],
  },

  // ── LÈVRE SUPÉRIEURE ──────────────────────────────────────────────────────────
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
      { title: 'Rouge à lèvres longue tenue : technique pro', q: 'rouge lèvres longue tenue technique tutoriel', dur: '~7 min' },
    ],
  },

  // ── LÈVRE INFÉRIEURE ──────────────────────────────────────────────────────────
  {
    id: 'lower_lip',
    name: 'Lèvre inférieure',
    icon: '💋',
    color: '#FF4678',
    poly: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
    desc: 'Gloss, hydratation, volume, soin',
    tips: ['Gloss au centre pour l\'effet pulpeux', 'Exfolier les lèvres 1×/semaine', 'Baume protecteur avant le coucher'],
    tutorials: [
      { title: 'Lèvres pulpeuses : toutes les astuces', q: 'lèvres pulpeuses astuces maquillage tutoriel', dur: '~8 min' },
      { title: 'Gommage et hydratation des lèvres', q: 'gommage hydratation lèvres soin routine', dur: '~4 min' },
      { title: 'Bien appliquer le gloss lèvres', q: 'gloss lèvres appliquer tutoriel technique', dur: '~5 min' },
    ],
  },

  // ── MENTON ── (FIXED: ne contient plus l'oval complet du visage) ─────────────
  {
    id: 'chin',
    name: 'Menton',
    icon: '◇',
    color: '#A882FF',
    // From lower lip base, around chin tip only — NOT the full face oval
    poly: [17, 84, 181, 91, 176, 148, 152, 377, 400, 378, 321, 405, 314],
    desc: 'Contouring, affinement, définition, soin',
    tips: ['Contouring sous le menton affine le visage', 'Hydrater — zone souvent sèche', 'Massage drainage vers la nuque'],
    tutorials: [
      { title: 'Affiner le menton avec le contouring', q: 'affiner menton contouring maquillage tutoriel', dur: '~6 min' },
      { title: 'Double menton : techniques de maquillage', q: 'double menton maquillage contouring tutoriel', dur: '~7 min' },
      { title: 'Massage menton et drainage cervical', q: 'massage menton drainage cervical beauté', dur: '~5 min' },
    ],
  },

  // ── MÂCHOIRE DROITE (user right, MP left silhouette) ─────────────────────────
  {
    id: 'right_jaw',
    name: 'Mâchoire droite',
    icon: '◁',
    color: '#9682FF',
    poly: [132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 55, 65, 52, 53, 46, 58, 172, 136, 150, 149, 176],
    desc: 'Masséter, jawline, contouring, détente musculaire',
    tips: ['Appliquer le contouring le long de la mâchoire', 'Massage du masséter pour relâcher les tensions', 'Zone clé pour les serrements de mâchoire'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
      { title: 'Massage masséter : relâcher la tension', q: 'massage masséter relâcher tension mâchoire', dur: '~6 min' },
    ],
  },

  // ── MÂCHOIRE GAUCHE (user left, MP right silhouette) ─────────────────────────
  {
    id: 'left_jaw',
    name: 'Mâchoire gauche',
    icon: '▷',
    color: '#9682FF',
    poly: [361, 323, 454, 356, 389, 251, 284, 332, 297, 338, 285, 295, 282, 283, 276, 397, 365, 379, 378, 400, 377],
    desc: 'Masséter, jawline, contouring, détente musculaire',
    tips: ['Appliquer le contouring le long de la mâchoire', 'Massage du masséter pour relâcher les tensions'],
    tutorials: [
      { title: 'Sculpter la mâchoire : jawline makeup', q: 'sculpter mâchoire jawline contouring tutoriel', dur: '~7 min' },
      { title: 'Massage masséter : relâcher la tension', q: 'massage masséter relâcher tension mâchoire', dur: '~6 min' },
    ],
  },

];

export default ZONES;
