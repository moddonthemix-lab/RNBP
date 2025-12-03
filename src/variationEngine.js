/**
 * Variation Engine - Makes Every Beat Unique
 * Multi-Platinum Quality Randomization System
 */

/**
 * Random value between min and max
 */
const rand = (min, max) => Math.random() * (max - min) + min;

/**
 * Random choice from array
 */
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Arpeggiator Patterns - Different for each generation
 */
export const ARP_PATTERNS = {
  up: {
    name: 'Up',
    generate: (notes) => notes.sort((a, b) => a - b)
  },
  down: {
    name: 'Down',
    generate: (notes) => notes.sort((a, b) => b - a)
  },
  upDown: {
    name: 'Up-Down',
    generate: (notes) => {
      const sorted = notes.sort((a, b) => a - b);
      return [...sorted, ...sorted.slice(1, -1).reverse()];
    }
  },
  downUp: {
    name: 'Down-Up',
    generate: (notes) => {
      const sorted = notes.sort((a, b) => b - a);
      return [...sorted, ...sorted.slice(1, -1).reverse()];
    }
  },
  random: {
    name: 'Random',
    generate: (notes) => notes.sort(() => Math.random() - 0.5)
  },
  octaves: {
    name: 'Octaves',
    generate: (notes) => {
      const result = [];
      notes.forEach(note => {
        result.push(note, note + 12);
      });
      return result;
    }
  },
  skipUp: {
    name: 'Skip Up (3rds)',
    generate: (notes) => {
      const sorted = notes.sort((a, b) => a - b);
      const result = [];
      for (let i = 0; i < sorted.length; i += 2) {
        result.push(sorted[i]);
        if (sorted[i + 1]) result.push(sorted[i + 1]);
      }
      return result;
    }
  },
  rootFocus: {
    name: 'Root Focus',
    generate: (notes) => [notes[0], ...notes.slice(1), notes[0]]
  }
};

/**
 * Generate unique piano variations - SMOOTH & CLEAN
 */
export const generatePianoVariation = () => {
  return {
    harmonicity: rand(2.8, 3.5),        // Tightened range for smoother sound
    modulationIndex: rand(8, 12),       // Reduced from 14
    attackTime: rand(0.01, 0.03),       // Slower attack for smoother
    decayTime: rand(0.4, 0.8),          // Longer decay
    sustain: rand(0.6, 0.8),            // Higher sustain
    release: rand(1.5, 2.5),            // Longer release
    tremoloRate: rand(3.5, 5),          // Slower tremolo
    tremoloDepth: rand(0.15, 0.3),      // Less tremolo
    chorusDepth: rand(0.25, 0.4),       // Reduced chorus
    volume: rand(-12, -8),              // Much quieter!
    brightness: rand(0.7, 0.95)         // Darker, less harsh
  };
};

/**
 * Generate unique pad variations - SMOOTH & LUSH
 */
export const generatePadVariation = () => {
  const oscTypes = ['sawtooth', 'triangle', 'sine']; // Removed square (too harsh)
  return {
    oscillatorType: choice(oscTypes),
    attack: rand(0.6, 1.5),           // Slower attack
    decay: rand(0.3, 0.6),
    sustain: rand(0.75, 0.9),         // Higher sustain
    release: rand(2.5, 4.5),          // Longer release
    filterFreq: rand(800, 1500),      // Higher, less muddy
    filterQ: rand(0.5, 2),            // Lower Q for smoother
    chorusRate: rand(0.3, 1.5),       // Slower chorus
    chorusDepth: rand(0.3, 0.6),
    volume: rand(-20, -16),           // Much quieter!
    detune: rand(-5, 5)               // Less detuning
  };
};

/**
 * Generate unique synth lead variations
 */
export const generateLeadVariation = () => {
  const oscTypes = ['sine', 'triangle', 'sawtooth', 'square'];
  return {
    oscillatorType: choice(oscTypes),
    attack: rand(0.03, 0.15),
    decay: rand(0.1, 0.4),
    sustain: rand(0.5, 0.8),
    release: rand(0.8, 1.5),
    vibratoRate: rand(4, 7),
    vibratoDepth: rand(0.05, 0.2),
    filterCutoff: rand(1000, 4000),
    filterRes: rand(2, 8),
    volume: rand(-10, -6)
  };
};

