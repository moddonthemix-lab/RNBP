/**
 * R&B Song Structure & Artist Style Library
 * Based on Ultimate RnB & Blues Theory Guide + JSON Dataset
 */

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord types from the JSON dataset
export const CHORD_TYPES = {
  'maj7': { 
    intervals: [0, 4, 7, 11], 
    name: 'Major 7', 
    color: '#6366f1',
    function: ['I', 'IV'],
    mood: ['smooth', 'warm', 'open', 'positive']
  },
  'maj9': { 
    intervals: [0, 4, 7, 11, 14], 
    name: 'Major 9', 
    color: '#8b5cf6',
    function: ['I', 'IV'],
    mood: ['lush', 'jazzy', 'elegant']
  },
  'min7': { 
    intervals: [0, 3, 7, 10], 
    name: 'Minor 7', 
    color: '#a855f7',
    function: ['ii', 'iii', 'vi', 'i'],
    mood: ['emotional', 'intimate', 'sad', 'dark']
  },
  'min9': { 
    intervals: [0, 3, 7, 10, 14], 
    name: 'Minor 9', 
    color: '#d946ef',
    function: ['ii', 'iii', 'vi', 'i'],
    mood: ['dreamy', 'lush', 'dark', 'modern']
  },
  'min11': { 
    intervals: [0, 3, 7, 10, 14, 17], 
    name: 'Minor 11', 
    color: '#ec4899',
    function: ['ii', 'iii', 'vi', 'i'],
    mood: ['atmospheric', 'cinematic', 'floaty']
  },
  'dom7': { 
    intervals: [0, 4, 7, 10], 
    name: 'Dominant 7', 
    color: '#f43f5e',
    function: ['V', 'bVII'],
    mood: ['bluesy', 'tense', 'resolving']
  },
  'dom9': { 
    intervals: [0, 4, 7, 10, 14], 
    name: 'Dominant 9', 
    color: '#f97316',
    function: ['V', 'bVII'],
    mood: ['soulful', 'funky', 'bluesy']
  },
  '7#9': { 
    intervals: [0, 4, 7, 10, 15], 
    name: '7#9 (Hendrix)', 
    color: '#ef4444',
    function: ['V'],
    mood: ['edgy', 'bluesy', 'psychedelic']
  },
  '13': { 
    intervals: [0, 4, 7, 10, 14, 21], 
    name: '13th', 
    color: '#eab308',
    function: ['V'],
    mood: ['soulful', 'jazzy', 'rich', 'old-school']
  },
  'sus2': { 
    intervals: [0, 2, 7], 
    name: 'Sus2', 
    color: '#22c55e',
    function: ['I', 'IV', 'V'],
    mood: ['open', 'airy', 'modern']
  },
  'sus4': { 
    intervals: [0, 5, 7], 
    name: 'Sus4', 
    color: '#14b8a6',
    function: ['I', 'IV', 'V'],
    mood: ['suspended', 'tense', 'anticipation']
  },
  '7sus4': { 
    intervals: [0, 5, 7, 10], 
    name: '7sus4', 
    color: '#06b6d4',
    function: ['V'],
    mood: ['soulful', 'open', 'gospel']
  },
  'add9': { 
    intervals: [0, 4, 7, 14], 
    name: 'Add9', 
    color: '#0ea5e9',
    function: ['I', 'IV', 'vi'],
    mood: ['modern', 'airy', 'emotional']
  },
  'dim7': { 
    intervals: [0, 3, 6, 9], 
    name: 'Dim7', 
    color: '#64748b',
    function: ['vii°'],
    mood: ['dark', 'passing', 'tense']
  },
  'm7b5': { 
    intervals: [0, 3, 6, 10], 
    name: 'Half Dim', 
    color: '#78716c',
    function: ['vii°', 'ii'],
    mood: ['jazzy', 'dark', 'sophisticated']
  },
  'maj7#11': { 
    intervals: [0, 4, 7, 11, 18], 
    name: 'Maj7#11', 
    color: '#7c3aed',
    function: ['IV'],
    mood: ['dreamy', 'floating', 'lydian']
  },
};

