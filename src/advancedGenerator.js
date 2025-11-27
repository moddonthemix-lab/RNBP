// Advanced music generation with randomization and variations
import { NOTES, CHORD_TYPES, SCALES, parseNumeral } from './musicData';

// Chord voicing variations
export const VOICINGS = {
  close: { name: 'Close Position', spread: 0 },
  drop2: { name: 'Drop 2', drop: [1] },
  drop3: { name: 'Drop 3', drop: [2] },
  drop24: { name: 'Drop 2+4', drop: [1, 3] },
  spread: { name: 'Spread', spread: 12 },
  shell: { name: 'Shell (Root+3+7)', indices: [0, 1, 3] },
  rootless: { name: 'Rootless', skipRoot: true },
};

// Rhythm patterns for chords
export const CHORD_RHYTHMS = [
  { name: 'Whole Notes', pattern: [{ beat: 0, duration: 4 }] },
  { name: 'Half Notes', pattern: [{ beat: 0, duration: 2 }, { beat: 2, duration: 2 }] },
  { name: 'Syncopated', pattern: [{ beat: 0, duration: 1.5 }, { beat: 1.5, duration: 1 }, { beat: 2.5, duration: 1.5 }] },
  { name: 'R&B Pump', pattern: [{ beat: 0, duration: 0.5 }, { beat: 0.75, duration: 0.5 }, { beat: 2, duration: 1 }, { beat: 3.5, duration: 0.5 }] },
  { name: 'Neo Soul Stabs', pattern: [{ beat: 0, duration: 0.25 }, { beat: 1, duration: 0.5 }, { beat: 2.5, duration: 0.25 }, { beat: 3, duration: 0.5 }] },
  { name: 'Gospel Bounce', pattern: [{ beat: 0, duration: 1 }, { beat: 1.5, duration: 0.5 }, { beat: 2, duration: 1 }, { beat: 3.5, duration: 0.5 }] },
  { name: 'Trap Soul', pattern: [{ beat: 0, duration: 2 }, { beat: 2.5, duration: 1.5 }] },
  { name: 'Ballad', pattern: [{ beat: 0, duration: 3 }, { beat: 3.5, duration: 0.5 }] },
];

// Bass patterns
export const BASS_PATTERNS = [
  { 
    name: 'Simple Root-Fifth', 
    pattern: [
      { beat: 0, interval: 0, duration: 1.5 },
      { beat: 2, interval: 7, duration: 1.5 }
    ]
  },
  { 
    name: 'Walking', 
    pattern: [
      { beat: 0, interval: 0, duration: 0.75 },
      { beat: 1, interval: 4, duration: 0.75 },
      { beat: 2, interval: 7, duration: 0.75 },
      { beat: 3, interval: 5, duration: 0.75 }
    ]
  },
  { 
    name: 'Syncopated Groove', 
    pattern: [
      { beat: 0, interval: 0, duration: 1 },
      { beat: 1.5, interval: 0, duration: 0.5 },
      { beat: 2.5, interval: 7, duration: 1 },
      { beat: 3.75, interval: 5, duration: 0.25 }
    ]
  },
  { 
    name: 'Octave Bounce', 
    pattern: [
      { beat: 0, interval: 0, duration: 0.5 },
      { beat: 0.75, interval: 12, duration: 0.5 },
      { beat: 2, interval: 0, duration: 0.5 },
      { beat: 2.75, interval: 12, duration: 0.5 }
    ]
  },
  { 
    name: 'PND Dark', 
    pattern: [
      { beat: 0, interval: 0, duration: 2.5 },
      { beat: 3, interval: -5, duration: 1 }
    ]
  },
  { 
    name: 'Bryson Trap', 
    pattern: [
      { beat: 0, interval: 0, duration: 0.75 },
      { beat: 1, interval: 0, duration: 0.25 },
      { beat: 1.5, interval: 0, duration: 0.25 },
      { beat: 2.5, interval: 7, duration: 1 }
    ]
  },
  {
    name: 'Gospel Run',
    pattern: [
      { beat: 0, interval: 0, duration: 0.5 },
      { beat: 0.5, interval: 2, duration: 0.5 },
      { beat: 1, interval: 4, duration: 0.5 },
      { beat: 1.5, interval: 5, duration: 0.5 },
      { beat: 2, interval: 7, duration: 1.5 }
    ]
  },
  {
    name: 'Minimal',
    pattern: [
      { beat: 0, interval: 0, duration: 3.5 }
    ]
  }
];

