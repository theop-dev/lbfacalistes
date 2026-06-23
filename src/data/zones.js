// Polygon zones — MediaPipe Face Mesh landmark indices.
// Canvas is CSS scaleX(-1). MP "left" (low x) = user RIGHT on screen.
// sortByAngle: true → convex hull (Andrew's monotone chain) used for drawing.

const ZONES = [

  // ── FRONT ────────────────────────────────────────────────────────────────────
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
    desc: 'Rides, tensions musculaires, hydratation, éclat',
    tips: ['Appliquer sérum en mouvements ascendants', 'Massage frontal doux pour libérer les tensions'],
    tutorials: [
      { title: 'Massage frontal : libérer les tensions', q: 'massage front libérer tensions technique facial soin', dur: '~8 min' },
      { title: 'Protocole anti-rides front : technique praticienne', q: 'protocole anti rides front massage facial praticienne', dur: '~6 min' },
    ],
  },

  // ── GLABELLE ─────────────────────────────────────────────────────────────────
  {
    id: 'glabella',
    name: 'Glabelle',
    icon: '◈',
    color: '#FFD45A',
    sortByAngle: true,
    poly: [9, 107, 66, 105, 63, 70, 46, 53, 52, 65, 55,
           285, 295, 282, 283, 276, 300, 293, 334, 296, 336],
    desc: 'Ride du lion, point d\'acupression, réflexologie',
    tips: ['Point de pression anti-stress entre les sourcils', 'Massage circulaire doux pour soulager les céphalées'],
    tutorials: [
      { title: 'Atténuer la ride du lion : massage facial', q: 'atténuer ride lion massage facial technique soin', dur: '~7 min' },
      { title: 'Réflexologie glabelle : points de pression', q: 'réflexologie glabelle points pression massage', dur: '~5 min' },
    ],
  },

  // ── SOURCIL DROIT (user right = MP left, low-x) ──────────────────────────────
  {
    id: 'right_brow',
    name: 'Sourcil droit',
    icon: '〰',
    color: '#C88CFF',
    sortByAngle: true,
    poly: [46, 53, 52, 65, 55, 107, 66, 105, 63, 70],
    desc: 'Architecture du sourcil, stimulation folliculaire, soin',
    tips: ['Brosser dans le sens du poil pour stimuler la circulation', 'Pincement doux le long du sourcil pour activer le follicule'],
    tutorials: [
      { title: 'Remodeler les sourcils naturellement', q: 'remodeler sourcils naturellement massage soin technique', dur: '~7 min' },
      { title: 'Stimuler la pousse des sourcils', q: 'stimuler pousse sourcils sérum massage technique', dur: '~5 min' },
    ],
  },

  // ── SOURCIL GAUCHE (user left = MP right, high-x) ────────────────────────────
  {
    id: 'left_brow',
    name: 'Sourcil gauche',
    icon: '〰',
    color: '#C88CFF',
    sortByAngle: true,
    poly: [276, 283, 282, 295, 285, 336, 296, 334, 293, 300],
    desc: 'Architecture du sourcil, stimulation folliculaire, soin',
    tips: ['Brosser dans le sens du poil pour stimuler la circulation', 'Pincement doux le long du sourcil pour activer le follicule'],
    tutorials: [
      { title: 'Remodeler les sourcils naturellement', q: 'remodeler sourcils naturellement massage soin technique', dur: '~7 min' },
      { title: 'Stimuler la pousse des sourcils', q: 'stimuler pousse sourcils sérum massage technique', dur: '~5 min' },
    ],
  },

  // ── ŒIL DROIT ────────────────────────────────────────────────────────────────
  {
    id: 'right_eye',
    name: 'Œil droit',
    icon: '◔',
    color: '#6EB4FF',
    poly: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
    desc: 'Contour oculaire, drainage lymphatique, fatigue, réflexologie',
    tips: ['Drainage doux du coin interne vers la tempe', 'Pression légère sur les points d\'acupression oculaires'],
    tutorials: [
      { title: 'Massage contour des yeux : drainer et détendre', q: 'massage contour yeux drainage détente technique facial', dur: '~8 min' },
      { title: 'Réflexologie oculaire : stimuler les points clés', q: 'réflexologie oculaire points pression massage soin', dur: '~6 min' },
    ],
  },

  // ── ŒIL GAUCHE ───────────────────────────────────────────────────────────────
  {
    id: 'left_eye',
    name: 'Œil gauche',
    icon: '◔',
    color: '#6EB4FF',
    poly: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466],
    desc: 'Contour oculaire, drainage lymphatique, fatigue, réflexologie',
    tips: ['Drainage doux du coin interne vers la tempe', 'Pression légère sur les points d\'acupression oculaires'],
    tutorials: [
      { title: 'Massage contour des yeux : drainer et détendre', q: 'massage contour yeux drainage détente technique facial', dur: '~8 min' },
      { title: 'Réflexologie oculaire : stimuler les points clés', q: 'réflexologie oculaire points pression massage soin', dur: '~6 min' },
    ],
  },

  // ── PAUPIÈRE DROITE ───────────────────────────────────────────────────────────
  {
    id: 'right_eyelid',
    name: 'Paupière droite',
    icon: '◔',
    color: '#A0C8FF',
    sortByAngle: true,
    poly: [246, 161, 160, 159, 158, 157, 173, 133, 130, 29, 27, 28, 56, 190, 243, 112, 26, 33],
    desc: 'Paupière mobile, lifting palpébral, drainage, tonicité',
    tips: ['Effleurer la paupière du coin interne vers l\'externe', 'Légère pression sous le sourcil pour étirer la paupière'],
    tutorials: [
      { title: 'Lifting palpébral naturel : technique de massage', q: 'lifting palpébral naturel massage technique paupière soin', dur: '~7 min' },
      { title: 'Soin paupières : drainer et tonifier', q: 'soin paupières drainage tonicité massage facial', dur: '~5 min' },
    ],
  },

  // ── PAUPIÈRE GAUCHE ───────────────────────────────────────────────────────────
  {
    id: 'left_eyelid',
    name: 'Paupière gauche',
    icon: '◔',
    color: '#A0C8FF',
    sortByAngle: true,
    poly: [466, 388, 387, 386, 385, 384, 398, 362, 359, 260, 259, 257, 258, 286, 414, 463, 341, 263],
    desc: 'Paupière mobile, lifting palpébral, drainage, tonicité',
    tips: ['Effleurer la paupière du coin interne vers l\'externe', 'Légère pression sous le sourcil pour étirer la paupière'],
    tutorials: [
      { title: 'Lifting palpébral naturel : technique de massage', q: 'lifting palpébral naturel massage technique paupière soin', dur: '~7 min' },
      { title: 'Soin paupières : drainer et tonifier', q: 'soin paupières drainage tonicité massage facial', dur: '~5 min' },
    ],
  },

  // ── CERNE DROIT ───────────────────────────────────────────────────────────────
  {
    id: 'right_undereye',
    name: 'Cerne droit',
    icon: '◉',
    color: '#96E6FF',
    sortByAngle: true,
    poly: [243, 112, 26, 22, 23, 24, 110, 25, 130],
    desc: 'Cernes, poches, anti-fatigue, drainage contour des yeux',
    tips: ['Tapoter — ne jamais frotter sous l\'œil', 'Drainage doux du coin interne vers la tempe'],
    tutorials: [
      { title: 'Drainer les cernes : massage contour des yeux', q: 'drainer cernes massage contour yeux technique facial', dur: '~7 min' },
      { title: 'Soin anti-poches : protocole praticienne', q: 'soin anti poches contour yeux protocole massage', dur: '~5 min' },
    ],
  },

  // ── CERNE GAUCHE ──────────────────────────────────────────────────────────────
  {
    id: 'left_undereye',
    name: 'Cerne gauche',
    icon: '◉',
    color: '#96E6FF',
    sortByAngle: true,
    poly: [463, 341, 256, 252, 253, 254, 339, 255, 359],
    desc: 'Cernes, poches, anti-fatigue, drainage contour des yeux',
    tips: ['Tapoter — ne jamais frotter sous l\'œil', 'Drainage doux du coin interne vers la tempe'],
    tutorials: [
      { title: 'Drainer les cernes : massage contour des yeux', q: 'drainer cernes massage contour yeux technique facial', dur: '~7 min' },
      { title: 'Soin anti-poches : protocole praticienne', q: 'soin anti poches contour yeux protocole massage', dur: '~5 min' },
    ],
  },

  // ── TEMPE DROITE ──────────────────────────────────────────────────────────────
  {
    id: 'right_temple',
    name: 'Tempe droite',
    icon: '◉',
    color: '#FF6060',
    sortByAngle: true,
    poly: [21, 162, 127, 234, 54, 103, 67, 109],
    desc: 'Zone temporale, céphalées, détente, réflexologie',
    tips: ['Point de pression anti-migraine sur la tempe', 'Massage circulaire doux — pression légère uniquement'],
    tutorials: [
      { title: 'Massage temporal : soulager les céphalées', q: 'massage temporal soulager céphalées migraines technique', dur: '~6 min' },
      { title: 'Réflexologie temporale : points clés', q: 'réflexologie temporale points pression massage facial', dur: '~5 min' },
    ],
  },

  // ── TEMPE GAUCHE ──────────────────────────────────────────────────────────────
  {
    id: 'left_temple',
    name: 'Tempe gauche',
    icon: '◉',
    color: '#FF6060',
    sortByAngle: true,
    poly: [251, 389, 356, 454, 284, 332, 297, 338],
    desc: 'Zone temporale, céphalées, détente, réflexologie',
    tips: ['Point de pression anti-migraine sur la tempe', 'Massage circulaire doux pour soulager les tensions'],
    tutorials: [
      { title: 'Massage temporal : soulager les céphalées', q: 'massage temporal soulager céphalées migraines technique', dur: '~6 min' },
      { title: 'Réflexologie temporale : points clés', q: 'réflexologie temporale points pression massage facial', dur: '~5 min' },
    ],
  },

  // ── JOUE DROITE ───────────────────────────────────────────────────────────────
  {
    id: 'right_cheek',
    name: 'Joue droite',
    icon: '◈',
    color: '#FF8CC8',
    sortByAngle: true,
    poly: [234, 93, 132, 58, 172, 136, 150,
           61, 92, 165, 206, 207, 147, 123, 116, 143,
           111, 117, 118, 119, 120, 121],
    desc: 'Drainage lymphatique, tonicité, pommettes, microcirculation',
    tips: ['Mouvement drainant de l\'aile du nez vers l\'oreille', 'Pincement doux pour activer la microcirculation'],
    tutorials: [
      { title: 'Drainage lymphatique des joues : technique complète', q: 'drainage lymphatique joues massage facial technique soin', dur: '~8 min' },
      { title: 'Tonifier les joues : massage anti-ptôse', q: 'tonifier joues massage anti ptose lifting facial', dur: '~7 min' },
    ],
  },

  // ── JOUE GAUCHE ───────────────────────────────────────────────────────────────
  {
    id: 'left_cheek',
    name: 'Joue gauche',
    icon: '◈',
    color: '#FF8CC8',
    sortByAngle: true,
    poly: [454, 323, 361, 288, 397, 365, 379,
           291, 322, 391, 426, 427, 376, 352, 345, 372,
           340, 346, 347, 348, 349, 350],
    desc: 'Drainage lymphatique, tonicité, pommettes, microcirculation',
    tips: ['Mouvement drainant de l\'aile du nez vers l\'oreille', 'Pincement doux pour activer la microcirculation'],
    tutorials: [
      { title: 'Drainage lymphatique des joues : technique complète', q: 'drainage lymphatique joues massage facial technique soin', dur: '~8 min' },
      { title: 'Tonifier les joues : massage anti-ptôse', q: 'tonifier joues massage anti ptose lifting facial', dur: '~7 min' },
    ],
  },

  // ── ARÊTE DU NEZ ─────────────────────────────────────────────────────────────
  {
    id: 'nose_bridge',
    name: 'Arête du nez',
    icon: '◈',
    color: '#FFE87A',
    sortByAngle: true,
    poly: [168, 417, 351, 419, 248, 281, 275, 4, 45, 51, 3, 196, 122, 193],
    desc: 'Arête nasale, sinus, tension, drainage',
    tips: ['Pincer l\'arête du nez pour libérer les sinus', 'Effleurer du bas vers le haut pour drainer'],
    tutorials: [
      { title: 'Massage du nez : libérer les sinus', q: 'massage nez libérer sinus drainage technique soin', dur: '~5 min' },
      { title: 'Réflexologie nasale : points clés', q: 'réflexologie nasale points pression sinus massage', dur: '~7 min' },
    ],
  },

  // ── POINTE DU NEZ ─────────────────────────────────────────────────────────────
  {
    id: 'nose_tip',
    name: 'Pointe du nez',
    icon: '◉',
    color: '#FFD45A',
    sortByAngle: true,
    poly: [4, 45, 220, 115, 49, 64, 294, 279, 344, 440, 275],
    desc: 'Pores dilatés, soin purifiant, hydratation, éclat',
    tips: ['Nettoyer les pores régulièrement avec un nettoyant doux', 'Exfoliant enzymatique 2×/semaine'],
    tutorials: [
      { title: 'Nettoyer les pores en profondeur', q: 'nettoyer pores profondeur soin purifiant routine nez', dur: '~6 min' },
      { title: 'Soin purifiant : protocole pointe du nez', q: 'soin purifiant protocole nez pores praticienne', dur: '~5 min' },
    ],
  },

  // ── AILE DROITE DU NEZ ────────────────────────────────────────────────────────
  {
    id: 'right_nostril',
    name: 'Aile droite du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [49, 64, 98, 97, 99, 60, 75, 240, 115, 220, 45],
    desc: 'Pores, soin purifiant, drainage, réflexologie',
    tips: ['Patch purifiant 1×/semaine', 'Point de réflexologie nasale pour les sinus'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant drainage', dur: '~5 min' },
    ],
  },

  // ── AILE GAUCHE DU NEZ ────────────────────────────────────────────────────────
  {
    id: 'left_nostril',
    name: 'Aile gauche du nez',
    icon: '◉',
    color: '#FFBA50',
    poly: [279, 294, 328, 327, 290, 305, 460, 344, 440, 275],
    desc: 'Pores, soin purifiant, drainage, réflexologie',
    tips: ['Patch purifiant 1×/semaine', 'Point de réflexologie nasale pour les sinus'],
    tutorials: [
      { title: 'Nettoyer les pores des ailes du nez', q: 'nettoyer pores ailes nez soin purifiant drainage', dur: '~5 min' },
    ],
  },

  // ── PHILTRUM ──────────────────────────────────────────────────────────────────
  {
    id: 'philtrum',
    name: 'Philtrum',
    icon: '▽',
    color: '#E08AFF',
    poly: [1, 2, 267, 0, 37],
    desc: 'Arc de Cupidon, acupression, sillon naso-labial',
    tips: ['Pression douce sur le philtrum pour soulager le stress', 'Massage circulaire pour atténuer le sillon naso-labial'],
    tutorials: [
      { title: 'Massage du philtrum : réflexologie et détente', q: 'massage philtrum réflexologie détente facial technique', dur: '~5 min' },
      { title: 'Atténuer le sillon naso-labial : massage', q: 'atténuer sillon naso labial massage facial technique', dur: '~4 min' },
    ],
  },

  // ── LÈVRE SUPÉRIEURE ──────────────────────────────────────────────────────────
  {
    id: 'upper_lip',
    name: 'Lèvre supérieure',
    icon: '◈',
    color: '#FF6489',
    poly: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78],
    desc: 'Hydratation, tonicité labiale, soin, muscles orbiculaires',
    tips: ['Hydrater matin et soir avec un baume nourrissant', 'Massage circulaire pour tonifier les muscles labiaux'],
    tutorials: [
      { title: 'Tonifier les lèvres : massage musculaire facial', q: 'tonifier lèvres massage musculaire orbiculaire facial', dur: '~6 min' },
      { title: 'Soin hydratant lèvres : routine praticienne', q: 'soin hydratant lèvres routine praticienne beauté', dur: '~5 min' },
    ],
  },

  // ── LÈVRE INFÉRIEURE ──────────────────────────────────────────────────────────
  {
    id: 'lower_lip',
    name: 'Lèvre inférieure',
    icon: '◈',
    color: '#FF4678',
    poly: [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
    desc: 'Hydratation, exfoliation, tonicité, soin labial',
    tips: ['Exfolier 1×/semaine pour éliminer les peaux mortes', 'Baume réparateur le soir pour régénérer'],
    tutorials: [
      { title: 'Exfoliation et soin des lèvres', q: 'exfoliation soin lèvres routine beauté praticienne', dur: '~5 min' },
      { title: 'Hydrater les lèvres : routine efficace', q: 'hydrater lèvres routine soin efficace praticienne', dur: '~4 min' },
    ],
  },

  // ── MENTON ────────────────────────────────────────────────────────────────────
  {
    id: 'chin',
    name: 'Menton',
    icon: '◇',
    color: '#A882FF',
    sortByAngle: true,
    poly: [17, 91, 176, 148, 152, 377, 400, 321],
    desc: 'Tonicité, drainage, massage, relâchement cutané',
    tips: ['Massage ferme vers le haut pour lutter contre la ptôse', 'Drainage sous le menton vers les ganglions'],
    tutorials: [
      { title: 'Tonifier le menton : massage anti-relâchement', q: 'tonifier menton massage anti relâchement lifting facial', dur: '~6 min' },
      { title: 'Drainage sous-mentonnier : technique praticienne', q: 'drainage sous mentonnier massage facial praticienne', dur: '~7 min' },
    ],
  },

  // ── MÂCHOIRE DROITE ───────────────────────────────────────────────────────────
  {
    id: 'right_jaw',
    name: 'Mâchoire droite',
    icon: '◁',
    color: '#9682FF',
    sortByAngle: true,
    poly: [234, 93, 132, 58, 172, 136, 150, 149],
    desc: 'Masséter, détente musculaire, bruxisme, jawline',
    tips: ['Massage profond du masséter pour relâcher les tensions', 'Zone clé pour le bruxisme — traiter avec douceur'],
    tutorials: [
      { title: 'Relâcher le masséter : massage anti-bruxisme', q: 'relâcher masséter massage anti bruxisme technique facial', dur: '~7 min' },
      { title: 'Massage mâchoire : soulager les tensions', q: 'massage mâchoire soulager tensions musculaires facial', dur: '~6 min' },
    ],
  },

  // ── MÂCHOIRE GAUCHE ───────────────────────────────────────────────────────────
  {
    id: 'left_jaw',
    name: 'Mâchoire gauche',
    icon: '▷',
    color: '#9682FF',
    sortByAngle: true,
    poly: [454, 323, 361, 288, 397, 365, 379, 378],
    desc: 'Masséter, détente musculaire, bruxisme, jawline',
    tips: ['Massage profond du masséter pour relâcher les tensions', 'Zone clé pour le bruxisme — traiter avec douceur'],
    tutorials: [
      { title: 'Relâcher le masséter : massage anti-bruxisme', q: 'relâcher masséter massage anti bruxisme technique facial', dur: '~7 min' },
      { title: 'Massage mâchoire : soulager les tensions', q: 'massage mâchoire soulager tensions musculaires facial', dur: '~6 min' },
    ],
  },

];

export default ZONES;