/**
 * Generate unique bass variations - SMOOTH & DEEP
 */
export const generateBassVariation = () => {
  const oscTypes = ['sawtooth', 'triangle']; // Removed square (too harsh)
  return {
    oscillatorType: choice(oscTypes),
    attack: rand(0.02, 0.05),         // Slower attack
    decay: rand(0.2, 0.35),
    sustain: rand(0.75, 0.9),         // Higher sustain
    release: rand(0.4, 0.8),
    filterFreq: rand(200, 350),       // Lower cutoff
    filterQ: rand(2, 4),              // Lower Q
    filterAttack: rand(0.02, 0.04),
    filterDecay: rand(0.2, 0.3),
    filterSustain: rand(0.5, 0.7),
    volume: rand(-10, -6),            // Quieter
    subMix: rand(0.4, 0.7)
  };
};

/**
 * Generate unique guitar/pluck variations
 */
export const generatePluckVariation = () => {
  return {
    attackNoise: rand(0.5, 2.0),
    dampening: rand(2000, 5000),
    resonance: rand(0.92, 0.98),
    release: rand(1.0, 2.5),
    delayTime: choice(['8n', '16n', '8n.', '16n.', '4n']),
    delayFeedback: rand(0.1, 0.3),
    delayMix: rand(0.2, 0.5),
    volume: rand(-12, -6),
    tone: rand(0.3, 0.8)
  };
};

/**
 * Generate unique strings variations
 */
export const generateStringsVariation = () => {
  return {
    attack: rand(0.8, 1.5),
    decay: rand(0.3, 0.6),
    sustain: rand(0.7, 0.85),
    release: rand(1.8, 3.0),
    spread: rand(20, 40),
    voiceCount: Math.floor(rand(2, 4)),
    filterFreq: rand(1500, 3000),
    vibratoRate: rand(3, 6),
    vibratoDepth: rand(0.02, 0.08),
    volume: rand(-18, -14)
  };
};

/**
 * Generate drum variations - CLEANER & PUNCHIER
 */
export const generateDrumVariation = () => {
  return {
    kick: {
      pitchDecay: rand(0.05, 0.08),
      octaves: rand(6, 8),
      attack: rand(0.001, 0.003),
      decay: rand(0.4, 0.7),
      volume: rand(-6, -2)            // Quieter kick
    },
    snare: {
      noiseType: choice(['white', 'pink']), // Removed brown (too dull)
      attack: rand(0.001, 0.003),
      decay: rand(0.1, 0.18),
      filterFreq: rand(3000, 5000),    // Lower for less harsh
      volume: rand(-16, -12),          // Quieter snare
      reverbMix: rand(0.15, 0.3)       // Less reverb
    },
    hihat: {
      frequency: rand(280, 350),       // Lower frequency
      harmonicity: rand(4.8, 5.3),
      modulationIndex: rand(30, 35),
      attack: rand(0.001, 0.002),
      decay: rand(0.03, 0.06),
      volume: rand(-26, -22)           // Much quieter hihat
    },
    openHat: {
      frequency: rand(280, 350),
      harmonicity: rand(4.8, 5.3),
      modulationIndex: rand(30, 35),
      attack: rand(0.001, 0.002),
      decay: rand(0.2, 0.35),
      volume: rand(-28, -24),          // Much quieter
      reverbMix: rand(0.2, 0.4)
    }
  };
};

/**
 * Rhythm Variations - Different timing for each instrument
 */
