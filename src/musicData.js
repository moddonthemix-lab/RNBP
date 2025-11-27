// Notes and music theory data
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const CHORD_TYPES = {
  'maj7': { intervals: [0, 4, 7, 11], name: 'Major 7th', color: '#6366f1' },
  'min7': { intervals: [0, 3, 7, 10], name: 'Minor 7th', color: '#8b5cf6' },
  'dom7': { intervals: [0, 4, 7, 10], name: 'Dominant 7th', color: '#a855f7' },
  'min9': { intervals: [0, 3, 7, 10, 14], name: 'Minor 9th', color: '#d946ef' },
  'maj9': { intervals: [0, 4, 7, 11, 14], name: 'Major 9th', color: '#ec4899' },
  'dom9': { intervals: [0, 4, 7, 10, 14], name: 'Dominant 9th', color: '#f43f5e' },
  'min11': { intervals: [0, 3, 7, 10, 14, 17], name: 'Minor 11th', color: '#ef4444' },
  '6/9': { intervals: [0, 4, 7, 9, 14], name: '6/9', color: '#f97316' },
  'dim7': { intervals: [0, 3, 6, 9], name: 'Diminished 7th', color: '#84cc16' },
  'aug': { intervals: [0, 4, 8], name: 'Augmented', color: '#22c55e' },
  'sus4': { intervals: [0, 5, 7], name: 'Suspended 4th', color: '#14b8a6' },
  'add9': { intervals: [0, 4, 7, 14], name: 'Add 9', color: '#06b6d4' },
  '13': { intervals: [0, 4, 7, 10, 14, 21], name: '13th', color: '#0ea5e9' },
};

