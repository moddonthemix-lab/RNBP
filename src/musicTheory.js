/**
 * Professional Music Theory Library
 * Multi-Platinum R&B Production Grade Scales & Theory
 */

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Professional Scale Library - Used by top R&B producers
 * Each scale has intervals (semitones from root) and characteristic mood
 */
export const SCALES = {
  // MAJOR SCALES
  major: {
    name: 'Major (Ionian)',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    mood: ['happy', 'bright', 'uplifting', 'pop'],
    rnbUse: 'Happy R&B, uplifting choruses',
    artists: ['Bruno Mars', 'Anderson .Paak']
  },

  lydian: {
    name: 'Lydian',
    intervals: [0, 2, 4, 6, 7, 9, 11],
    mood: ['dreamy', 'floating', 'magical', 'ethereal'],
    rnbUse: 'Ethereal SZA-type vibes, dream sequences',
    artists: ['SZA', 'Frank Ocean']
  },

  mixolydian: {
    name: 'Mixolydian',
    intervals: [0, 2, 4, 5, 7, 9, 10],
    mood: ['funky', 'groovy', 'soulful', 'bluesy'],
    rnbUse: 'Funky neo-soul, D\'Angelo style grooves',
    artists: ['D\'Angelo', 'Anderson .Paak']
  },

  // MINOR SCALES
  naturalMinor: {
    name: 'Natural Minor (Aeolian)',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    mood: ['sad', 'dark', 'emotional', 'melancholic'],
    rnbUse: 'Emotional verses, dark R&B, The Weeknd vibes',
    artists: ['The Weeknd', 'PartyNextDoor']
  },

  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    mood: ['exotic', 'dramatic', 'middle-eastern', 'tense'],
    rnbUse: 'Dramatic moments, exotic flavor',
    artists: ['FKA Twigs', 'Beyoncé']
  },

  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [0, 2, 3, 5, 7, 9, 11],
    mood: ['jazzy', 'sophisticated', 'smooth', 'ascending'],
    rnbUse: 'Jazzy neo-soul, sophisticated production',
    artists: ['Robert Glasper', 'H.E.R.']
  },

  dorian: {
    name: 'Dorian',
    intervals: [0, 2, 3, 5, 7, 9, 10],
    mood: ['soulful', 'jazzy', 'cool', 'smooth'],
    rnbUse: 'THE neo-soul scale - Erykah Badu, D\'Angelo',
    artists: ['D\'Angelo', 'Erykah Badu', 'Robert Glasper']
  },

  phrygian: {
    name: 'Phrygian',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    mood: ['dark', 'spanish', 'flamenco', 'exotic'],
    rnbUse: 'Dark trap-soul, Spanish influence',
    artists: ['Travis Scott', 'Rosalía']
  },

  locrian: {
    name: 'Locrian',
    intervals: [0, 1, 3, 5, 6, 8, 10],
    mood: ['unstable', 'tense', 'dissonant', 'avant-garde'],
    rnbUse: 'Experimental R&B, transition moments',
    artists: ['FKA Twigs', 'James Blake']
  },

  // PENTATONIC SCALES - Essential for R&B
  majorPentatonic: {
    name: 'Major Pentatonic',
    intervals: [0, 2, 4, 7, 9],
    mood: ['simple', 'catchy', 'melodic', 'pop'],
    rnbUse: 'Catchy hooks, vocal runs, melodies',
    artists: ['Chris Brown', 'Usher', 'Bruno Mars']
  },

  minorPentatonic: {
    name: 'Minor Pentatonic',
    intervals: [0, 3, 5, 7, 10],
    mood: ['bluesy', 'soulful', 'emotional', 'raw'],
    rnbUse: 'THE R&B SCALE - vocal runs, emotional melodies',
    artists: ['Bryson Tiller', 'H.E.R.', 'Summer Walker']
  },

  // BLUES SCALES
  blues: {
    name: 'Blues Scale',
    intervals: [0, 3, 5, 6, 7, 10],
    mood: ['bluesy', 'soulful', 'gritty', 'raw'],
    rnbUse: 'Soulful leads, blues-influenced R&B',
    artists: ['H.E.R.', 'Leon Bridges', 'Daniel Caesar']
  },

  majorBlues: {
    name: 'Major Blues',
    intervals: [0, 2, 3, 4, 7, 9],
    mood: ['happy-blues', 'optimistic', 'swingy'],
    rnbUse: 'Upbeat soul, retro R&B',
    artists: ['Bruno Mars', 'Leon Bridges']
  },

  // EXOTIC SCALES
  wholeHalf: {
    name: 'Whole-Half Diminished',
    intervals: [0, 2, 3, 5, 6, 8, 9, 11],
    mood: ['jazzy', 'tense', 'colorful', 'complex'],
    rnbUse: 'Jazz-influenced R&B, sophisticated',
    artists: ['Robert Glasper', 'Thundercat']
  },

  wholeTone: {
    name: 'Whole Tone',
    intervals: [0, 2, 4, 6, 8, 10],
    mood: ['dreamy', 'floating', 'surreal', 'mysterious'],
    rnbUse: 'Atmospheric moments, dream sequences',
    artists: ['Frank Ocean', 'FKA Twigs']
  },

  hirajoshi: {
    name: 'Hirajoshi (Japanese)',
    intervals: [0, 2, 3, 7, 8],
    mood: ['japanese', 'exotic', 'contemplative', 'minimal'],
    rnbUse: 'Experimental R&B, Asian influence',
    artists: ['PARTYNEXTDOOR', 'Jhené Aiko']
  },

  insen: {
    name: 'In-Sen (Japanese)',
    intervals: [0, 1, 5, 7, 10],
    mood: ['mysterious', 'exotic', 'dark', 'minimal'],
    rnbUse: 'Dark R&B, minimalist production',
    artists: ['The Weeknd', 'PARTYNEXTDOOR']
  },

  // HYBRID SCALES FOR R&B
  dorianb2: {
    name: 'Dorian b2 (Phrygian #6)',
    intervals: [0, 1, 3, 5, 7, 9, 10],
    mood: ['exotic', 'dark-jazzy', 'sophisticated'],
    rnbUse: 'Advanced R&B production',
    artists: ['Robert Glasper', 'Kaytranada']
  },

  lydianDominant: {
    name: 'Lydian Dominant',
    intervals: [0, 2, 4, 6, 7, 9, 10],
    mood: ['funky', 'bright', 'jazzy', 'colorful'],
    rnbUse: 'Funky neo-soul, jazz-funk',
    artists: ['Anderson .Paak', 'Thundercat']
  },

  alteredScale: {
    name: 'Altered Scale (Super Locrian)',
    intervals: [0, 1, 3, 4, 6, 8, 10],
    mood: ['tense', 'jazzy', 'complex', 'avant-garde'],
    rnbUse: 'Jazz-R&B, experimental',
    artists: ['Robert Glasper', 'Kamasi Washington']
  }
};