// Song section definitions
export const SECTION_TYPES = {
  intro: { name: 'Intro', bars: 4, energy: 0.3, description: 'Set the mood' },
  verse: { name: 'Verse', bars: 8, energy: 0.5, description: 'Tell the story - sparse m7 chords' },
  preChorus: { name: 'Pre-Chorus', bars: 4, energy: 0.7, description: 'Build tension - 9, 11, 13 extensions' },
  chorus: { name: 'Chorus', bars: 8, energy: 1.0, description: 'Main hook - lush Maj7/Maj9' },
  bridge: { name: 'Bridge', bars: 4, energy: 0.6, description: 'Change it up - modal (Dorian/Melodic Minor)' },
  breakdown: { name: 'Breakdown', bars: 4, energy: 0.25, description: 'Strip it back' },
  drop: { name: 'Drop', bars: 4, energy: 0.9, description: 'Impact moment' },
  outro: { name: 'Outro', bars: 4, energy: 0.3, description: 'Fade out' },
};

// Song structures for different vibes
export const SONG_STRUCTURES = {
  standard: {
    name: 'Standard R&B',
    sections: ['intro', 'verse', 'preChorus', 'chorus', 'verse', 'preChorus', 'chorus', 'bridge', 'chorus', 'outro']
  },
  trapSoul: {
    name: 'Trap Soul',
    sections: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'breakdown', 'drop', 'chorus', 'outro']
  },
  darkMinimal: {
    name: 'Dark Minimal',
    sections: ['intro', 'verse', 'chorus', 'verse', 'chorus', 'breakdown', 'outro']
  },
  balladSlow: {
    name: 'Slow Ballad',
    sections: ['intro', 'verse', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro']
  },
  neoSoul: {
    name: 'Neo Soul',
    sections: ['intro', 'verse', 'preChorus', 'chorus', 'verse', 'chorus', 'bridge', 'breakdown', 'chorus', 'outro']
  }
};

// ============================================
// ARTIST DATA FROM JSON + PDF
// ============================================