// R&B Progressions organized by artist/era
export const RNB_PROGRESSIONS = [
  // PartyNextDoor / OVO Sound
  { name: 'PND Dark Vibes', numerals: ['Imin9', 'bVImaj7', 'bVIImaj7', 'Imin7'], description: 'PartyNextDoor moody Toronto sound', category: 'pnd', color: '#7c3aed' },
  { name: 'PND Recognize', numerals: ['Imin7', 'IVmin7', 'bVImaj7', 'V7'], description: 'That "Recognize" atmosphere', category: 'pnd', color: '#7c3aed' },
  { name: 'OVO Nights', numerals: ['VImin9', 'IVmaj7', 'Imin7', 'V7'], description: 'Late night OVO vibes', category: 'pnd', color: '#7c3aed' },
  { name: 'PND Come and See Me', numerals: ['Imin7', 'bVIImaj7', 'IVmin7', 'bVImaj7'], description: 'Emotional PND ballad style', category: 'pnd', color: '#7c3aed' },
  { name: 'PND Break From Toronto', numerals: ['Imin9', 'bVImaj7', 'IVmin7', 'V7'], description: 'Haunting late-night feel', category: 'pnd', color: '#7c3aed' },
  
  // Bryson Tiller
  { name: 'Bryson Don\'t', numerals: ['VImin7', 'IVmaj7', 'Imaj7', 'V7'], description: 'That "Don\'t" trap soul sound', category: 'bryson', color: '#dc2626' },
  { name: 'Bryson Exchange', numerals: ['IImin9', 'V7', 'Imaj9', 'VImin7'], description: 'Smooth Bryson melodies', category: 'bryson', color: '#dc2626' },
  { name: 'Trap Soul', numerals: ['Imin7', 'bVImaj9', 'IVmin7', 'bVII7'], description: 'Classic TRAPSOUL album feel', category: 'bryson', color: '#dc2626' },
  { name: 'Anniversary Vibes', numerals: ['Imaj9', 'VImin7', 'IImin7', 'V7'], description: 'Anniversary album atmosphere', category: 'bryson', color: '#dc2626' },
  { name: 'Bryson Right My Wrongs', numerals: ['Imin7', 'bVImaj7', 'bVII7', 'Imin7'], description: 'Emotional apology track', category: 'bryson', color: '#dc2626' },
  
  // SZA
  { name: 'SZA CTRL', numerals: ['IVmaj9', 'IIImin7', 'VImin9', 'Imaj7'], description: 'CTRL album neo-soul jazz', category: 'sza', color: '#ea580c' },
  { name: 'SZA Love Galore', numerals: ['IImin9', 'V7', 'Imaj7', 'VImin7'], description: 'That "Love Galore" bounce', category: 'sza', color: '#ea580c' },
  { name: 'SZA Good Days', numerals: ['Imaj9', 'IVmaj7', 'VImin7', 'IIImin7'], description: 'Dreamy uplifting SZA', category: 'sza', color: '#ea580c' },
  { name: 'SZA Kill Bill', numerals: ['Imin7', 'IVmaj7', 'bVImaj7', 'V7'], description: 'SOS era dark pop R&B', category: 'sza', color: '#ea580c' },
  { name: 'SZA The Weekend', numerals: ['VImin9', 'IVmaj7', 'V7', 'Imaj7'], description: 'Smooth subtle groove', category: 'sza', color: '#ea580c' },
  { name: 'SZA Snooze', numerals: ['Imaj7', 'VImin7', 'IVmaj7', 'IImin7'], description: 'Tender ballad vibes', category: 'sza', color: '#ea580c' },
  
  // R. Kelly Classic Era
  { name: 'R. Kelly Bump N Grind', numerals: ['Imaj7', 'IVmaj7', 'IImin7', 'V7'], description: '90s slow jam classic', category: 'rkelly', color: '#0891b2' },
  { name: 'R. Kelly Ignition', numerals: ['Imaj7', 'VImin7', 'IVmaj7', 'V7'], description: 'That bounce remix feel', category: 'rkelly', color: '#0891b2' },
  { name: 'R. Kelly Step', numerals: ['Imaj9', 'IImin7', 'IIImin7', 'IVmaj7'], description: 'Step In The Name Of Love stepper', category: 'rkelly', color: '#0891b2' },
  { name: 'R. Kelly 12 Play', numerals: ['IImin9', 'V7', 'Imaj9', 'VImin7'], description: 'Silky 12 Play era', category: 'rkelly', color: '#0891b2' },
  { name: 'R. Kelly I Believe', numerals: ['Imaj7', 'Imin7', 'IVmaj7', 'V7'], description: 'Gospel-influenced ballad', category: 'rkelly', color: '#0891b2' },
  { name: 'R. Kelly Honey Love', numerals: ['Imaj9', 'IVmaj7', 'Imaj9', 'V7'], description: 'Slow sensual groove', category: 'rkelly', color: '#0891b2' },
  
  // Old School R&B Legends
  { name: 'Jodeci Freek\'n You', numerals: ['Imin9', 'IVmin7', 'bVImaj7', 'V7'], description: 'Jodeci dark sensual vibes', category: 'oldschool', color: '#be185d' },
  { name: 'Boyz II Men', numerals: ['Imaj7', 'VImin7', 'IImin7', 'V7'], description: 'End Of The Road harmonies', category: 'oldschool', color: '#be185d' },
  { name: 'TLC Creep', numerals: ['Imin7', 'IVmaj7', 'bVIImaj7', 'bVImaj7'], description: 'TLC smooth groove', category: 'oldschool', color: '#be185d' },
  { name: 'Aaliyah One In A Million', numerals: ['IImin7', 'V7', 'Imaj7', 'IVmaj7'], description: 'Timbaland-Aaliyah futuristic', category: 'oldschool', color: '#be185d' },
  { name: 'Usher Confessions', numerals: ['Imin7', 'bVImaj7', 'bVIImaj7', 'V7'], description: 'Confessions era drama', category: 'oldschool', color: '#be185d' },
  { name: 'Keith Sweat', numerals: ['Imaj7', 'IImin7', 'IVmaj7', 'V7'], description: 'New Jack Swing slow jam', category: 'oldschool', color: '#be185d' },
  { name: 'Mary J. Blige', numerals: ['Imin7', 'IVmin7', 'bVImaj7', 'V7'], description: 'Queen of Hip-Hop Soul', category: 'oldschool', color: '#be185d' },
  { name: 'SWV Weak', numerals: ['Imaj7', 'VImin7', 'IVmaj7', 'V7'], description: 'Classic SWV ballad', category: 'oldschool', color: '#be185d' },
  { name: 'Toni Braxton', numerals: ['Imin7', 'bVImaj7', 'bVII7', 'Imin7'], description: 'Un-Break My Heart drama', category: 'oldschool', color: '#be185d' },
  
  // Neo Soul
  { name: 'D\'Angelo Untitled', numerals: ['IVmaj7', 'IIImin7', 'VImin7', 'V7'], description: 'Voodoo album neo-soul', category: 'neosoul', color: '#15803d' },
  { name: 'Erykah Badu', numerals: ['IImin9', 'V7', 'Imaj9', 'IVmaj7'], description: 'Baduizm vibes', category: 'neosoul', color: '#15803d' },
  { name: 'Lauryn Hill', numerals: ['Imaj7', 'VImin7', 'IImin7', 'V7'], description: 'Miseducation classic', category: 'neosoul', color: '#15803d' },
  { name: 'Maxwell', numerals: ['IImin9', 'IIImin7', 'IVmaj7', 'V7'], description: 'Urban Hang Suite smooth', category: 'neosoul', color: '#15803d' },
  { name: 'Musiq Soulchild', numerals: ['Imaj9', 'IVmaj7', 'IImin7', 'V7'], description: 'Just Friends vibes', category: 'neosoul', color: '#15803d' },
  { name: 'Jill Scott', numerals: ['IImin9', 'V7', 'Imaj7', 'VImin7'], description: 'Golden warmth', category: 'neosoul', color: '#15803d' },
  
  // Modern R&B
  { name: 'Frank Ocean', numerals: ['VImin9', 'IV6/9', 'Imaj9', 'V7'], description: 'Blonde/Channel Orange dreamy', category: 'modern', color: '#6366f1' },
  { name: 'The Weeknd', numerals: ['Imin7', 'bVImaj7', 'IVmaj7', 'bVIImaj7'], description: 'Dark Toronto pop R&B', category: 'modern', color: '#6366f1' },
  { name: 'Daniel Caesar', numerals: ['Imaj9', 'IVmaj7', 'VImin7', 'V7'], description: 'Get You gospel soul', category: 'modern', color: '#6366f1' },
  { name: 'Summer Walker', numerals: ['Imin7', 'IVmin7', 'bVImaj7', 'V7'], description: 'Over It vulnerable vibes', category: 'modern', color: '#6366f1' },
  { name: 'Giveon', numerals: ['Imaj7', 'VImin7', 'IImin9', 'V7'], description: 'Deep baritone soul', category: 'modern', color: '#6366f1' },
  { name: 'H.E.R.', numerals: ['IImin9', 'V7', 'Imaj9', 'IVmaj7'], description: 'Focus R&B soul', category: 'modern', color: '#6366f1' },
  { name: 'Brent Faiyaz', numerals: ['Imin7', 'bVImaj7', 'bVII7', 'V7'], description: 'Wasteland dark vibes', category: 'modern', color: '#6366f1' },
  { name: 'Lucky Daye', numerals: ['IVmaj9', 'IIImin7', 'VImin7', 'V7'], description: 'Painted funky soul', category: 'modern', color: '#6366f1' },
];