/**
 * Get scale notes in a specific key
 */
export const getScaleNotes = (rootNote, scaleType) => {
  const scale = SCALES[scaleType];
  if (!scale) return [];

  const rootIndex = NOTES.indexOf(rootNote);
  if (rootIndex === -1) return [];

  return scale.intervals.map(interval => {
    return NOTES[(rootIndex + interval) % 12];
  });
};

/**
 * Get MIDI numbers for scale (with octave)
 */
export const getScaleMidi = (rootMidi, scaleType, numOctaves = 2) => {
  const scale = SCALES[scaleType];
  if (!scale) return [];

  const notes = [];
  for (let octave = 0; octave < numOctaves; octave++) {
    scale.intervals.forEach(interval => {
      notes.push(rootMidi + interval + (octave * 12));
    });
  }

  return notes;
};

/**
 * Intelligent scale selection based on artist, section, and mood
 */
export const selectScaleForContext = (artistStyle, sectionType, mood = 'balanced') => {
  const scalesByArtistStyle = {
    // SZA - Ethereal, dreamy
    ethereal: ['lydian', 'majorPentatonic', 'major', 'wholeTone', 'dorian'],
    floaty: ['lydian', 'wholeTone', 'majorPentatonic', 'major'],

    // PARTYNEXTDOOR - Dark, moody
    dark: ['naturalMinor', 'phrygian', 'insen', 'harmonicMinor', 'minorPentatonic'],
    moody: ['dorian', 'naturalMinor', 'phrygian', 'minorPentatonic'],
    nocturnal: ['naturalMinor', 'phrygian', 'dorian', 'blues'],

    // Bryson Tiller - Trap Soul
    'trap-soul': ['minorPentatonic', 'naturalMinor', 'dorian', 'blues'],
    emotional: ['minorPentatonic', 'blues', 'naturalMinor', 'dorian'],

    // Summer Walker - Warm, intimate
    warm: ['majorPentatonic', 'major', 'dorian', 'mixolydian'],
    intimate: ['majorPentatonic', 'minorPentatonic', 'dorian', 'naturalMinor'],

    // Neo Soul - Jazzy, sophisticated
    soulful: ['dorian', 'mixolydian', 'blues', 'minorPentatonic'],
    jazzy: ['dorian', 'melodicMinor', 'lydianDominant', 'mixolydian', 'wholeHalf'],
    groovy: ['mixolydian', 'dorian', 'majorBlues', 'blues']
  };

  // Get appropriate scales for this style
  let appropriateScales = [];

  if (Array.isArray(artistStyle)) {
    artistStyle.forEach(tag => {
      if (scalesByArtistStyle[tag]) {
        appropriateScales = [...appropriateScales, ...scalesByArtistStyle[tag]];
      }
    });
  } else if (scalesByArtistStyle[artistStyle]) {
    appropriateScales = scalesByArtistStyle[artistStyle];
  }

  // Default to safe R&B scales if none found
  if (appropriateScales.length === 0) {
    appropriateScales = ['minorPentatonic', 'dorian', 'naturalMinor', 'majorPentatonic'];
  }

  // Section-based adjustments
  const sectionScaleWeights = {
    intro: ['lydian', 'majorPentatonic', 'wholeTone', 'dorian'],
    verse: ['minorPentatonic', 'dorian', 'naturalMinor', 'blues'],
    preChorus: ['dorian', 'mixolydian', 'melodicMinor'],
    chorus: ['major', 'majorPentatonic', 'lydian', 'mixolydian'],
    bridge: ['melodicMinor', 'harmonicMinor', 'phrygian', 'lydianDominant'],
    breakdown: ['minorPentatonic', 'naturalMinor', 'wholeTone'],
    drop: ['phrygian', 'harmonicMinor', 'blues'],
    outro: ['majorPentatonic', 'minorPentatonic', 'lydian', 'dorian']
  };

  // Blend artist preference with section appropriateness
  const sectionPreferred = sectionScaleWeights[sectionType] || ['dorian', 'minorPentatonic'];

  // Find scales that appear in both lists (ideal match)
  const idealScales = appropriateScales.filter(s => sectionPreferred.includes(s));

  // If we have ideal matches, pick from those; otherwise use artist preference
  const finalPool = idealScales.length > 0 ? idealScales : appropriateScales;

  // Pick a random scale from the pool
  return finalPool[Math.floor(Math.random() * finalPool.length)];
};

