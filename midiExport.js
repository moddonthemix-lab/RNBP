// MIDI file generation utilities

// Variable length quantity encoding
const toVLQ = (value) => {
  const bytes = [];
  let v = value;
  bytes.push(v & 0x7f);
  while ((v >>= 7) > 0) {
    bytes.unshift((v & 0x7f) | 0x80);
  }
  return bytes;
};

// Create a MIDI file from notes array
export const createMidiFile = (notes, bpm = 90, name = 'rnb_progression') => {
  const ticksPerBeat = 480;
  const microsecondsPerBeat = Math.round(60000000 / bpm);
  
  // Build track data
  const trackEvents = [];
  
  // Tempo event
  trackEvents.push([0, [0xff, 0x51, 0x03, 
    (microsecondsPerBeat >> 16) & 0xff,
    (microsecondsPerBeat >> 8) & 0xff,
    microsecondsPerBeat & 0xff
  ]]);
  
  // Track name
  const nameBytes = [...name].map(c => c.charCodeAt(0));
  trackEvents.push([0, [0xff, 0x03, nameBytes.length, ...nameBytes]]);
  
  // Sort notes by start time
  const sortedNotes = [...notes].sort((a, b) => a.start - b.start);
  
  // Create note on/off events
  const events = [];
  sortedNotes.forEach(note => {
    const startTick = Math.round(note.start * ticksPerBeat);
    const duration = Math.round(note.duration * ticksPerBeat);
    const channel = note.channel || 0;
    events.push({ 
      tick: startTick, 
      type: 'on', 
      note: note.note, 
      velocity: note.velocity || 100,
      channel 
    });
    events.push({ 
      tick: startTick + duration, 
      type: 'off', 
      note: note.note, 
      velocity: 0,
      channel 
    });
  });
  
  // Sort all events by tick
  events.sort((a, b) => a.tick - b.tick);
  
  let lastTick = 0;
  events.forEach(event => {
    const delta = event.tick - lastTick;
    const status = (event.type === 'on' ? 0x90 : 0x80) + event.channel;
    trackEvents.push([delta, [status, event.note, event.velocity]]);
    lastTick = event.tick;
  });
  
  // End of track
  trackEvents.push([0, [0xff, 0x2f, 0x00]]);
  
  // Build track chunk
  const trackData = [];
  trackEvents.forEach(([delta, data]) => {
    trackData.push(...toVLQ(delta), ...data);
  });
  
  // Build complete MIDI file
  const midi = [
    // Header chunk
    0x4d, 0x54, 0x68, 0x64, // "MThd"
    0x00, 0x00, 0x00, 0x06, // Header length
    0x00, 0x00,             // Format 0
    0x00, 0x01,             // 1 track
    (ticksPerBeat >> 8) & 0xff, ticksPerBeat & 0xff, // Ticks per beat
    // Track chunk
    0x4d, 0x54, 0x72, 0x6b, // "MTrk"
    (trackData.length >> 24) & 0xff,
    (trackData.length >> 16) & 0xff,
    (trackData.length >> 8) & 0xff,
    trackData.length & 0xff,
    ...trackData
  ];
  
  return new Uint8Array(midi);
};

// Download MIDI file
export const downloadMidi = (midiData, filename) => {
  const blob = new Blob([midiData], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Generate chord MIDI notes
export const generateChordMidiNotes = (chords, beatsPerChord = 4, velocity = 80) => {
  const notes = [];
  
  chords.forEach((chord, chordIndex) => {
    const startBeat = chordIndex * beatsPerChord;
    
    chord.midiNotes.forEach(note => {
      notes.push({
        note,
        start: startBeat,
        duration: beatsPerChord - 0.25,
        velocity,
        channel: 0
      });
    });
  });
  
  return notes;
};

// Generate melody MIDI notes
export const generateMelodyMidiNotes = (melodies, beatsPerChord = 4, velocity = 100) => {
  const notes = [];
  
  melodies.forEach((melody, chordIndex) => {
    const startBeat = chordIndex * beatsPerChord;
    
    melody.notes.forEach((note, i) => {
      const rhythm = melody.rhythm || [0, 0.5, 1, 1.5, 2];
      const noteStart = startBeat + (rhythm[i] || i * 0.5);
      
      notes.push({
        note,
        start: noteStart,
        duration: 0.4,
        velocity,
        channel: 1
      });
    });
  });
  
  return notes;
};

// Generate bass MIDI notes
export const generateBassMidiNotes = (chords, beatsPerChord = 4) => {
  const notes = [];
  
  chords.forEach((chord, chordIndex) => {
    const startBeat = chordIndex * beatsPerChord;
    const bassNote = chord.root + 36; // Octave 2
    
    // Root on beat 1
    notes.push({
      note: bassNote,
      start: startBeat,
      duration: 1.5,
      velocity: 100,
      channel: 2
    });
    
    // Fifth or octave on beat 3
    notes.push({
      note: bassNote + 7,
      start: startBeat + 2,
      duration: 1.5,
      velocity: 90,
      channel: 2
    });
  });
  
  return notes;
};

// Generate drum MIDI notes
export const generateDrumMidiNotes = (pattern, bars = 4) => {
  const notes = [];
  const beatsPerBar = 4;
  
  for (let bar = 0; bar < bars; bar++) {
    const barStart = bar * beatsPerBar;
    
    // Kick (note 36 / C1)
    pattern.kick.forEach(beat => {
      notes.push({
        note: 36,
        start: barStart + beat,
        duration: 0.25,
        velocity: 100,
        channel: 9
      });
    });
    
    // Snare (note 38 / D1)
    pattern.snare.forEach(beat => {
      notes.push({
        note: 38,
        start: barStart + beat,
        duration: 0.25,
        velocity: 90,
        channel: 9
      });
    });
    
    // Closed hi-hat (note 42 / F#1)
    pattern.hihat.forEach(beat => {
      notes.push({
        note: 42,
        start: barStart + beat,
        duration: 0.1,
        velocity: 60,
        channel: 9
      });
    });
    
    // Open hi-hat (note 46 / A#1)
    pattern.openHat.forEach(beat => {
      notes.push({
        note: 46,
        start: barStart + beat,
        duration: 0.2,
        velocity: 70,
        channel: 9
      });
    });
  }
  
  return notes;
};
