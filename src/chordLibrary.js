// R&B Chord Library - Based on Artist Chordbook PDFs
// Real voicings with Left Hand (LH) and Right Hand (RH) splits

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Note name to MIDI number (C4 = 60)
export const noteToMidi = (note) => {
  const match = note.match(/([A-G]#?)(\d)/);
  if (!match) return 60;
  const [, noteName, octave] = match;
  const noteIndex = NOTES.indexOf(noteName);
  return noteIndex + (parseInt(octave) + 1) * 12;
};

// Real Piano Voicings - LH (bass) and RH (chord) separate
// Based on the PDF chord shapes
export const CHORD_VOICINGS = {
  // Major 7 Shapes
  'Cmaj7': { lh: ['C2', 'G2'], rh: ['E4', 'B4'], color: '#6366f1' },
  'Dbmaj7': { lh: ['Db2', 'Ab2'], rh: ['F4', 'C5'], color: '#6366f1' },
  'Dmaj7': { lh: ['D2', 'A2'], rh: ['F#4', 'C#5'], color: '#6366f1' },
  'Ebmaj7': { lh: ['Eb2', 'Bb2'], rh: ['G4', 'D5'], color: '#6366f1' },
  'Emaj7': { lh: ['E2', 'B2'], rh: ['G#4', 'D#5'], color: '#6366f1' },
  'Fmaj7': { lh: ['F2', 'C3'], rh: ['A4', 'E5'], color: '#6366f1' },
  'Gbmaj7': { lh: ['Gb2', 'Db3'], rh: ['Bb4', 'F5'], color: '#6366f1' },
  'Gmaj7': { lh: ['G2', 'D3'], rh: ['B4', 'F#5'], color: '#6366f1' },
  'Abmaj7': { lh: ['Ab2', 'Eb3'], rh: ['C5', 'G5'], color: '#6366f1' },
  'Amaj7': { lh: ['A2', 'E3'], rh: ['C#5', 'G#5'], color: '#6366f1' },
  'Bbmaj7': { lh: ['Bb2', 'F3'], rh: ['D5', 'A5'], color: '#6366f1' },
  'Bmaj7': { lh: ['B2', 'F#3'], rh: ['D#5', 'A#5'], color: '#6366f1' },

  // Major 9 Shapes (Dreamy & Smooth - SZA)
  'Cmaj9': { lh: ['C2', 'G2'], rh: ['E4', 'B4', 'D5'], color: '#8b5cf6' },
  'Dbmaj9': { lh: ['Db2', 'Ab2'], rh: ['F4', 'C5', 'Eb5'], color: '#8b5cf6' },
  'Dmaj9': { lh: ['D2', 'A2'], rh: ['F#4', 'C#5', 'E5'], color: '#8b5cf6' },
  'Ebmaj9': { lh: ['Eb2', 'Bb2'], rh: ['G4', 'D5', 'F5'], color: '#8b5cf6' },
  'Fmaj9': { lh: ['F2', 'C3'], rh: ['A4', 'E5', 'G5'], color: '#8b5cf6' },
  'Gmaj9': { lh: ['G2', 'D3'], rh: ['B4', 'F#5', 'A5'], color: '#8b5cf6' },
  'Abmaj9': { lh: ['Ab2', 'Eb3'], rh: ['C5', 'G5', 'Bb5'], color: '#8b5cf6' },
  'Amaj9': { lh: ['A2', 'E3'], rh: ['C#5', 'G#5', 'B5'], color: '#8b5cf6' },
  'Bbmaj9': { lh: ['Bb2', 'F3'], rh: ['D5', 'A5', 'C6'], color: '#8b5cf6' },

  // Minor 7 Shapes (SZA, Summer Walker, Bryson)
  'Cm7': { lh: ['C2', 'G2'], rh: ['Eb4', 'Bb4'], color: '#a855f7' },
  'Dbm7': { lh: ['Db2', 'Ab2'], rh: ['E4', 'B4'], color: '#a855f7' },
  'Dm7': { lh: ['D2', 'A2'], rh: ['F4', 'C5'], color: '#a855f7' },
  'Ebm7': { lh: ['Eb2', 'Bb2'], rh: ['Gb4', 'Db5'], color: '#a855f7' },
  'Em7': { lh: ['E2', 'B2'], rh: ['G4', 'D5'], color: '#a855f7' },
  'Fm7': { lh: ['F2', 'C3'], rh: ['Ab4', 'Eb5'], color: '#a855f7' },
  'F#m7': { lh: ['F#2', 'C#3'], rh: ['A4', 'E5'], color: '#a855f7' },
  'Gm7': { lh: ['G2', 'D3'], rh: ['Bb4', 'F5'], color: '#a855f7' },
  'Abm7': { lh: ['Ab2', 'Eb3'], rh: ['B4', 'Gb5'], color: '#a855f7' },
  'Am7': { lh: ['A2', 'E3'], rh: ['C5', 'G5'], color: '#a855f7' },
  'Bbm7': { lh: ['Bb2', 'F3'], rh: ['Db5', 'Ab5'], color: '#a855f7' },
  'Bm7': { lh: ['B2', 'F#3'], rh: ['D5', 'A5'], color: '#a855f7' },

  // Minor 9 Shapes (Modern R&B)
  'Cm9': { lh: ['C2', 'G2'], rh: ['Eb4', 'Bb4', 'D5'], color: '#d946ef' },
  'Dm9': { lh: ['D2', 'A2'], rh: ['F4', 'C5', 'E5'], color: '#d946ef' },
  'Em9': { lh: ['E2', 'B2'], rh: ['G4', 'D5', 'F#5'], color: '#d946ef' },
  'Fm9': { lh: ['F2', 'C3'], rh: ['Ab4', 'Eb5', 'G5'], color: '#d946ef' },
  'F#m9': { lh: ['F#2', 'C#3'], rh: ['A4', 'E5', 'G#5'], color: '#d946ef' },
  'Gm9': { lh: ['G2', 'D3'], rh: ['Bb4', 'F5', 'A5'], color: '#d946ef' },
  'Am9': { lh: ['A2', 'E3'], rh: ['C5', 'G5', 'B5'], color: '#d946ef' },
  'Bm9': { lh: ['B2', 'F#3'], rh: ['D5', 'A5', 'C#6'], color: '#d946ef' },

  // Minor 11 Shapes
  'Cm11': { lh: ['C2', 'G2'], rh: ['Eb4', 'Bb4', 'D5', 'F5'], color: '#ec4899' },
  'Dm11': { lh: ['D2', 'A2'], rh: ['F4', 'C5', 'E5', 'G5'], color: '#ec4899' },
  'Em11': { lh: ['E2', 'B2'], rh: ['G4', 'D5', 'F#5', 'A5'], color: '#ec4899' },
  'Am11': { lh: ['A2', 'E3'], rh: ['C5', 'G5', 'B5', 'D6'], color: '#ec4899' },
  'Bm11': { lh: ['B2', 'F#3'], rh: ['D5', 'A5', 'C#6', 'E6'], color: '#ec4899' },
  'F#m11': { lh: ['F#2', 'C#3'], rh: ['A4', 'E5', 'G#5', 'B5'], color: '#ec4899' },

  // Dominant 7 / 9 / 13 (PND, Bryson Tiller)
  'C7': { lh: ['C2', 'G2'], rh: ['E4', 'Bb4'], color: '#f43f5e' },
  'D7': { lh: ['D2', 'A2'], rh: ['F#4', 'C5'], color: '#f43f5e' },
  'E7': { lh: ['E2', 'B2'], rh: ['G#4', 'D5'], color: '#f43f5e' },
  'F7': { lh: ['F2', 'C3'], rh: ['A4', 'Eb5'], color: '#f43f5e' },
  'G7': { lh: ['G2', 'D3'], rh: ['B4', 'F5'], color: '#f43f5e' },
  'A7': { lh: ['A2', 'E3'], rh: ['C#5', 'G5'], color: '#f43f5e' },
  'Bb7': { lh: ['Bb2', 'F3'], rh: ['D5', 'Ab5'], color: '#f43f5e' },
  'B7': { lh: ['B2', 'F#3'], rh: ['D#5', 'A5'], color: '#f43f5e' },
  'Ab7': { lh: ['Ab2', 'Eb3'], rh: ['C5', 'Gb5'], color: '#f43f5e' },
  'Db7': { lh: ['Db2', 'Ab2'], rh: ['F4', 'B4'], color: '#f43f5e' },
  'Eb7': { lh: ['Eb2', 'Bb2'], rh: ['G4', 'Db5'], color: '#f43f5e' },
  'Gb7': { lh: ['Gb2', 'Db3'], rh: ['Bb4', 'E5'], color: '#f43f5e' },

  // Dominant 9
  'C9': { lh: ['C2', 'G2'], rh: ['E4', 'Bb4', 'D5'], color: '#f97316' },
  'D9': { lh: ['D2', 'A2'], rh: ['F#4', 'C5', 'E5'], color: '#f97316' },
  'F9': { lh: ['F2', 'C3'], rh: ['A4', 'Eb5', 'G5'], color: '#f97316' },
  'G9': { lh: ['G2', 'D3'], rh: ['B4', 'F5', 'A5'], color: '#f97316' },
  'Bb9': { lh: ['Bb2', 'F3'], rh: ['D5', 'Ab5', 'C6'], color: '#f97316' },

  // Dominant 13
  'C13': { lh: ['C2', 'G2'], rh: ['Bb4', 'D5', 'A5'], color: '#eab308' },
  'G13': { lh: ['G2', 'D3'], rh: ['F5', 'A5', 'E6'], color: '#eab308' },
  'F13': { lh: ['F2', 'C3'], rh: ['Eb5', 'G5', 'D6'], color: '#eab308' },

  // Altered Dominants (Dark R&B)
  'C7#9': { lh: ['C2', 'G2'], rh: ['E4', 'Bb4', 'D#5'], color: '#ef4444' },
  'G7#9': { lh: ['G2', 'D3'], rh: ['B4', 'F5', 'A#5'], color: '#ef4444' },
  'F7#9': { lh: ['F2', 'C3'], rh: ['A4', 'Eb5', 'G#5'], color: '#ef4444' },
  'B7#9': { lh: ['B2', 'F#3'], rh: ['D#5', 'A5', 'C##5'], color: '#ef4444' },

  // Suspended Chords (SZA / Summer Walker)
  'Csus2': { lh: ['C2', 'G2'], rh: ['D4', 'G4'], color: '#22c55e' },
  'Dsus2': { lh: ['D2', 'A2'], rh: ['E4', 'A4'], color: '#22c55e' },
  'Esus2': { lh: ['E2', 'B2'], rh: ['F#4', 'B4'], color: '#22c55e' },
  'Fsus2': { lh: ['F2', 'C3'], rh: ['G4', 'C5'], color: '#22c55e' },
  'Gsus2': { lh: ['G2', 'D3'], rh: ['A4', 'D5'], color: '#22c55e' },
  'Asus2': { lh: ['A2', 'E3'], rh: ['B4', 'E5'], color: '#22c55e' },

  'Csus4': { lh: ['C2', 'G2'], rh: ['F4', 'G4'], color: '#14b8a6' },
  'Dsus4': { lh: ['D2', 'A2'], rh: ['G4', 'A4'], color: '#14b8a6' },
  'Esus4': { lh: ['E2', 'B2'], rh: ['A4', 'B4'], color: '#14b8a6' },
  'Gsus4': { lh: ['G2', 'D3'], rh: ['C5', 'D5'], color: '#14b8a6' },
  'Asus4': { lh: ['A2', 'E3'], rh: ['D5', 'E5'], color: '#14b8a6' },

  // Add9 Chords (Neo-Soul)
  'Cadd9': { lh: ['C2', 'G2'], rh: ['E4', 'G4', 'D5'], color: '#06b6d4' },
  'Dadd9': { lh: ['D2', 'A2'], rh: ['F#4', 'A4', 'E5'], color: '#06b6d4' },
  'Eadd9': { lh: ['E2', 'B2'], rh: ['G#4', 'B4', 'F#5'], color: '#06b6d4' },
  'Fadd9': { lh: ['F2', 'C3'], rh: ['A4', 'C5', 'G5'], color: '#06b6d4' },
  'Gadd9': { lh: ['G2', 'D3'], rh: ['B4', 'D5', 'A5'], color: '#06b6d4' },
  'Aadd9': { lh: ['A2', 'E3'], rh: ['C#5', 'E5', 'B5'], color: '#06b6d4' },
  'Bbadd9': { lh: ['Bb2', 'F3'], rh: ['D5', 'F5', 'C6'], color: '#06b6d4' },
  'Ebadd9': { lh: ['Eb2', 'Bb2'], rh: ['G4', 'Bb4', 'F5'], color: '#06b6d4' },

  // Diminished (Color Chords)
  'Cdim7': { lh: ['C2', 'Gb2'], rh: ['Eb4', 'A4'], color: '#64748b' },
  'Ddim7': { lh: ['D2', 'Ab2'], rh: ['F4', 'B4'], color: '#64748b' },
  'Edim7': { lh: ['E2', 'Bb2'], rh: ['G4', 'Db5'], color: '#64748b' },
  'F#dim7': { lh: ['F#2', 'C3'], rh: ['A4', 'Eb5'], color: '#64748b' },

  // Half Diminished (m7b5) - Jazzy Dark R&B
  'Dm7b5': { lh: ['D2', 'Ab2'], rh: ['F4', 'C5'], color: '#78716c' },
  'Em7b5': { lh: ['E2', 'Bb2'], rh: ['G4', 'D5'], color: '#78716c' },
  'F#m7b5': { lh: ['F#2', 'C3'], rh: ['A4', 'E5'], color: '#78716c' },
  'Bm7b5': { lh: ['B2', 'F3'], rh: ['D5', 'A5'], color: '#78716c' },
  'C#m7b5': { lh: ['C#2', 'G2'], rh: ['E4', 'B4'], color: '#78716c' },

  // Special Voicings from PDF
  'Fmaj7#11': { lh: ['F2', 'C3'], rh: ['A4', 'E5', 'B5'], color: '#7c3aed' },
  'Ebmaj7#11': { lh: ['Eb2', 'Bb2'], rh: ['G4', 'D5', 'A5'], color: '#7c3aed' },
  'Dmaj7#11': { lh: ['D2', 'A2'], rh: ['F#4', 'C#5', 'G#5'], color: '#7c3aed' },
  'Gmaj7#5': { lh: ['G2', 'D#3'], rh: ['B4', 'F#5'], color: '#7c3aed' },
  'C#m9': { lh: ['C#2', 'G#2'], rh: ['E4', 'B4', 'D#5'], color: '#d946ef' },
};

// Artist-specific progression sets from PDFs
export const ARTIST_PROGRESSIONS = {
  sza: {
    name: 'SZA',
    description: 'Ethereal, Floating, Dreamy',
    color: '#ea580c',
    progressions: [
      { name: 'SZA Classic Spacey', chords: ['Fmaj9', 'Gsus2', 'Em7'], description: 'Classic SZA spacey wash' },
      { name: 'SZA Soft Float', chords: ['Dm9', 'Am7', 'Cadd9'], description: 'Soft & floaty' },
      { name: 'SZA Alt Soul', chords: ['Em7', 'Cmaj7', 'Dadd9', 'Bm7'], description: 'Alternative soul vibe' },
      { name: 'SZA Dreamy', chords: ['Fmaj9', 'Gsus2', 'Em7', 'Cadd9'], description: 'Extended dreamy progression' },
      { name: 'SZA CTRL', chords: ['Am9', 'Fmaj9', 'Dm9', 'Em7'], description: 'CTRL album vibes' },
    ]
  },
  pnd: {
    name: 'PartyNextDoor',
    description: 'Dark, Moody, Caribbean-Influenced',
    color: '#7c3aed',
    progressions: [
      { name: 'PND Dark Moody', chords: ['Cm9', 'Abmaj7', 'Bb7'], description: 'Classic PND darkness' },
      { name: 'PND Caribbean', chords: ['Gm7', 'Ebmaj7', 'F7#9'], description: 'Caribbean-influenced' },
      { name: 'PND Jazzy', chords: ['Dm7b5', 'G7', 'Cm9'], description: 'Jazzy PND vibe' },
      { name: 'PND Recognize', chords: ['Cm9', 'Abmaj9', 'Bb7', 'Gm7'], description: 'Recognize atmosphere' },
      { name: 'PND Late Night', chords: ['Ebmaj7#11', 'Cm9', 'Abmaj7', 'Bb9'], description: 'Late night Toronto' },
    ]
  },
  summerWalker: {
    name: 'Summer Walker',
    description: 'Emotional, Warm, Intimate',
    color: '#be185d',
    progressions: [
      { name: 'Summer Classic', chords: ['Am7', 'Dm7', 'Em7'], description: 'Classic soft R&B' },
      { name: 'Summer Warm', chords: ['Bbmaj7', 'Fmaj7', 'Gm7'], description: 'Warm progression' },
      { name: 'Summer Soulful', chords: ['Dm9', 'Am7', 'Em9'], description: 'Warm & soulful' },
      { name: 'Summer Over It', chords: ['Am7', 'Dm7', 'Fmaj7', 'Em7'], description: 'Over It album vibe' },
      { name: 'Summer Intimate', chords: ['Fm9', 'Bbmaj7', 'Gm7', 'Cm7'], description: 'Intimate late night' },
    ]
  },
  bryson: {
    name: 'Bryson Tiller',
    description: 'Trap Soul Dark + Smooth',
    color: '#dc2626',
    progressions: [
      { name: 'Bryson Trap Soul', chords: ['Cm7', 'Abmaj7', 'Bb7'], description: 'Classic trap soul' },
      { name: 'Bryson Smooth', chords: ['Fm7', 'Dbmaj7', 'Ebadd9'], description: 'Smooth Bryson' },
      { name: 'Bryson Melodic', chords: ['Gm9', 'Ebmaj7', 'Dm7b5'], description: 'Melodic & moody' },
      { name: 'Bryson Don\'t', chords: ['Cm7', 'Abmaj7', 'Bb7', 'Gm7'], description: 'Don\'t vibe' },
      { name: 'Bryson Exchange', chords: ['Fm7', 'Dbmaj7', 'Ebmaj7', 'Cm9'], description: 'Exchange feel' },
    ]
  },
  darkRnb: {
    name: 'Dark R&B',
    description: 'Sad, Haunting, Atmospheric',
    color: '#1e293b',
    progressions: [
      { name: 'Dark Haunting', chords: ['Em9', 'Cmaj7', 'Dadd9', 'Bm7'], description: 'Haunting atmosphere' },
      { name: 'Dark Sharp', chords: ['C#m9', 'Amaj7', 'B7#9'], description: 'Sharp key darkness' },
      { name: 'Dark Ethereal', chords: ['F#m11', 'Dmaj7', 'Eadd9'], description: 'Ethereal darkness' },
      { name: 'Dark Weeknd', chords: ['Em9', 'Bm11', 'Gmaj7', 'Dadd9'], description: 'Weeknd-style dark' },
      { name: 'Dark Ambient', chords: ['Am9', 'Fmaj7#11', 'Dm9', 'Em11'], description: 'Ambient darkness' },
    ]
  },
  oldSchool: {
    name: 'Old School R&B',
    description: 'Classic Soul & Jazz-influenced',
    color: '#0891b2',
    progressions: [
      { name: 'Classic ii-V-I', chords: ['Dm7', 'G7', 'Cmaj7'], description: 'Jazz-inspired R&B' },
      { name: 'Old School Soul', chords: ['Fmaj7', 'G7', 'Em7', 'Am7'], description: 'IV-V-iii-vi soulful' },
      { name: 'R&B Pop', chords: ['Cmaj7', 'G7', 'Am7', 'Fmaj7'], description: 'I-V-vi-IV blend' },
      { name: 'Jodeci Vibe', chords: ['Cm9', 'Fm7', 'Abmaj7', 'G7'], description: 'Jodeci-style' },
      { name: 'Boyz II Men', chords: ['Bbmaj7', 'Gm7', 'Cm7', 'F7'], description: 'Boyz II Men ballad' },
      { name: '90s Slow Jam', chords: ['Ebmaj7', 'Cm7', 'Fm7', 'Bb7'], description: 'Classic slow jam' },
    ]
  },
  neoSoul: {
    name: 'Neo Soul',
    description: 'D\'Angelo, Erykah Badu style',
    color: '#15803d',
    progressions: [
      { name: 'Neo Soul Groove', chords: ['Dm9', 'G13', 'Cmaj9', 'Am9'], description: 'Classic neo soul' },
      { name: 'Erykah Badu', chords: ['Fmaj9', 'Em7', 'Am9', 'Dm7'], description: 'Baduizm vibes' },
      { name: 'D\'Angelo', chords: ['Gm9', 'C13', 'Fmaj9', 'Bbmaj7'], description: 'Voodoo feel' },
      { name: 'Maxwell', chords: ['Ebmaj9', 'Cm9', 'Fm9', 'Bb13'], description: 'Urban Hang Suite' },
      { name: 'Musiq', chords: ['Am9', 'Dm9', 'Gmaj9', 'Cmaj9'], description: 'Musiq Soulchild' },
    ]
  },
  modern: {
    name: 'Modern R&B',
    description: 'Frank Ocean, Daniel Caesar, Giveon',
    color: '#6366f1',
    progressions: [
      { name: 'Frank Ocean', chords: ['Cmaj9', 'Am9', 'Fmaj9', 'Gsus2'], description: 'Blonde vibes' },
      { name: 'Daniel Caesar', chords: ['Gmaj9', 'Em9', 'Cmaj9', 'Dadd9'], description: 'Get You feel' },
      { name: 'Giveon', chords: ['Dm9', 'Am9', 'Fmaj7', 'G7'], description: 'Deep baritone soul' },
      { name: 'H.E.R.', chords: ['Bbmaj9', 'Gm9', 'Ebmaj7', 'F9'], description: 'Focus R&B' },
      { name: 'Brent Faiyaz', chords: ['Am9', 'Em7', 'Fmaj9', 'Dm9'], description: 'Wasteland dark' },
    ]
  }
};

// Convert chord name to MIDI notes using real voicings
export const getChordMidi = (chordName) => {
  const voicing = CHORD_VOICINGS[chordName];
  if (!voicing) {
    console.warn(`Chord ${chordName} not found, using Cmaj7`);
    return getChordMidi('Cmaj7');
  }
  
  const lhMidi = voicing.lh.map(note => noteToMidi(note));
  const rhMidi = voicing.rh.map(note => noteToMidi(note));
  
  return {
    lh: lhMidi,
    rh: rhMidi,
    all: [...lhMidi, ...rhMidi],
    color: voicing.color,
    name: chordName
  };
};

// Transpose a chord to a different key
export const transposeChord = (chordName, semitones) => {
  if (semitones === 0) return chordName;
  
  const match = chordName.match(/^([A-G]#?b?)(.*)/);
  if (!match) return chordName;
  
  const [, root, quality] = match;
  const rootIndex = NOTES.indexOf(root.replace('b', ''));
  const newRootIndex = (rootIndex + semitones + 12) % 12;
  const newRoot = NOTES[newRootIndex];
  
  return newRoot + quality;
};

// Get all progressions flattened
export const getAllProgressions = () => {
  const all = [];
  Object.entries(ARTIST_PROGRESSIONS).forEach(([artistKey, artist]) => {
    artist.progressions.forEach(prog => {
      all.push({
        ...prog,
        artist: artist.name,
        artistKey,
        artistColor: artist.color,
        artistDescription: artist.description
      });
    });
  });
  return all;
};

export default CHORD_VOICINGS;