/**
 * Generate melody notes from a scale
 */
export const generateMelodyFromScale = (rootMidi, scaleType, numNotes = 8, octaveRange = 2) => {
  const scaleMidi = getScaleMidi(rootMidi, scaleType, octaveRange);
  const melody = [];

  for (let i = 0; i < numNotes; i++) {
    const note = scaleMidi[Math.floor(Math.random() * scaleMidi.length)];
    melody.push(note);
  }

  return melody;
};

/**
 * Chord-Scale relationships for smart voicing
 */
export const getScaleForChord = (chordType) => {
  const chordScaleMap = {
    'maj7': ['major', 'lydian', 'majorPentatonic'],
    'maj9': ['major', 'lydian', 'majorPentatonic'],
    'maj7#11': ['lydian'],
    'min7': ['dorian', 'naturalMinor', 'minorPentatonic'],
    'min9': ['dorian', 'naturalMinor', 'minorPentatonic'],
    'min11': ['dorian', 'phrygian', 'minorPentatonic'],
    'dom7': ['mixolydian', 'blues', 'lydianDominant'],
    'dom9': ['mixolydian', 'blues'],
    '7#9': ['blues', 'alteredScale', 'harmonicMinor'],
    '13': ['mixolydian', 'lydianDominant'],
    'sus2': ['mixolydian', 'major', 'majorPentatonic'],
    'sus4': ['mixolydian', 'major'],
    '7sus4': ['mixolydian', 'dorian'],
    'add9': ['major', 'lydian', 'majorPentatonic'],
    'dim7': ['wholeTone', 'wholeHalf', 'locrian'],
    'm7b5': ['locrian', 'naturalMinor', 'alteredScale']
  };

  return chordScaleMap[chordType] || ['minorPentatonic', 'dorian'];
};

export default {
  NOTES,
  SCALES,
  getScaleNotes,
  getScaleMidi,
  selectScaleForContext,
  generateMelodyFromScale,
  getScaleForChord
};