export const SCALES = {
  major: { intervals: [0, 2, 4, 5, 7, 9, 11], name: 'Major (Ionian)' },
  minor: { intervals: [0, 2, 3, 5, 7, 8, 10], name: 'Natural Minor' },
  dorian: { intervals: [0, 2, 3, 5, 7, 9, 10], name: 'Dorian (Neo Soul)' },
  mixolydian: { intervals: [0, 2, 4, 5, 7, 9, 10], name: 'Mixolydian' },
  pentatonicMajor: { intervals: [0, 2, 4, 7, 9], name: 'Pentatonic Major' },
  pentatonicMinor: { intervals: [0, 3, 5, 7, 10], name: 'Pentatonic Minor' },
  blues: { intervals: [0, 3, 5, 6, 7, 10], name: 'Blues Scale' },
  harmonicMinor: { intervals: [0, 2, 3, 5, 7, 8, 11], name: 'Harmonic Minor' },
};

export const MELODY_PATTERNS = [
  { name: 'Ascending Run', pattern: [0, 1, 2, 3, 4], description: 'Rising melodic line', rhythm: [0, 0.5, 1, 1.5, 2] },
  { name: 'Descending Soul', pattern: [4, 3, 2, 1, 0], description: 'Classic soul descent', rhythm: [0, 0.5, 1, 1.5, 2] },
  { name: 'Call & Response', pattern: [0, 2, 4, 2, 0], description: 'Gospel-influenced', rhythm: [0, 0.5, 1, 2, 2.5] },
  { name: 'Syncopated', pattern: [0, 2, 1, 3, 2], description: 'Rhythmic interest', rhythm: [0, 0.33, 1, 1.66, 2.5] },
  { name: 'Leap & Step', pattern: [0, 4, 3, 2, 1], description: 'Dramatic to smooth', rhythm: [0, 0.75, 1.5, 2, 2.5] },
  { name: 'Pentatonic Lick', pattern: [0, 2, 4, 2, 0, -1], description: 'Blues-influenced', rhythm: [0, 0.33, 0.66, 1.5, 2, 2.5] },
  { name: 'PND Melancholy', pattern: [4, 2, 0, 1, 0], description: 'Dark descending mood', rhythm: [0, 0.75, 1.5, 2.25, 3] },
  { name: 'Bryson Bounce', pattern: [0, 0, 2, 4, 3, 2], description: 'Trap soul triplet feel', rhythm: [0, 0.33, 0.66, 1, 1.66, 2.33] },
  { name: 'SZA Float', pattern: [0, 2, 4, 5, 4, 2], description: 'Dreamy ascending float', rhythm: [0, 0.5, 1, 1.75, 2.5, 3] },
  { name: 'R. Kelly Run', pattern: [0, 1, 2, 3, 4, 5, 4], description: 'Classic melisma run', rhythm: [0, 0.25, 0.5, 0.75, 1, 1.25, 2] },
  { name: 'Jodeci Cry', pattern: [4, 3, 2, 1, 0, -1], description: 'Emotional descent', rhythm: [0, 0.5, 1, 1.5, 2, 2.75] },
  { name: 'Aaliyah Glide', pattern: [0, 2, 0, 4, 2, 0], description: 'Smooth minimalist', rhythm: [0, 0.75, 1.25, 2, 2.75, 3.25] },
  { name: 'Neo Soul Climb', pattern: [0, 1, 2, 4, 5, 4, 2], description: 'D\'Angelo style run', rhythm: [0, 0.33, 0.66, 1, 1.5, 2, 2.5] },
  { name: 'Modern Arpeggiate', pattern: [0, 2, 4, 6, 4, 2, 0], description: 'Frank Ocean style', rhythm: [0, 0.4, 0.8, 1.2, 1.8, 2.4, 3] },
];