// Extended chord substitutions
export const CHORD_SUBSTITUTIONS = {
  'maj7': ['maj9', 'maj7', '6/9', 'add9'],
  'min7': ['min9', 'min7', 'min11', 'min7'],
  'dom7': ['dom9', 'dom7', '13', 'dom7'],
  '7': ['9', '7', '13', '7'],
};

// Random utility
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomFloat = (min, max) => Math.random() * (max - min) + min;

// Generate a random variation of a chord
export const generateChordVariation = (baseChord, variationLevel = 0.5) => {
  let chord = { ...baseChord };
  
  // Maybe substitute chord type
  if (Math.random() < variationLevel * 0.5) {
    const subs = CHORD_SUBSTITUTIONS[chord.type];
    if (subs) {
      const newType = randomChoice(subs);
      if (CHORD_TYPES[newType]) {
        chord.type = newType;
        chord.typeName = CHORD_TYPES[newType].name;
        chord.intervals = CHORD_TYPES[newType].intervals;
        chord.color = CHORD_TYPES[newType].color;
      }
    }
  }
  
  // Random inversion
  chord.inversion = random(0, 2);
  
  // Random voicing
  chord.voicing = randomChoice(Object.keys(VOICINGS));
  
  return chord;
};

// Apply voicing to MIDI notes
export const applyVoicing = (notes, voicingType, octave = 3) => {
  const voicing = VOICINGS[voicingType] || VOICINGS.close;
  let result = [...notes];
  
  if (voicing.drop) {
    voicing.drop.forEach(idx => {
      if (result[idx] !== undefined) {
        result[idx] -= 12;
      }
    });
    result.sort((a, b) => a - b);
  }
  
  if (voicing.spread) {
    result = result.map((note, i) => note + (i * Math.floor(voicing.spread / result.length)));
  }
  
  if (voicing.indices) {
    result = voicing.indices.map(i => notes[i]).filter(n => n !== undefined);
  }
  
  if (voicing.skipRoot) {
    result = result.slice(1);
  }
  
  return result;
};

// Generate melody with randomization
export const generateRandomMelody = (chord, scale, length = 8, style = 'balanced') => {
  const scaleIntervals = SCALES[scale]?.intervals || SCALES.pentatonicMinor.intervals;
  const scaleNotes = scaleIntervals.map(i => (chord.root + i) % 12);
  
  const melody = [];
  const rhythm = [];
  let currentBeat = 0;
  let lastIndex = random(0, 3);
  
  const styleConfig = {
    balanced: { stepChance: 0.6, leapMax: 3, restChance: 0.1 },
    stepwise: { stepChance: 0.85, leapMax: 2, restChance: 0.05 },
    leapy: { stepChance: 0.3, leapMax: 5, restChance: 0.15 },
    rhythmic: { stepChance: 0.5, leapMax: 3, restChance: 0.2 },
  };
  
  const config = styleConfig[style] || styleConfig.balanced;
  
  while (melody.length < length && currentBeat < 4) {
    // Rest chance
    if (Math.random() < config.restChance) {
      currentBeat += randomChoice([0.25, 0.5]);
      continue;
    }
    
    // Determine next note
    let nextIndex;
    if (Math.random() < config.stepChance) {
      // Step motion
      nextIndex = lastIndex + randomChoice([-1, 1]);
    } else {
      // Leap
      nextIndex = lastIndex + random(-config.leapMax, config.leapMax);
    }
    
    // Keep in range
    nextIndex = Math.max(0, Math.min(scaleNotes.length + 3, nextIndex));
    
    const octaveOffset = Math.floor(nextIndex / scaleNotes.length);
    const noteIndex = ((nextIndex % scaleNotes.length) + scaleNotes.length) % scaleNotes.length;
    const midiNote = 60 + scaleNotes[noteIndex] + (octaveOffset * 12);
    
    melody.push(midiNote);
    rhythm.push(currentBeat);
    
    // Advance time with varied durations
    const durations = [0.25, 0.33, 0.5, 0.75, 1];
    currentBeat += randomChoice(durations);
    lastIndex = nextIndex;
  }
  
  return { notes: melody, rhythm };
};