export const ARTISTS = {
  sza: {
    name: 'SZA',
    description: 'Ethereal, Floating, Emotional',
    color: '#ea580c',
    tempo: { min: 75, max: 85 },
    swing: 0.15,
    
    // From JSON: style_tags
    style_tags: ['ethereal', 'floaty', 'emotional', 'spacey', 'nostalgic'],
    
    // From JSON: typical_chords
    chordBank: ['Cmaj7', 'Fmaj9', 'Am9', 'Dm7', 'E7#9', 'Gadd9', 'Em7', 'Gsus2'],
    
    // From JSON: preferred_chord_types
    preferredTypes: ['maj7', 'maj9', 'min7', 'min9', 'add9'],
    
    // AI prompt hint from JSON
    aiHint: 'Ethereal, airy, nostalgic RNB with open Maj7/Maj9 chords and floaty melodies',
    
    preferredStructure: 'standard',
    
    // Section progressions based on JSON typical_progressions
    sections: {
      intro: {
        progressions: [
          ['Fmaj9', 'Gadd9'],           // Airy open
          ['Am9', 'Fmaj9'],              // Floaty
        ]
      },
      verse: {
        progressions: [
          ['Am9', 'Fmaj9', 'Cmaj7', 'Gadd9'],  // Ethereal Loop from JSON
          ['Dm7', 'Am9', 'Fmaj9', 'Em7'],      // Sparse emotional
          ['Cmaj7', 'Em7', 'Am9', 'Fmaj9'],    // Dreamy
        ]
      },
      preChorus: {
        progressions: [
          ['Dm7', 'E7#9', 'Am9', 'Fmaj9'],    // Building with tension
          ['Fmaj9', 'Gadd9', 'Am9', 'Em7'],
        ]
      },
      chorus: {
        progressions: [
          ['Cmaj7', 'Gadd9', 'Am9', 'Fmaj9'],  // Dreamy Pop-RNB from JSON
          ['Fmaj9', 'Cmaj7', 'Gadd9', 'Am9'],
          ['Am9', 'Fmaj9', 'Cmaj7', 'Gadd9'],  // vi-IV-I-V ethereal
        ]
      },
      bridge: {
        progressions: [
          ['Dm7', 'Cmaj7', 'Am9', 'E7#9'],     // Modal shift
          ['Em7', 'Fmaj9', 'Dm7', 'Gadd9'],
        ]
      },
      breakdown: {
        progressions: [
          ['Am9', 'Fmaj9'],
          ['Cmaj7', 'Gadd9'],
        ]
      },
      drop: {
        progressions: [
          ['Fmaj9', 'Gadd9', 'Am9'],
        ]
      },
      outro: {
        progressions: [
          ['Fmaj9', 'Cmaj7', 'Am9'],
          ['Gadd9', 'Fmaj9', 'Cmaj7'],
        ]
      }
    },
    
    drumPattern: 'neoSoul',
    bassPattern: 'rootFifth',
    
    // From JSON melodic_characteristics
    melodic: {
      rhythm: 'loose, lazy timing, behind the beat',
      intervals: 'frequent 9ths and 11ths, slides and glissando',
      scales: ['dorian', 'major', 'minorPentatonic']
    }
  },

  pnd: {
    name: 'PartyNextDoor',
    description: 'Dark, Moody, Toronto Sound',
    color: '#7c3aed',
    tempo: { min: 65, max: 75 },
    swing: 0.08,
    
    // From JSON
    style_tags: ['dark', 'moody', 'minimal', 'nocturnal', 'OVO'],
    chordBank: ['Dm9', 'Fmaj7#11', 'Em11', 'Gmaj7', 'Bbmaj9', 'Am9', 'Cm9', 'Ebmaj7'],
    preferredTypes: ['min7', 'min9', 'min11', 'maj7'],
    aiHint: 'Dark Toronto RNB with moody minor 9 chords and minimal atmospheric pads',
    
    preferredStructure: 'darkMinimal',
    
    sections: {
      intro: {
        progressions: [
          ['Dm9', 'Bbmaj9'],               // Dark OVO
          ['Am9', 'Gmaj7'],
        ]
      },
      verse: {
        progressions: [
          ['Dm9', 'Bbmaj9', 'Cmaj7'],      // OVO Dark Progression from JSON (i-bVI-bVII)
          ['Am9', 'Dm9', 'Gmaj7'],          // Minor Loop from JSON (i-iv-bVII)
          ['Em11', 'Dm9', 'Bbmaj9', 'Am9'],
        ]
      },
      preChorus: {
        progressions: [
          ['Fmaj7#11', 'Em11', 'Dm9', 'Am9'],
          ['Gmaj7', 'Am9', 'Dm9', 'Bbmaj9'],
        ]
      },
      chorus: {
        progressions: [
          ['Am9', 'Fmaj7#11', 'Dm9', 'Gmaj7'],
          ['Dm9', 'Bbmaj9', 'Gmaj7', 'Am9'],
          ['Em11', 'Dm9', 'Bbmaj9', 'Cmaj7'],
        ]
      },
      bridge: {
        progressions: [
          ['Cm9', 'Bbmaj9', 'Ebmaj7', 'Dm9'],
          ['Fmaj7#11', 'Dm9', 'Am9', 'Gmaj7'],
        ]
      },
      breakdown: {
        progressions: [
          ['Dm9', 'Am9'],
          ['Bbmaj9', 'Gmaj7'],
        ]
      },
      drop: {
        progressions: [
          ['Dm9', 'Bbmaj9', 'Cmaj7'],
        ]
      },
      outro: {
        progressions: [
          ['Dm9', 'Bbmaj9', 'Am9'],
          ['Gmaj7', 'Dm9'],
        ]
      }
    },
    
    drumPattern: 'minimal',
    bassPattern: 'sustained',
    
    melodic: {
      rhythm: 'simple, repetitive, hook-focused',
      intervals: 'small ranges with occasional leaps for emphasis',
      scales: ['naturalMinor', 'minorPentatonic', 'blues']
    }
  },

  bryson: {
    name: 'Bryson Tiller',
    description: 'Trap Soul - Emotional but Rhythmic',
    color: '#dc2626',
    tempo: { min: 85, max: 100 },
    swing: 0.12,
    
    // From JSON
    style_tags: ['trap-soul', 'emotional', 'rhythmic', 'punchy', 'introspective'],
    chordBank: ['Am7', 'Dm9', 'G7sus4', 'Em7b5', 'Fmaj7', 'Cmaj7', 'Em7', 'Bm7b5'],
    preferredTypes: ['min7', 'min9', 'dom7', 'add9', '7sus4'],
    aiHint: 'Trap-soul RNB with punchy drums, emotional minor 7/9 chords and rhythmic melodies',
    
    preferredStructure: 'trapSoul',
    
    sections: {
      intro: {
        progressions: [
          ['Am7', 'Fmaj7'],
          ['Dm9', 'Em7'],
        ]
      },
      verse: {
        progressions: [
          ['Am7', 'Dm9', 'Em7'],             // Minor RNB from JSON (i-iv-v)
          ['Am7', 'Fmaj7', 'Dm9', 'Em7'],
          ['Dm9', 'Am7', 'G7sus4', 'Fmaj7'],
        ]
      },
      preChorus: {
        progressions: [
          ['Fmaj7', 'G7sus4', 'Am7', 'Em7'],
          ['Dm9', 'Em7b5', 'Am7', 'Fmaj7'],
        ]
      },
      chorus: {
        progressions: [
          ['Am7', 'Fmaj7', 'G7sus4', 'Cmaj7'],  // Trap-Soul Hook from JSON (vi-IV-V-I)
          ['Dm9', 'Am7', 'Fmaj7', 'G7sus4'],
          ['Am7', 'Fmaj7', 'Cmaj7', 'G7sus4'],
        ]
      },
      bridge: {
        progressions: [
          ['Em7b5', 'Am7', 'Dm9', 'Fmaj7'],
          ['Bm7b5', 'Am7', 'G7sus4', 'Fmaj7'],
        ]
      },
      breakdown: {
        progressions: [
          ['Am7', 'Fmaj7'],
          ['Dm9', 'G7sus4'],
        ]
      },
      drop: {
        progressions: [
          ['Am7', 'Fmaj7', 'G7sus4', 'Cmaj7'],
        ]
      },
      outro: {
        progressions: [
          ['Am7', 'Fmaj7', 'Dm9'],
          ['G7sus4', 'Am7'],
        ]
      }
    },
    
    drumPattern: 'trapBounce',
    bassPattern: 'trap',
    
    melodic: {
      rhythm: 'talk-singing flow, syncopated phrasing',
      intervals: 'pentatonic riffs with expressive slides',
      scales: ['minorPentatonic', 'blues', 'naturalMinor']
    }
  },

  summer: {
    name: 'Summer Walker',
    description: 'Soft, Warm, Intimate R&B',
    color: '#be185d',
    tempo: { min: 72, max: 82 },
    swing: 0.18,
    
    // From JSON
    style_tags: ['warm', 'intimate', 'melancholy', 'acoustic', 'soft'],
    chordBank: ['Emaj7', 'C#m7', 'F#m9', 'Amaj9', 'B7', 'G#m7', 'Dmaj7', 'F#m7'],
    preferredTypes: ['maj7', 'min7', 'min9', 'dom7'],
    aiHint: 'Soft, warm, intimate RNB with gentle Maj7/m7 chords and soulful, simple melodies',
    
    preferredStructure: 'balladSlow',
    
    sections: {
      intro: {
        progressions: [
          ['Emaj7', 'Amaj9'],
          ['C#m7', 'F#m9'],
        ]
      },
      verse: {
        progressions: [
          ['Emaj7', 'G#m7', 'C#m7', 'Amaj9'],  // Warm RNB Ballad from JSON (I-iii-vi-IV)
          ['F#m9', 'Emaj7', 'Amaj9', 'B7'],
          ['C#m7', 'Amaj9', 'Emaj7', 'G#m7'],
        ]
      },
      preChorus: {
        progressions: [
          ['Amaj9', 'B7', 'C#m7', 'G#m7'],
          ['F#m9', 'G#m7', 'Amaj9', 'B7'],
        ]
      },
      chorus: {
        progressions: [
          ['Emaj7', 'C#m7', 'Amaj9', 'B7'],
          ['C#m7', 'Amaj9', 'Emaj7', 'B7'],
          ['Amaj9', 'Emaj7', 'C#m7', 'G#m7'],
        ]
      },
      bridge: {
        progressions: [
          ['F#m7', 'B7', 'Emaj7'],             // Neo-Soul Turnaround from JSON (ii-V-I)
          ['Dmaj7', 'C#m7', 'F#m9', 'Amaj9'],
        ]
      },
      breakdown: {
        progressions: [
          ['Emaj7', 'C#m7'],
          ['Amaj9', 'B7'],
        ]
      },
      drop: {
        progressions: [
          ['Emaj7', 'C#m7', 'Amaj9'],
        ]
      },
      outro: {
        progressions: [
          ['Emaj7', 'Amaj9', 'C#m7'],
          ['F#m9', 'Emaj7'],
        ]
      }
    },
    
    drumPattern: 'slowJam',
    bassPattern: 'rootFifth',
    
    melodic: {
      rhythm: 'gentle, laid-back phrasing',
      intervals: 'smooth stepwise motion with tasteful runs',
      scales: ['major', 'naturalMinor', 'dorian']
    }
  },

  darkRnb: {
    name: 'Dark R&B',
    description: 'Haunting, Atmospheric, Nocturnal',
    color: '#1e293b',
    tempo: { min: 65, max: 75 },
    swing: 0.06,
    
    style_tags: ['dark', 'haunting', 'atmospheric', 'nocturnal', 'moody'],
    chordBank: ['Am9', 'Fmaj7', 'Gmaj7', 'Em11', 'Dm9', 'Bbmaj9', 'Cm9', 'Ebmaj7'],
    preferredTypes: ['min9', 'min11', 'maj7'],
    aiHint: 'Moody verses, nocturnal vibes with i-bVI-bVII progressions',
    
    preferredStructure: 'darkMinimal',
    
    sections: {
      intro: {
        progressions: [
          ['Am9', 'Fmaj7'],
          ['Em11', 'Dm9'],
        ]
      },
      verse: {
        progressions: [
          ['Am9', 'Fmaj7', 'Gmaj7'],           // i-bVI-bVII Dark RNB from JSON
          ['Em11', 'Dm9', 'Am9', 'Fmaj7'],
          ['Dm9', 'Am9', 'Gmaj7', 'Fmaj7'],
        ]
      },
      preChorus: {
        progressions: [
          ['Fmaj7', 'Gmaj7', 'Am9', 'Em11'],
          ['Dm9', 'Em11', 'Am9', 'Fmaj7'],
        ]
      },
      chorus: {
        progressions: [
          ['Am9', 'Fmaj7', 'Gmaj7', 'Em11'],
          ['Em11', 'Am9', 'Fmaj7', 'Gmaj7'],
          ['Dm9', 'Am9', 'Fmaj7', 'Gmaj7'],
        ]
      },
      bridge: {
        progressions: [
          ['Cm9', 'Bbmaj9', 'Ebmaj7', 'Am9'],
          ['Dm9', 'Am9', 'Em11', 'Fmaj7'],
        ]
      },
      breakdown: {
        progressions: [
          ['Am9', 'Em11'],
          ['Fmaj7', 'Dm9'],
        ]
      },
      drop: {
        progressions: [
          ['Am9', 'Fmaj7', 'Gmaj7'],
        ]
      },
      outro: {
        progressions: [
          ['Am9', 'Fmaj7', 'Gmaj7'],
          ['Em11', 'Am9'],
        ]
      }
    },
    
    drumPattern: 'minimal',
    bassPattern: 'sustained',
    
    melodic: {
      rhythm: 'sparse, atmospheric',
      intervals: 'wide, haunting leaps',
      scales: ['naturalMinor', 'minorPentatonic', 'blues']
    }
  },

  neoSoul: {
    name: 'Neo Soul',
    description: "D'Angelo / Erykah Badu Style",
    color: '#15803d',
    tempo: { min: 80, max: 95 },
    swing: 0.22,
    
    style_tags: ['soulful', 'jazzy', 'groovy', 'organic', 'warm'],
    chordBank: ['Dm9', 'G13', 'Cmaj9', 'Am9', 'Fmaj9', 'Em7', 'Bbmaj7', 'A7#9'],
    preferredTypes: ['min9', 'dom9', 'maj9', '13'],
    aiHint: 'Neo-soul with ii-V-I turnarounds, jazzy extensions, behind the beat groove',
    
    preferredStructure: 'neoSoul',
    
    sections: {
      intro: {
        progressions: [
          ['Dm9', 'G13'],
          ['Fmaj9', 'Em7'],
        ]
      },
      verse: {
        progressions: [
          ['Dm9', 'G13', 'Cmaj9', 'Am9'],      // ii-V-I Neo-Soul from JSON
          ['Fmaj9', 'Em7', 'Am9', 'Dm9'],
          ['Am9', 'Dm9', 'G13', 'Cmaj9'],
        ]
      },
      preChorus: {
        progressions: [
          ['Fmaj9', 'G13', 'Am9', 'Em7'],
          ['Dm9', 'Em7', 'Fmaj9', 'G13'],
        ]
      },
      chorus: {
        progressions: [
          ['Cmaj9', 'Am9', 'Dm9', 'G13'],
          ['Fmaj9', 'Em7', 'Dm9', 'G13'],
          ['Am9', 'Fmaj9', 'Dm9', 'G13'],
        ]
      },
      bridge: {
        progressions: [
          ['Bbmaj7', 'A7#9', 'Dm9', 'G13'],
          ['Em7', 'Am9', 'Dm9', 'G13'],
        ]
      },
      breakdown: {
        progressions: [
          ['Dm9', 'Am9'],
          ['Fmaj9', 'G13'],
        ]
      },
      drop: {
        progressions: [
          ['Dm9', 'G13', 'Cmaj9'],
        ]
      },
      outro: {
        progressions: [
          ['Dm9', 'G13', 'Cmaj9'],
          ['Am9', 'Dm9', 'G13'],
        ]
      }
    },
    
    drumPattern: 'neoSoul',
    bassPattern: 'walking',
    
    melodic: {
      rhythm: 'behind the beat, groovy, loose',
      intervals: 'jazzy runs, chromatic passing tones',
      scales: ['dorian', 'melodicMinor', 'blues']
    }
  }
};

