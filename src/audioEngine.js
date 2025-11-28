import * as Tone from 'tone';

/**
 * Professional R&B Audio Engine
 * Uses Tone.Part for reliable scheduling and proper voice management
 */
class RnBAudioEngine {
  constructor() {
    this.initialized = false;
    this.instruments = {};
    this.parts = {};
    this.isPlaying = false;
  }

  async init() {
    if (this.initialized) return true;
    
    await Tone.start();
    
    // Set up high-quality audio context
    Tone.getContext().lookAhead = 0.1; // Better scheduling
    
    // ============================================
    // MASTER CHAIN - Professional mixing
    // ============================================
    this.masterGain = new Tone.Gain(0.8).toDestination();
    this.masterLimiter = new Tone.Limiter(-2).connect(this.masterGain);
    this.masterComp = new Tone.Compressor({
      threshold: -20,
      ratio: 4,
      attack: 0.003,
      release: 0.25
    }).connect(this.masterLimiter);
    
    this.masterReverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.2,
      preDelay: 0.01
    }).connect(this.masterComp);
    
    await this.masterReverb.generate();
    
    // ============================================
    // RHODES ELECTRIC PIANO - The R&B staple
    // ============================================
    this.instruments.piano = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 16,
      voice: {
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.5,
          sustain: 0.6,
          release: 1.5
        },
        modulation: { type: 'triangle' },
        modulationEnvelope: {
          attack: 0.01,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8
        }
      }
    });
    
    const pianoTremolo = new Tone.Tremolo(4, 0.3).start();
    const pianoChorus = new Tone.Chorus(2, 2.5, 0.4).start();
    
    this.instruments.piano.connect(pianoTremolo);
    pianoTremolo.connect(pianoChorus);
    pianoChorus.connect(this.masterReverb);
    this.instruments.piano.volume.value = -6;

    // ============================================
    // WARM PAD - Lush background
    // ============================================
    this.instruments.pad = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 12,
      voice: {
        oscillator: { type: 'sawtooth' },
        envelope: {
          attack: 0.6,
          decay: 0.3,
          sustain: 0.8,
          release: 2.5
        }
      }
    });
    
    const padFilter = new Tone.Filter({
      frequency: 800,
      type: 'lowpass',
      rolloff: -24
    });
    const padChorus = new Tone.Chorus(1, 3, 0.6).start();
    
    this.instruments.pad.connect(padFilter);
    padFilter.connect(padChorus);
    padChorus.connect(this.masterReverb);
    this.instruments.pad.volume.value = -14;

    // ============================================
    // STRINGS - Cinematic texture
    // ============================================
    this.instruments.strings = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 10,
      voice: {
        oscillator: { type: 'fatsawtooth', spread: 30, count: 3 },
        envelope: {
          attack: 1.0,
          decay: 0.4,
          sustain: 0.75,
          release: 2.0
        }
      }
    });
    
    const stringsFilter = new Tone.Filter({ frequency: 2000, type: 'lowpass' });
    this.instruments.strings.connect(stringsFilter);
    stringsFilter.connect(this.masterReverb);
    this.instruments.strings.volume.value = -16;

    // ============================================
    // PLUCK / GUITAR
    // ============================================
    this.instruments.guitar = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 3000,
      resonance: 0.96,
      release: 1.5
    });
    
    const guitarDelay = new Tone.FeedbackDelay('8n.', 0.15);
    this.instruments.guitar.connect(guitarDelay);
    guitarDelay.connect(this.masterReverb);
    this.instruments.guitar.volume.value = -8;

    // ============================================
    // BASS - Deep sub
    // ============================================
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: {
        Q: 4,
        type: 'lowpass',
        frequency: 300
      },
      envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.8,
        release: 0.5
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.5,
        release: 0.4,
        baseFrequency: 60,
        octaves: 3
      }
    });
    
    this.instruments.bass.connect(this.masterComp);
    this.instruments.bass.volume.value = -4;

    // ============================================
    // SUB BASS - Pure low end
    // ============================================
    this.instruments.sub = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.9,
        release: 0.4
      }
    });
    
    const subFilter = new Tone.Filter(80, 'lowpass');
    this.instruments.sub.connect(subFilter);
    subFilter.connect(this.masterComp);
    this.instruments.sub.volume.value = -8;

    // ============================================
    // MELODY LEAD
    // ============================================
    this.instruments.lead = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.05,
        decay: 0.2,
        sustain: 0.7,
        release: 1.0
      }
    });
    
    const leadVibrato = new Tone.Vibrato(5, 0.1);
    const leadDelay = new Tone.FeedbackDelay('8n', 0.2);
    
    this.instruments.lead.connect(leadVibrato);
    leadVibrato.connect(leadDelay);
    leadDelay.connect(this.masterReverb);
    this.instruments.lead.volume.value = -8;

    // ============================================
    // DRUMS
    // ============================================
    
    // Kick - 808 style
    this.instruments.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.5,
        sustain: 0.01,
        release: 0.6
      }
    });
    this.instruments.kick.connect(this.masterComp);
    this.instruments.kick.volume.value = -2;

    // Snare
    this.instruments.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.15,
        sustain: 0.01,
        release: 0.1
      }
    });
    const snareFilter = new Tone.Filter(5000, 'bandpass');
    this.instruments.snare.connect(snareFilter);
    snareFilter.connect(this.masterReverb);
    this.instruments.snare.volume.value = -10;

    // Hi-hat closed
    this.instruments.hihat = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    });
    this.instruments.hihat.connect(this.masterComp);
    this.instruments.hihat.volume.value = -20;

    // Hi-hat open
    this.instruments.openHat = new Tone.MetalSynth({
      frequency: 300,
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    });
    this.instruments.openHat.connect(this.masterReverb);
    this.instruments.openHat.volume.value = -22;

    this.initialized = true;
    console.log('R&B Audio Engine initialized');
    return true;
  }

  // Convert MIDI number to note name
  midiToNote(midi) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = notes[midi % 12];
    return `${note}${octave}`;
  }

  // Set BPM
  setBPM(bpm) {
    Tone.getTransport().bpm.value = bpm;
  }

  // Set reverb amount
  setReverb(amount) {
    if (this.masterReverb) {
      this.masterReverb.wet.value = Math.min(0.6, amount);
    }
  }

  /**
   * Play a full arrangement using Tone.Part for reliable timing
   */
  playArrangement(arrangement, onChordChange) {
    if (!this.initialized || this.isPlaying) return;
    
    this.stopAll();
    this.isPlaying = true;
    
    const transport = Tone.getTransport();
    transport.cancel();
    transport.position = 0;
    
    const { chords, bpm, instruments, drumPattern, bassPattern, swing } = arrangement;
    const beatsPerChord = 4;
    const secondsPerBeat = 60 / bpm;
    
    this.setBPM(bpm);
    
    // Create events array for each part
    const pianoEvents = [];
    const padEvents = [];
    const stringsEvents = [];
    const guitarEvents = [];
    const bassEvents = [];
    const melodyEvents = [];
    const kickEvents = [];
    const snareEvents = [];
    const hihatEvents = [];
    
    chords.forEach((chord, chordIdx) => {
      const chordStartTime = chordIdx * beatsPerChord * secondsPerBeat;
      
      // Piano - play chord on beats 1 and 3
      if (instruments.piano) {
        [0, 2].forEach(beat => {
          const time = chordStartTime + (beat * secondsPerBeat);
          pianoEvents.push({ time, notes: chord.notes, duration: 1.5 * secondsPerBeat });
        });
      }
      
      // Pad - sustained whole note
      if (instruments.pad) {
        padEvents.push({ 
          time: chordStartTime, 
          notes: chord.notes.map(n => n + 12), 
          duration: beatsPerChord * secondsPerBeat * 0.9 
        });
      }
      
      // Strings - sustained
      if (instruments.strings) {
        stringsEvents.push({ 
          time: chordStartTime, 
          notes: chord.notes, 
          duration: beatsPerChord * secondsPerBeat * 0.9 
        });
      }
      
      // Guitar - arpeggiate
      if (instruments.guitar) {
        chord.notes.forEach((note, i) => {
          guitarEvents.push({ 
            time: chordStartTime + (i * 0.15), 
            note 
          });
        });
      }
      
      // Bass - pattern
      if (instruments.bass) {
        const bassRoot = chord.bassNote || chord.notes[0] - 12;
        bassPattern.forEach(hit => {
          if (hit.beat < beatsPerChord) {
            bassEvents.push({
              time: chordStartTime + (hit.beat * secondsPerBeat),
              note: bassRoot + (hit.interval || 0),
              duration: hit.duration * secondsPerBeat
            });
          }
        });
      }
      
      // Melody - from chord tones
      if (instruments.melody) {
        const melodyNotes = [...chord.notes].sort(() => Math.random() - 0.5);
        [0, 0.5, 1.5, 2.5].forEach((beat, i) => {
          if (i < melodyNotes.length && Math.random() > 0.3) {
            const swingAmount = (i % 2 === 1) ? swing * secondsPerBeat : 0;
            melodyEvents.push({
              time: chordStartTime + (beat * secondsPerBeat) + swingAmount,
              note: melodyNotes[i % melodyNotes.length] + 12,
              duration: 0.4 * secondsPerBeat
            });
          }
        });
      }
      
      // Drums
      if (instruments.drums) {
        drumPattern.kick.forEach(beat => {
          if (beat < beatsPerChord) {
            kickEvents.push({ time: chordStartTime + (beat * secondsPerBeat) });
          }
        });
        
        drumPattern.snare.forEach(beat => {
          if (beat < beatsPerChord) {
            snareEvents.push({ time: chordStartTime + (beat * secondsPerBeat) });
          }
        });
        
        drumPattern.hihat.forEach(beat => {
          if (beat < beatsPerChord) {
            const swingAmount = (beat * 2) % 2 === 1 ? swing * 0.3 * secondsPerBeat : 0;
            hihatEvents.push({ time: chordStartTime + (beat * secondsPerBeat) + swingAmount });
          }
        });
      }
      
      // Schedule visual chord change
      transport.schedule((time) => {
        Tone.getDraw().schedule(() => {
          if (onChordChange) onChordChange(chordIdx);
        }, time);
      }, chordStartTime);
    });
    
    // Create and start Parts
    if (pianoEvents.length > 0) {
      this.parts.piano = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.piano.triggerAttackRelease(noteNames, event.duration, time, 0.7);
      }, pianoEvents).start(0);
    }
    
    if (padEvents.length > 0) {
      this.parts.pad = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.pad.triggerAttackRelease(noteNames, event.duration, time, 0.4);
      }, padEvents).start(0);
    }
    
    if (stringsEvents.length > 0) {
      this.parts.strings = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.strings.triggerAttackRelease(noteNames, event.duration, time, 0.35);
      }, stringsEvents).start(0);
    }
    
    if (guitarEvents.length > 0) {
      this.parts.guitar = new Tone.Part((time, event) => {
        this.instruments.guitar.triggerAttack(this.midiToNote(event.note), time);
      }, guitarEvents).start(0);
    }
    
    if (bassEvents.length > 0) {
      this.parts.bass = new Tone.Part((time, event) => {
        this.instruments.bass.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, 0.8);
        // Add sub bass for low notes
        if (event.note < 48) {
          this.instruments.sub.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, 0.5);
        }
      }, bassEvents).start(0);
    }
    
    if (melodyEvents.length > 0) {
      this.parts.melody = new Tone.Part((time, event) => {
        this.instruments.lead.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, 0.6);
      }, melodyEvents).start(0);
    }
    
    if (kickEvents.length > 0) {
      this.parts.kick = new Tone.Part((time) => {
        this.instruments.kick.triggerAttackRelease('C1', '8n', time, 0.9);
      }, kickEvents).start(0);
    }
    
    if (snareEvents.length > 0) {
      this.parts.snare = new Tone.Part((time) => {
        this.instruments.snare.triggerAttackRelease('16n', time, 0.7);
      }, snareEvents).start(0);
    }
    
    if (hihatEvents.length > 0) {
      this.parts.hihat = new Tone.Part((time) => {
        this.instruments.hihat.triggerAttackRelease('32n', time, 0.5);
      }, hihatEvents).start(0);
    }
    
    // Schedule end
    const totalTime = chords.length * beatsPerChord * secondsPerBeat;
    transport.schedule(() => {
      this.stopAll();
    }, totalTime + 0.5);
    
    // Start with slight delay for stability
    transport.start('+0.1');
    
    return totalTime;
  }

  stopAll() {
    this.isPlaying = false;
    
    const transport = Tone.getTransport();
    transport.stop();
    transport.cancel();
    transport.position = 0;
    
    // Dispose all parts
    Object.values(this.parts).forEach(part => {
      if (part && part.dispose) {
        part.stop();
        part.dispose();
      }
    });
    this.parts = {};
    
    // Release all synths
    Object.values(this.instruments).forEach(inst => {
      if (inst && inst.releaseAll) {
        inst.releaseAll();
      }
    });
  }
}

export const audioEngine = new RnBAudioEngine();
export default audioEngine;