export const generateRhythmVariation = () => {
  return {
    piano: {
      pattern: choice([
        [0, 2], // On 1 and 3
        [0, 1.5, 2, 3.5], // Offbeat funk
        [0, 0.5, 2, 2.5], // 16th groove
        [0, 2, 3], // Syncopated
        [0, 1, 2, 3], // Every beat
      ]),
      swingAmount: rand(0, 0.15)
    },
    melody: {
      pattern: choice([
        [0, 0.5, 1.5, 2.5], // 16th pattern
        [0, 1, 2, 3], // Quarter notes
        [0, 0.75, 1.5, 2.25], // Triplet feel
        [0, 0.5, 1, 2, 2.5, 3], // Busy
        [0, 2], // Minimal
      ]),
      noteLength: rand(0.2, 0.8)
    },
    guitar: {
      arpPattern: choice(Object.keys(ARP_PATTERNS)),
      speed: rand(0.08, 0.2), // Delay between notes
      swingAmount: rand(0, 0.2)
    }
  };
};

/**
 * Chord Voicing Variations
 */
export const generateChordVoicing = (chordNotes, variation = 'standard') => {
  const notes = [...chordNotes];

  switch (variation) {
    case 'spread':
      // Spread voicing - wider intervals
      return notes.map((note, i) => note + (i * 5));

    case 'drop2':
      // Drop 2 voicing - drop second note from top by octave
      if (notes.length >= 4) {
        const sorted = notes.sort((a, b) => b - a);
        sorted[1] -= 12;
        return sorted.sort((a, b) => a - b);
      }
      return notes;

    case 'rootless':
      // Rootless voicing - remove root for jazz sound
      return notes.slice(1);

    case 'shellVoicing':
      // Shell voicing - root, 3rd, 7th only
      if (notes.length >= 4) {
        return [notes[0], notes[1], notes[3]];
      }
      return notes;

    case 'closePosition':
      // Close position - all within an octave
      const root = notes[0];
      return notes.map(note => {
        while (note - root > 12) note -= 12;
        return note;
      });

    case 'firstInversion':
      // First inversion - root on top
      const firstInv = [...notes];
      firstInv.push(firstInv.shift() + 12);
      return firstInv;

    case 'secondInversion':
      // Second inversion
      const secondInv = [...notes];
      secondInv.push(secondInv.shift() + 12);
      secondInv.push(secondInv.shift() + 12);
      return secondInv;

    default:
      // Standard voicing
      return notes;
  }
};

/**
 * Generate complete variation set for a track
 */
export const generateTrackVariation = () => {
  const voicingTypes = ['standard', 'spread', 'drop2', 'firstInversion', 'secondInversion', 'closePosition'];

  return {
    id: Date.now() + Math.random(),
    piano: generatePianoVariation(),
    pad: generatePadVariation(),
    lead: generateLeadVariation(),
    bass: generateBassVariation(),
    pluck: generatePluckVariation(),
    strings: generateStringsVariation(),
    drums: generateDrumVariation(),
    rhythm: generateRhythmVariation(),
    chordVoicing: choice(voicingTypes),
    masterStereoWidth: rand(0.6, 1.0),
    masterWarmth: rand(0.3, 0.7), // Saturation amount
    swingGlobal: rand(0, 0.2),
    reverbDecay: rand(2.0, 4.0),
    reverbWet: rand(0.15, 0.35)
  };
};

/**
 * Effects variations
 */
export const generateEffectsChain = () => {
  return {
    stereoWidth: rand(0.5, 1.0),
    saturation: rand(0.2, 0.8),
    bitCrush: Math.random() > 0.7 ? rand(4, 8) : null, // Sometimes add lo-fi
    vinylNoise: Math.random() > 0.8 ? rand(0.05, 0.15) : null, // Rare vintage vibe
    compression: {
      threshold: rand(-25, -15),
      ratio: rand(3, 6),
      attack: rand(0.003, 0.01),
      release: rand(0.1, 0.3)
    }
  };
};

export default {
  ARP_PATTERNS,
  generatePianoVariation,
  generatePadVariation,
  generateLeadVariation,
  generateBassVariation,
  generatePluckVariation,
  generateStringsVariation,
  generateDrumVariation,
  generateRhythmVariation,
  generateChordVoicing,
  generateTrackVariation,
  generateEffectsChain
};