// Generate variations of a progression
export const generateProgressionVariations = (baseProgression, key, count = 4, variationLevel = 0.5) => {
  const variations = [];
  
  for (let v = 0; v < count; v++) {
    const variation = {
      id: `var-${v}-${Date.now()}`,
      name: `Variation ${v + 1}`,
      chords: [],
      chordRhythm: randomChoice(CHORD_RHYTHMS),
      bassPattern: randomChoice(BASS_PATTERNS),
      swing: randomFloat(0.05, 0.25),
      velocity: random(70, 100),
    };
    
    baseProgression.numerals.forEach((numeral, i) => {
      const baseChord = parseNumeral(numeral, key);
      const variedChord = generateChordVariation(baseChord, variationLevel);
      
      // Generate MIDI notes with voicing
      const baseNotes = variedChord.intervals.map(interval => 
        variedChord.root + (3 * 12) + interval
      );
      
      // Apply inversion
      let notes = [...baseNotes];
      for (let inv = 0; inv < variedChord.inversion; inv++) {
        notes[inv % notes.length] += 12;
      }
      notes.sort((a, b) => a - b);
      
      // Apply voicing
      notes = applyVoicing(notes, variedChord.voicing);
      
      variation.chords.push({
        ...variedChord,
        midiNotes: notes,
        originalNumeral: numeral,
      });
    });
    
    variations.push(variation);
  }
  
  return variations;
};

// Generate complete arrangement
export const generateArrangement = (progression, key, options = {}) => {
  const {
    variationLevel = 0.5,
    melodyStyle = 'balanced',
    scale = 'pentatonicMinor',
    includeBass = true,
    includeMelody = true,
    bars = 4,
  } = options;
  
  const arrangement = {
    id: `arr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    key: NOTES[key],
    keyIndex: key,
    tempo: random(70, 100),
    swing: randomFloat(0.08, 0.22),
    chordRhythm: randomChoice(CHORD_RHYTHMS),
    bassPattern: randomChoice(BASS_PATTERNS),
    sections: [],
  };
  
  // Generate chord section
  const chords = progression.numerals.map((numeral, i) => {
    const baseChord = parseNumeral(numeral, key);
    const variedChord = generateChordVariation(baseChord, variationLevel);
    
    const baseNotes = variedChord.intervals.map(interval => 
      variedChord.root + (3 * 12) + interval
    );
    
    let notes = [...baseNotes];
    for (let inv = 0; inv < (variedChord.inversion || 0); inv++) {
      notes[inv % notes.length] += 12;
    }
    notes.sort((a, b) => a - b);
    
    const voicing = randomChoice(Object.keys(VOICINGS));
    notes = applyVoicing(notes, voicing);
    
    return {
      ...variedChord,
      midiNotes: notes,
      voicing,
    };
  });
  
  arrangement.chords = chords;
  
  // Generate melody for each chord
  if (includeMelody) {
    arrangement.melodies = chords.map(chord => 
      generateRandomMelody(chord, scale, random(4, 8), melodyStyle)
    );
  }
  
  // Generate bass line
  if (includeBass) {
    arrangement.bassNotes = chords.map(chord => ({
      root: chord.root + 36, // Bass octave
      pattern: arrangement.bassPattern,
    }));
  }
  
  return arrangement;
};

// Generate multiple unique arrangements
export const generateMultipleArrangements = (progression, key, count = 6, options = {}) => {
  const arrangements = [];
  
  const styles = ['balanced', 'stepwise', 'leapy', 'rhythmic'];
  const scales = ['pentatonicMinor', 'dorian', 'minor', 'blues', 'pentatonicMajor'];
  
  for (let i = 0; i < count; i++) {
    const arrangement = generateArrangement(progression, key, {
      ...options,
      variationLevel: 0.3 + (i * 0.1),
      melodyStyle: styles[i % styles.length],
      scale: options.scale || scales[i % scales.length],
    });
    
    arrangement.name = `Version ${i + 1}`;
    arrangement.description = `${arrangement.chordRhythm.name} chords, ${arrangement.bassPattern.name} bass`;
    arrangements.push(arrangement);
  }
  
  return arrangements;
};

// Humanize timing
export const humanize = (time, amount = 0.02) => {
  return time + (Math.random() - 0.5) * amount;
};

// Humanize velocity
export const humanizeVelocity = (velocity, amount = 15) => {
  return Math.max(40, Math.min(127, velocity + random(-amount, amount)));
};
