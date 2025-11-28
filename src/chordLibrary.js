/**
 * R&B Chord Library
 * Real voicings based on artist styles
 */

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Note name to MIDI (C4 = 60)
export const noteNameToMidi = (name) => {
  const match = name.match(/^([A-G]#?)(-?\d)$/);
  if (!match) return 60;
  const [, note, octave] = match;
  const noteIdx = NOTES.indexOf(note);
  if (noteIdx === -1) return 60;
  return (parseInt(octave) + 1) * 12 + noteIdx;
};

// Chord definitions with MIDI intervals from root
export const CHORD_TYPES = {
  'maj7': { intervals: [0, 4, 7, 11], name: 'Major 7', color: '#6366f1' },
  'maj9': { intervals: [0, 4, 7, 11, 14], name: 'Major 9', color: '#8b5cf6' },
  'min7': { intervals: [0, 3, 7, 10], name: 'Minor 7', color: '#a855f7' },
  'min9': { intervals: [0, 3, 7, 10, 14], name: 'Minor 9', color: '#d946ef' },
  'min11': { intervals: [0, 3, 7, 10, 14, 17], name: 'Minor 11', color: '#ec4899' },
  'dom7': { intervals: [0, 4, 7, 10], name: 'Dominant 7', color: '#f43f5e' },
  'dom9': { intervals: [0, 4, 7, 10, 14], name: 'Dominant 9', color: '#f97316' },
  '7#9': { intervals: [0, 4, 7, 10, 15], name: '7#9', color: '#ef4444' },
  '13': { intervals: [0, 4, 7, 10, 14, 21], name: '13th', color: '#eab308' },
  'sus2': { intervals: [0, 2, 7], name: 'Sus2', color: '#22c55e' },
  'sus4': { intervals: [0, 5, 7], name: 'Sus4', color: '#14b8a6' },
  'add9': { intervals: [0, 4, 7, 14], name: 'Add9', color: '#06b6d4' },
  'dim7': { intervals: [0, 3, 6, 9], name: 'Dim7', color: '#64748b' },
  'm7b5': { intervals: [0, 3, 6, 10], name: 'Half Dim', color: '#78716c' },
  '6': { intervals: [0, 4, 7, 9], name: 'Major 6', color: '#0ea5e9' },
  'm6': { intervals: [0, 3, 7, 9], name: 'Minor 6', color: '#0284c7' },
};

// Parse chord name to get root and type
export const parseChordName = (name) => {
  // Match patterns like "Cmaj7", "F#min9", "Bbdom7", "Gsus2"
  const patterns = [
    /^([A-G]#?b?)(maj9|maj7|min11|min9|min7|dom9|dom7|7#9|13|sus2|sus4|add9|dim7|m7b5|m6|6)$/,
    /^([A-G]#?b?)(m9|m7|m11)$/, // Short minor forms
    /^([A-G]#?b?)(7|9)$/, // Short dominant forms
  ];
  
  for (const pattern of patterns) {
    const match = name.match(pattern);
    if (match) {
      let [, root, type] = match;
      
      // Normalize root (handle flats)
      if (root.includes('b')) {
        const idx = NOTES.indexOf(root.replace('b', ''));
        root = NOTES[(idx - 1 + 12) % 12];
      }
      
      // Normalize type
      const typeMap = {
        'm7': 'min7', 'm9': 'min9', 'm11': 'min11',
        '7': 'dom7', '9': 'dom9'
      };
      type = typeMap[type] || type;
      
      return { root, type };
    }
  }
  
  // Default to major 7 if parsing fails
  return { root: 'C', type: 'maj7' };
};

// Build chord MIDI notes from name
export const buildChord = (chordName, octave = 3) => {
  const { root, type } = parseChordName(chordName);
  const rootMidi = NOTES.indexOf(root) + (octave + 1) * 12;
  const chordType = CHORD_TYPES[type] || CHORD_TYPES['maj7'];
  
  const notes = chordType.intervals.map(interval => rootMidi + interval);
  
  return {
    name: chordName,
    root,
    type,
    notes,
    bassNote: rootMidi - 12, // Bass plays root an octave lower
    color: chordType.color,
    typeName: chordType.name
  };
};

// Transpose chord to new key
export const transposeChord = (chord, semitones) => {
  if (semitones === 0) return chord;
  
  return {
    ...chord,
    notes: chord.notes.map(n => n + semitones),
    bassNote: chord.bassNote + semitones
  };
};

// Artist progressions from PDFs
export const ARTIST_PROGRESSIONS = {
  sza: {
    name: 'SZA',
    description: 'Ethereal, Floating, Dreamy',
    color: '#ea580c',
    progressions: [
      { name: 'SZA Spacey', chords: ['Fmaj9', 'Gsus2', 'Em7'], desc: 'Classic floaty wash' },
      { name: 'SZA Soft', chords: ['Dm9', 'Am7', 'Cadd9'], desc: 'Soft & emotional' },
      { name: 'SZA CTRL', chords: ['Am9', 'Fmaj9', 'Dm9', 'Em7'], desc: 'CTRL album vibes' },
      { name: 'SZA Alt Soul', chords: ['Em7', 'Cmaj7', 'Dadd9', 'Bm7'], desc: 'Alternative soul' },
      { name: 'SZA Dreamy', chords: ['Fmaj7', 'Gsus2', 'Am9', 'Em7'], desc: 'Extended dreamy' },
    ]
  },
  pnd: {
    name: 'PartyNextDoor',
    description: 'Dark, Moody, Toronto',
    color: '#7c3aed',
    progressions: [
      { name: 'PND Dark', chords: ['Cm9', 'Abmaj7', 'Bb7'], desc: 'Classic dark vibes' },
      { name: 'PND Caribbean', chords: ['Gm7', 'Ebmaj7', 'F7#9'], desc: 'Caribbean influence' },
      { name: 'PND Jazzy', chords: ['Dm7b5', 'G7', 'Cm9'], desc: 'Jazz-influenced dark' },
      { name: 'PND Late Night', chords: ['Cm9', 'Abmaj9', 'Bb9', 'Gm7'], desc: 'Toronto nights' },
      { name: 'PND Moody', chords: ['Ebmaj7', 'Cm9', 'Fm7', 'Bb7'], desc: 'Moody atmosphere' },
    ]
  },
  summerWalker: {
    name: 'Summer Walker',
    description: 'Emotional, Warm, Intimate',
    color: '#be185d',
    progressions: [
      { name: 'Summer Classic', chords: ['Am7', 'Dm7', 'Em7'], desc: 'Soft classic R&B' },
      { name: 'Summer Warm', chords: ['Bbmaj7', 'Fmaj7', 'Gm7'], desc: 'Warm progression' },
      { name: 'Summer Over It', chords: ['Am7', 'Dm7', 'Fmaj7', 'Em7'], desc: 'Over It vibes' },
      { name: 'Summer Soulful', chords: ['Dm9', 'Am7', 'Em9', 'Fmaj7'], desc: 'Soulful warmth' },
      { name: 'Summer Intimate', chords: ['Fm9', 'Bbmaj7', 'Gm7', 'Cm7'], desc: 'Late night' },
    ]
  },
  bryson: {
    name: 'Bryson Tiller',
    description: 'Trap Soul, Dark + Smooth',
    color: '#dc2626',
    progressions: [
      { name: 'Bryson Trap Soul', chords: ['Cm7', 'Abmaj7', 'Bb7'], desc: 'Classic trap soul' },
      { name: 'Bryson Smooth', chords: ['Fm7', 'Dbmaj7', 'Ebadd9'], desc: 'Smooth and dark' },
      { name: 'Bryson Dont', chords: ['Cm7', 'Abmaj7', 'Bb7', 'Gm7'], desc: "Don't style" },
      { name: 'Bryson Exchange', chords: ['Fm7', 'Dbmaj7', 'Ebmaj7', 'Cm9'], desc: 'Exchange vibes' },
      { name: 'Bryson Melodic', chords: ['Gm9', 'Ebmaj7', 'Dm7', 'Cm9'], desc: 'Melodic trap' },
    ]
  },
  darkRnb: {
    name: 'Dark R&B',
    description: 'Haunting, Atmospheric',
    color: '#1e293b',
    progressions: [
      { name: 'Dark Haunting', chords: ['Em9', 'Cmaj7', 'Dadd9', 'Bm7'], desc: 'Haunting vibes' },
      { name: 'Dark Weeknd', chords: ['Am9', 'Fmaj7', 'Dm9', 'Em7'], desc: 'Weeknd style' },
      { name: 'Dark Ambient', chords: ['Bm9', 'Gmaj7', 'Dmaj7', 'Am9'], desc: 'Ambient dark' },
      { name: 'Dark Minor', chords: ['Dm9', 'Bbmaj7', 'Gm9', 'Am7'], desc: 'Deep minor' },
      { name: 'Dark Ethereal', chords: ['Em11', 'Cmaj9', 'Am9', 'Bm7'], desc: 'Ethereal darkness' },
    ]
  },
  neoSoul: {
    name: 'Neo Soul',
    description: "D'Angelo, Erykah Badu",
    color: '#15803d',
    progressions: [
      { name: 'Neo Soul Groove', chords: ['Dm9', 'G13', 'Cmaj9', 'Am9'], desc: 'Classic neo soul' },
      { name: 'Erykah Badu', chords: ['Fmaj9', 'Em7', 'Am9', 'Dm7'], desc: 'Baduizm style' },
      { name: "D'Angelo", chords: ['Gm9', 'C13', 'Fmaj9', 'Bbmaj7'], desc: 'Voodoo vibes' },
      { name: 'Maxwell', chords: ['Ebmaj9', 'Cm9', 'Fm9', 'Bb13'], desc: 'Urban Suite' },
      { name: 'Jill Scott', chords: ['Am9', 'Dm9', 'Gmaj9', 'Cmaj9'], desc: 'Jill Scott feel' },
    ]
  },
  oldSchool: {
    name: 'Old School R&B',
    description: '90s Classic Soul',
    color: '#0891b2',
    progressions: [
      { name: 'ii-V-I', chords: ['Dm7', 'G7', 'Cmaj7'], desc: 'Jazz standard R&B' },
      { name: 'Jodeci', chords: ['Cm9', 'Fm7', 'Abmaj7', 'G7'], desc: 'Jodeci ballad' },
      { name: 'Boyz II Men', chords: ['Bbmaj7', 'Gm7', 'Cm7', 'F7'], desc: 'Classic ballad' },
      { name: '90s Slow Jam', chords: ['Ebmaj7', 'Cm7', 'Fm7', 'Bb7'], desc: 'Slow jam classic' },
      { name: 'R Kelly Era', chords: ['Fmaj7', 'Dm7', 'Gm7', 'C7'], desc: '90s R&B' },
    ]
  },
  modern: {
    name: 'Modern R&B',
    description: 'Frank Ocean, Daniel Caesar',
    color: '#6366f1',
    progressions: [
      { name: 'Frank Ocean', chords: ['Cmaj9', 'Am9', 'Fmaj9', 'Gsus2'], desc: 'Blonde vibes' },
      { name: 'Daniel Caesar', chords: ['Gmaj9', 'Em9', 'Cmaj9', 'Dadd9'], desc: 'Get You style' },
      { name: 'Giveon', chords: ['Dm9', 'Am9', 'Fmaj7', 'G7'], desc: 'Deep baritone' },
      { name: 'H.E.R.', chords: ['Bbmaj9', 'Gm9', 'Ebmaj7', 'F9'], desc: 'Focus R&B' },
      { name: 'Brent Faiyaz', chords: ['Am9', 'Em7', 'Fmaj9', 'Dm9'], desc: 'Wasteland' },
    ]
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
  bounce: {
    name: 'Bounce',
    kick: [0, 0.5, 2, 2.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
    openHat: [0.75, 2.75]
  },
  minimal: {
    name: 'Minimal',
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 1, 2, 3],
    openHat: []
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
    name: 'Octave Bounce',
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
  }
};

// Get all progressions as flat array
export const getAllProgressions = () => {
  const all = [];
  Object.entries(ARTIST_PROGRESSIONS).forEach(([key, artist]) => {
    artist.progressions.forEach(prog => {
      all.push({
        ...prog,
        artistKey: key,
        artistName: artist.name,
        artistColor: artist.color
      });
    });
  });
  return all;
};

export default { NOTES, CHORD_TYPES, ARTIST_PROGRESSIONS, DRUM_PATTERNS, BASS_PATTERNS };
