/**
 * MIDI File Export
 */

// Variable length quantity encoding
const writeVLQ = (value) => {
  const bytes = [];
  let v = value;
  bytes.push(v & 0x7F);
  while ((v >>= 7) > 0) {
    bytes.unshift((v & 0x7F) | 0x80);
  }
  return bytes;
};

// Write string
const writeString = (str) => {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

// Write 16-bit integer
const write16 = (value) => [(value >> 8) & 0xFF, value & 0xFF];

// Write 32-bit integer  
const write32 = (value) => [
  (value >> 24) & 0xFF,
  (value >> 16) & 0xFF,
  (value >> 8) & 0xFF,
  value & 0xFF
];

/**
 * Create MIDI file from note events
 * @param {Array} notes - Array of { note, start, duration, velocity, channel }
 * @param {number} bpm - Tempo in BPM
 * @param {string} name - Track name
 * @returns {Uint8Array} MIDI file data
 */
export const createMidiFile = (notes, bpm = 80, name = 'R&B Track') => {
  const ticksPerBeat = 480;
  
  // Sort notes by start time
  const sortedNotes = [...notes].sort((a, b) => a.start - b.start);
  
  // Convert to MIDI events
  const events = [];
  
  // Add tempo event
  const microsecondsPerBeat = Math.round(60000000 / bpm);
  events.push({
    time: 0,
    data: [0xFF, 0x51, 0x03, 
      (microsecondsPerBeat >> 16) & 0xFF,
      (microsecondsPerBeat >> 8) & 0xFF,
      microsecondsPerBeat & 0xFF
    ]
  });
  
  // Add track name
  const nameBytes = writeString(name);
  events.push({
    time: 0,
    data: [0xFF, 0x03, nameBytes.length, ...nameBytes]
  });
  
  // Add note on/off events
  sortedNotes.forEach(note => {
    const startTicks = Math.round(note.start * ticksPerBeat);
    const durationTicks = Math.round(note.duration * ticksPerBeat);
    const channel = (note.channel || 0) & 0x0F;
    const velocity = Math.min(127, Math.max(0, note.velocity || 80));
    const midiNote = Math.min(127, Math.max(0, note.note));
    
    // Note On
    events.push({
      time: startTicks,
      data: [0x90 | channel, midiNote, velocity]
    });
    
    // Note Off
    events.push({
      time: startTicks + durationTicks,
      data: [0x80 | channel, midiNote, 0]
    });
  });
  
  // Sort events by time
  events.sort((a, b) => a.time - b.time);
  
  // Build track data with delta times
  const trackData = [];
  let lastTime = 0;
  
  events.forEach(event => {
    const delta = event.time - lastTime;
    trackData.push(...writeVLQ(delta));
    trackData.push(...event.data);
    lastTime = event.time;
  });
  
  // End of track
  trackData.push(...writeVLQ(0));
  trackData.push(0xFF, 0x2F, 0x00);
  
  // Build file
  const header = [
    ...writeString('MThd'),
    ...write32(6),        // Header length
    ...write16(0),        // Format 0
    ...write16(1),        // 1 track
    ...write16(ticksPerBeat)
  ];
  
  const track = [
    ...writeString('MTrk'),
    ...write32(trackData.length),
    ...trackData
  ];
  
  return new Uint8Array([...header, ...track]);
};

/**
 * Download MIDI file
 */
export const downloadMidi = (data, filename) => {
  const blob = new Blob([data], { type: 'audio/midi' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Generate MIDI events from arrangement
 */
export const generateMidiEvents = (arrangement, type = 'full') => {
  const { chords, bpm, drumPattern, bassPattern } = arrangement;
  const beatsPerChord = 4;
  const notes = [];
  
  chords.forEach((chord, idx) => {
    const startBeat = idx * beatsPerChord;
    
    // Chords/Piano
    if (type === 'chords' || type === 'piano' || type === 'full') {
      [0, 2].forEach(beat => {
        chord.notes.forEach(note => {
          notes.push({
            note,
            start: startBeat + beat,
            duration: 1.5,
            velocity: 80,
            channel: 0
          });
        });
      });
    }
    
    // Pad
    if (type === 'pad' || type === 'full') {
      chord.notes.forEach(note => {
        notes.push({
          note: note + 12,
          start: startBeat,
          duration: 3.8,
          velocity: 60,
          channel: 1
        });
      });
    }
    
    // Strings
    if (type === 'strings' || type === 'full') {
      chord.notes.forEach(note => {
        notes.push({
          note,
          start: startBeat,
          duration: 3.8,
          velocity: 55,
          channel: 2
        });
      });
    }
    
    // Guitar (arpeggiated)
    if (type === 'guitar' || type === 'full') {
      chord.notes.forEach((note, i) => {
        notes.push({
          note,
          start: startBeat + (i * 0.15),
          duration: 1.5,
          velocity: 70,
          channel: 3
        });
      });
    }
    
    // Bass
    if (type === 'bass' || type === 'full') {
      bassPattern.forEach(hit => {
        if (hit.beat < beatsPerChord) {
          notes.push({
            note: chord.bassNote + (hit.interval || 0),
            start: startBeat + hit.beat,
            duration: hit.duration,
            velocity: 95,
            channel: 4
          });
        }
      });
    }
    
    // Melody
    if (type === 'melody' || type === 'full') {
      const melodyNotes = chord.notes;
      [0, 0.5, 1.5, 2.5].forEach((beat, i) => {
        if (i < melodyNotes.length) {
          notes.push({
            note: melodyNotes[i % melodyNotes.length] + 12,
            start: startBeat + beat,
            duration: 0.4,
            velocity: 85,
            channel: 5
          });
        }
      });
    }
    
    // Drums
    if (type === 'drums' || type === 'full') {
      // Kick
      drumPattern.kick.forEach(beat => {
        if (beat < beatsPerChord) {
          notes.push({
            note: 36,
            start: startBeat + beat,
            duration: 0.25,
            velocity: 100,
            channel: 9
          });
        }
      });
      
      // Snare
      drumPattern.snare.forEach(beat => {
        if (beat < beatsPerChord) {
          notes.push({
            note: 38,
            start: startBeat + beat,
            duration: 0.2,
            velocity: 90,
            channel: 9
          });
        }
      });
      
      // Hi-hat
      drumPattern.hihat.forEach(beat => {
        if (beat < beatsPerChord) {
          notes.push({
            note: 42,
            start: startBeat + beat,
            duration: 0.1,
            velocity: 65,
            channel: 9
          });
        }
      });
      
      // Open hi-hat
      if (drumPattern.openHat) {
        drumPattern.openHat.forEach(beat => {
          if (beat < beatsPerChord) {
            notes.push({
              note: 46,
              start: startBeat + beat,
              duration: 0.2,
              velocity: 60,
              channel: 9
            });
          }
        });
      }
    }
  });
  
  return notes;
};