export const DRUM_PATTERNS = {
  trapSoul: {
    name: 'Trap Soul',
    kick: [0, 1.75, 2.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
    openHat: [0.5, 1.5, 2.5, 3.5],
  },
  classicRnB: {
    name: 'Classic R&B',
    kick: [0, 1.5, 2, 3.5],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    openHat: [1, 3],
  },
  slowJam: {
    name: 'Slow Jam',
    kick: [0, 2.5],
    snare: [1, 3],
    hihat: [0, 0.75, 1, 1.75, 2, 2.75, 3, 3.75],
    openHat: [0.5, 2.5],
  },
  neoSoul: {
    name: 'Neo Soul',
    kick: [0, 0.75, 2, 2.75],
    snare: [1, 3],
    hihat: [0, 0.33, 0.66, 1, 1.33, 1.66, 2, 2.33, 2.66, 3, 3.33, 3.66],
    openHat: [],
  },
  bounce: {
    name: 'Bounce',
    kick: [0, 0.75, 1.5, 2, 2.75, 3.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
    openHat: [0.25, 1.25, 2.25, 3.25],
  },
};

export const CATEGORIES = [
  { id: 'all', name: 'All Styles', color: '#a855f7' },
  { id: 'pnd', name: 'PartyNextDoor', color: '#7c3aed' },
  { id: 'bryson', name: 'Bryson Tiller', color: '#dc2626' },
  { id: 'sza', name: 'SZA', color: '#ea580c' },
  { id: 'rkelly', name: 'R. Kelly Era', color: '#0891b2' },
  { id: 'oldschool', name: 'Old School', color: '#be185d' },
  { id: 'neosoul', name: 'Neo Soul', color: '#15803d' },
  { id: 'modern', name: 'Modern R&B', color: '#6366f1' },
];

// Parse chord numeral to get actual chord
export const parseNumeral = (numeral, keyRoot) => {
  const numeralMap = {
    'I': 0, 'II': 2, 'III': 4, 'IV': 5, 'V': 7, 'VI': 9, 'VII': 11,
    'bII': 1, 'bIII': 3, 'bV': 6, 'bVI': 8, 'bVII': 10
  };
  
  let flat = numeral.startsWith('b');
  let root = flat ? numeral.slice(1) : numeral;
  let type = 'maj7';
  
  for (const t of Object.keys(CHORD_TYPES)) {
    if (root.endsWith(t)) {
      type = t;
      root = root.slice(0, -t.length);
      break;
    }
  }
  
  if (root.endsWith('min') || root.endsWith('m')) {
    if (!type.includes('min')) type = 'min7';
    root = root.replace(/min|m$/, '');
  }
  if (root.endsWith('7') && !CHORD_TYPES[type]) {
    type = 'dom7';
    root = root.slice(0, -1);
  }
  
  const interval = numeralMap[flat ? 'b' + root : root] || 0;
  const chordRoot = (keyRoot + interval) % 12;
  
  return {
    root: chordRoot,
    rootName: NOTES[chordRoot],
    type,
    typeName: CHORD_TYPES[type]?.name || type,
    intervals: CHORD_TYPES[type]?.intervals || [0, 4, 7],
    color: CHORD_TYPES[type]?.color || '#8b5cf6'
  };
};

// Generate MIDI notes for chord
export const generateChordMidi = (chord, octave = 3, inversion = 0) => {
  const baseNote = chord.root + (octave * 12);
  let notes = chord.intervals.map(i => baseNote + i);
  
  for (let i = 0; i < inversion; i++) {
    notes[i % notes.length] += 12;
  }
  
  return notes.sort((a, b) => a - b);
};

// Convert MIDI note to note name
export const midiToNoteName = (midi) => {
  const note = NOTES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${note}${octave}`;
};

// Generate melody notes
export const generateMelody = (chord, scale, pattern, octave = 4) => {
  const scaleIntervals = SCALES[scale]?.intervals || SCALES.pentatonicMinor.intervals;
  const scaleNotes = scaleIntervals.map(i => (chord.root + i) % 12);
  const baseOctave = octave * 12;
  
  return pattern.map(p => {
    const index = ((p % scaleNotes.length) + scaleNotes.length) % scaleNotes.length;
    const octaveOffset = Math.floor(p / scaleNotes.length);
    return baseOctave + scaleNotes[index] + (octaveOffset * 12);
  });
};