// Drum patterns
export const DRUM_PATTERNS = {
  trapSoul: {
    name: 'Trap Soul',
    kick: [0, 0.75, 2, 2.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
    openHat: [1.75, 3.75]
  },
  trapBounce: {
    name: 'Trap Bounce',
    kick: [0, 0.5, 2, 2.75, 3.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
    openHat: [0.75, 2.75]
  },
  slowJam: {
    name: 'Slow Jam',
    kick: [0, 2.5],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    openHat: [3.5]
  },
  neoSoul: {
    name: 'Neo Soul',
    kick: [0, 1.5, 2.75],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    openHat: [1.5, 3.5]
  },
  minimal: {
    name: 'Minimal',
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 1, 2, 3],
    openHat: []
  },
  halfTime: {
    name: 'Half Time',
    kick: [0, 3],
    snare: [2],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    openHat: [1.5]
  }
};

// Bass patterns
export const BASS_PATTERNS = {
  sustained: {
    name: 'Sustained',
    pattern: [{ beat: 0, duration: 3.5, interval: 0 }]
  },
  rootFifth: {
    name: 'Root-Fifth',
    pattern: [
      { beat: 0, duration: 1.5, interval: 0 },
      { beat: 2, duration: 1.5, interval: 7 }
    ]
  },
  walking: {
    name: 'Walking',
    pattern: [
      { beat: 0, duration: 0.9, interval: 0 },
      { beat: 1, duration: 0.9, interval: 3 },
      { beat: 2, duration: 0.9, interval: 5 },
      { beat: 3, duration: 0.9, interval: 7 }
    ]
  },
  octave: {
    name: 'Octave',
    pattern: [
      { beat: 0, duration: 0.7, interval: 0 },
      { beat: 1, duration: 0.7, interval: 12 },
      { beat: 2, duration: 0.7, interval: 0 },
      { beat: 3, duration: 0.7, interval: 12 }
    ]
  },
  syncopated: {
    name: 'Syncopated',
    pattern: [
      { beat: 0, duration: 1.2, interval: 0 },
      { beat: 1.5, duration: 0.5, interval: 0 },
      { beat: 2.5, duration: 1.2, interval: 7 }
    ]
  },
  trap: {
    name: 'Trap 808',
    pattern: [
      { beat: 0, duration: 1.8, interval: 0 },
      { beat: 2.5, duration: 0.3, interval: 0 },
      { beat: 3, duration: 0.8, interval: -5 }
    ]
  }
};

// Build chord from name
export const buildChord = (chordName, octave = 3) => {
  const match = chordName.match(/^([A-G]#?b?)(.*)/);
  if (!match) return null;
  
  let [, root, type] = match;
  
  // Handle flats
  if (root.includes('b')) {
    const idx = NOTES.indexOf(root.replace('b', ''));
    root = NOTES[(idx - 1 + 12) % 12];
  }
  
  // Map chord type names
  const typeMap = {
    'maj7': 'maj7', 'Maj7': 'maj7', 'M7': 'maj7',
    'maj9': 'maj9', 'Maj9': 'maj9', 'M9': 'maj9',
    'm7': 'min7', 'min7': 'min7', '-7': 'min7',
    'm9': 'min9', 'min9': 'min9', '-9': 'min9',
    'm11': 'min11', 'min11': 'min11',
    '7': 'dom7', 'dom7': 'dom7',
    '9': 'dom9', 'dom9': 'dom9',
    '7#9': '7#9',
    '13': '13',
    'sus2': 'sus2',
    'sus4': 'sus4',
    '7sus4': '7sus4',
    'add9': 'add9',
    'dim7': 'dim7',
    'm7b5': 'm7b5', 'ø7': 'm7b5',
    'maj7#11': 'maj7#11', 'M7#11': 'maj7#11',
  };
  
  const chordType = typeMap[type] || 'maj7';
  const chordDef = CHORD_TYPES[chordType] || CHORD_TYPES['maj7'];
  const rootMidi = NOTES.indexOf(root) + (octave + 1) * 12;
  
  const notes = chordDef.intervals.map(interval => rootMidi + interval);
  
  return {
    name: chordName,
    root,
    type: chordType,
    notes,
    bassNote: rootMidi - 12,
    color: chordDef.color,
    typeName: chordDef.name,
    mood: chordDef.mood
  };
};

// Transpose chord
export const transposeChord = (chord, semitones) => {
  if (!chord || semitones === 0) return chord;
  return {
    ...chord,
    notes: chord.notes.map(n => n + semitones),
    bassNote: chord.bassNote + semitones
  };
};

// Generate a full song arrangement for an artist
export const generateSongArrangement = (artistKey, transpose = 0) => {
  const artist = ARTISTS[artistKey];
  if (!artist) return null;
  
  const structure = SONG_STRUCTURES[artist.preferredStructure];
  const tempo = Math.floor(Math.random() * (artist.tempo.max - artist.tempo.min + 1)) + artist.tempo.min;
  
  const sections = structure.sections.map((sectionType, index) => {
    const sectionDef = SECTION_TYPES[sectionType];
    const artistSection = artist.sections[sectionType];
    
    // Pick a random progression for this section
    const progressions = artistSection?.progressions || [artist.chordBank.slice(0, 4)];
    const progression = progressions[Math.floor(Math.random() * progressions.length)];
    
    // Build chords
    const chords = progression.map(name => {
      const chord = buildChord(name);
      return transposeChord(chord, transpose);
    });
    
    return {
      type: sectionType,
      name: sectionDef.name,
      bars: sectionDef.bars,
      energy: sectionDef.energy,
      description: sectionDef.description,
      chords,
      progression
    };
  });
  
  // Calculate total duration
  const totalBars = sections.reduce((sum, s) => sum + s.bars, 0);
  const beatsPerBar = 4;
  const totalBeats = totalBars * beatsPerBar;
  const durationSeconds = (totalBeats / tempo) * 60;
  
  return {
    artist: artist.name,
    artistKey,
    structure: structure.name,
    tempo,
    swing: artist.swing,
    sections,
    totalBars,
    totalBeats,
    durationSeconds,
    durationFormatted: formatDuration(durationSeconds),
    drumPattern: DRUM_PATTERNS[artist.drumPattern] || DRUM_PATTERNS.trapSoul,
    bassPattern: BASS_PATTERNS[artist.bassPattern] || BASS_PATTERNS.rootFifth,
    style: artist.style_tags,
    aiHint: artist.aiHint,
    color: artist.color
  };
};

// Format duration as M:SS
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default { ARTISTS, SONG_STRUCTURES, DRUM_PATTERNS, BASS_PATTERNS, buildChord, generateSongArrangement };
