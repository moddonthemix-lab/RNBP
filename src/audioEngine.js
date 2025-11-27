import * as Tone from 'tone';

// Improved Audio Engine with realistic R&B sounds
class AudioEngine {
  constructor() {
    this.initialized = false;
    this.instruments = {};
  }

  async init() {
    if (this.initialized) return;
    
    await Tone.start();
    console.log('Audio context started');
    
    // Master chain
    this.masterLimiter = new Tone.Limiter(-3).toDestination();
    this.masterComp = new Tone.Compressor(-18, 4).connect(this.masterLimiter);
    this.masterReverb = new Tone.Reverb({ decay: 3, wet: 0.25 }).connect(this.masterComp);
    this.masterDelay = new Tone.FeedbackDelay('8n', 0.15).connect(this.masterReverb);
    
    // ===================
    // RHODES ELECTRIC PIANO - Warm, bell-like, with tremolo
    // ===================
    this.instruments.rhodes = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 2,
      modulationIndex: 3.5,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.008,
        decay: 0.8,
        sustain: 0.6,
        release: 2.5
      },
      modulation: { type: 'sine' },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.3,
        release: 1.5
      }
    });
    
    const rhodesTremolo = new Tone.Tremolo(3.5, 0.35).start();
    const rhodesChorus = new Tone.Chorus(2.5, 3.5, 0.5).start();
    const rhodesEQ = new Tone.EQ3(-2, 3, -4);
    
    this.instruments.rhodes.connect(rhodesTremolo);
    rhodesTremolo.connect(rhodesChorus);
    rhodesChorus.connect(rhodesEQ);
    rhodesEQ.connect(this.masterDelay);
    this.instruments.rhodes.volume.value = -8;

    // ===================
    // WURLITZER - Brighter, more bark
    // ===================
    this.instruments.wurli = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 1.5,
      modulationIndex: 5,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.005,
        decay: 0.6,
        sustain: 0.4,
        release: 1.8
      },
      modulation: { type: 'triangle' },
      modulationEnvelope: {
        attack: 0.008,
        decay: 0.4,
        sustain: 0.2,
        release: 1
      }
    });
    
    const wurliTremolo = new Tone.Tremolo(5, 0.5).start();
    const wurliDrive = new Tone.Distortion(0.08);
    
    this.instruments.wurli.connect(wurliTremolo);
    wurliTremolo.connect(wurliDrive);
    wurliDrive.connect(this.masterDelay);
    this.instruments.wurli.volume.value = -10;

    // ===================
    // WARM PAD - Lush sustained chords
    // ===================
    this.instruments.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.8,
        decay: 0.3,
        sustain: 0.9,
        release: 3
      }
    });
    
    const padFilter = new Tone.Filter(600, 'lowpass', -24);
    const padChorus = new Tone.Chorus(1.5, 4, 0.7).start();
    const padReverb = new Tone.Reverb({ decay: 5, wet: 0.5 });
    
    this.instruments.pad.connect(padFilter);
    padFilter.connect(padChorus);
    padChorus.connect(padReverb);
    padReverb.connect(this.masterComp);
    this.instruments.pad.volume.value = -16;

    // ===================
    // STRINGS - Orchestral pad
    // ===================
    this.instruments.strings = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 1.2,
        decay: 0.5,
        sustain: 0.85,
        release: 2.5
      }
    });
    
    const stringsFilter = new Tone.Filter(1200, 'lowpass', -12);
    const stringsChorus = new Tone.Chorus(0.8, 5, 0.6).start();
    
    this.instruments.strings.connect(stringsFilter);
    stringsFilter.connect(stringsChorus);
    stringsChorus.connect(this.masterReverb);
    this.instruments.strings.volume.value = -18;

    // ===================
    // CLEAN GUITAR - Warm jazz guitar
    // ===================
    this.instruments.guitar = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.5,
        release: 1.5
      }
    });
    
    const guitarChorus = new Tone.Chorus(1.2, 2.5, 0.3).start();
    const guitarDelay = new Tone.FeedbackDelay('8n.', 0.2);
    
    this.instruments.guitar.connect(guitarChorus);
    guitarChorus.connect(guitarDelay);
    guitarDelay.connect(this.masterReverb);
    this.instruments.guitar.volume.value = -12;

    // ===================
    // PLUCK GUITAR - For arpeggios
    // ===================
    this.instruments.pluck = new Tone.PluckSynth({
      attackNoise: 1.2,
      dampening: 2800,
      resonance: 0.97,
      release: 2
    });
    
    const pluckDelay = new Tone.FeedbackDelay('16n', 0.15);
    this.instruments.pluck.connect(pluckDelay);
    pluckDelay.connect(this.masterReverb);
    this.instruments.pluck.volume.value = -8;

    // ===================
    // BASS - Deep, warm sub
    // ===================
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: {
        Q: 3,
        type: 'lowpass',
        frequency: 350
      },
      envelope: {
        attack: 0.03,
        decay: 0.15,
        sustain: 0.85,
        release: 0.6
      },
      filterEnvelope: {
        attack: 0.03,
        decay: 0.25,
        sustain: 0.4,
        release: 0.5,
        baseFrequency: 80,
        octaves: 2.8
      }
    });
    
    const bassComp = new Tone.Compressor(-20, 6);
    this.instruments.bass.connect(bassComp);
    bassComp.connect(this.masterComp);
    this.instruments.bass.volume.value = -6;

    // ===================
    // SUB BASS - Pure low end
    // ===================
    this.instruments.subBass = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.9,
        release: 0.5
      }
    });
    
    const subFilter = new Tone.Filter(100, 'lowpass');
    this.instruments.subBass.connect(subFilter);
    subFilter.connect(this.masterComp);
    this.instruments.subBass.volume.value = -10;

    // ===================
    // MELODY LEAD - Smooth sine with vibrato
    // ===================
    this.instruments.lead = new Tone.MonoSynth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.08,
        decay: 0.3,
        sustain: 0.7,
        release: 1.2
      },
      filter: {
        Q: 1,
        type: 'lowpass',
        frequency: 3000
      }
    });
    
    const leadVibrato = new Tone.Vibrato(4.5, 0.15);
    const leadDelay = new Tone.FeedbackDelay('8n', 0.2);
    
    this.instruments.lead.connect(leadVibrato);
    leadVibrato.connect(leadDelay);
    leadDelay.connect(this.masterReverb);
    this.instruments.lead.volume.value = -10;

    // ===================
    // SYNTH LEAD - For hooks
    // ===================
    this.instruments.synthLead = new Tone.MonoSynth({
      oscillator: { type: 'square' },
      envelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.6,
        release: 0.8
      },
      filter: {
        Q: 2,
        type: 'lowpass',
        frequency: 2000
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.3,
        release: 0.5,
        baseFrequency: 800,
        octaves: 2
      }
    });
    
    const synthLeadChorus = new Tone.Chorus(2, 3, 0.4).start();
    this.instruments.synthLead.connect(synthLeadChorus);
    synthLeadChorus.connect(this.masterDelay);
    this.instruments.synthLead.volume.value = -12;

    // ===================
    // DRUMS
    // ===================
    
    // Kick - Deep 808
    this.instruments.kick = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 7,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.002,
        decay: 0.6,
        sustain: 0.02,
        release: 0.8
      }
    });
    this.instruments.kick.connect(this.masterComp);
    this.instruments.kick.volume.value = -4;

    // Snare
    this.instruments.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.002,
        decay: 0.18,
        sustain: 0.02,
        release: 0.15
      }
    });
    
    const snareFilter = new Tone.Filter(4000, 'bandpass', -12);
    const snareBody = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 }
    });
    
    this.instruments.snare.connect(snareFilter);
    snareFilter.connect(this.masterReverb);
    snareBody.connect(this.masterComp);
    this.instruments.snare.volume.value = -10;
    this.instruments.snareBody = snareBody;
    this.instruments.snareBody.volume.value = -14;

    // Hi-Hat Closed
    this.instruments.hihat = new Tone.MetalSynth({
      frequency: 280,
      envelope: {
        attack: 0.001,
        decay: 0.06,
        release: 0.02
      },
      harmonicity: 5.1,
      modulationIndex: 40,
      resonance: 3500,
      octaves: 1.2
    });
    this.instruments.hihat.connect(this.masterComp);
    this.instruments.hihat.volume.value = -22;

    // Hi-Hat Open
    this.instruments.openHat = new Tone.MetalSynth({
      frequency: 280,
      envelope: {
        attack: 0.001,
        decay: 0.35,
        release: 0.15
      },
      harmonicity: 5.1,
      modulationIndex: 40,
      resonance: 3500,
      octaves: 1.2
    });
    this.instruments.openHat.connect(this.masterReverb);
    this.instruments.openHat.volume.value = -24;

    // Clap
    this.instruments.clap = new Tone.NoiseSynth({
      noise: { type: 'pink' },
      envelope: {
        attack: 0.001,
        decay: 0.12,
        sustain: 0,
        release: 0.1
      }
    });
    const clapFilter = new Tone.Filter(2000, 'bandpass');
    this.instruments.clap.connect(clapFilter);
    clapFilter.connect(this.masterReverb);
    this.instruments.clap.volume.value = -14;

    // Rim
    this.instruments.rim = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
    });
    this.instruments.rim.connect(this.masterComp);
    this.instruments.rim.volume.value = -16;

    this.initialized = true;
    console.log('All instruments loaded with improved sounds');
  }

  // Convert MIDI to note name
  midiToNote(midi) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = notes[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${note}${octave}`;
  }

  // Play chord with left hand and right hand separation
  playChordSplit(lhNotes, rhNotes, duration, instrument = 'rhodes', time = Tone.now(), velocity = 0.7) {
    if (!this.initialized) return;
    
    const inst = this.instruments[instrument];
    if (!inst) return;

    // Convert MIDI to note names
    const lhNames = lhNotes.map(n => this.midiToNote(n));
    const rhNames = rhNotes.map(n => this.midiToNote(n));
    
    // Play left hand slightly before right hand for realism
    if (inst.triggerAttackRelease) {
      // Left hand - bass notes
      inst.triggerAttackRelease(lhNames, duration, time, velocity * 0.85);
      // Right hand - chord tones, slightly delayed
      inst.triggerAttackRelease(rhNames, duration, time + 0.015, velocity);
    }
  }

  // Play full chord
  playChord(notes, duration, instrument = 'rhodes', time = Tone.now(), velocity = 0.7) {
    if (!this.initialized) return;
    
    const inst = this.instruments[instrument];
    if (!inst) return;

    const noteNames = notes.map(n => this.midiToNote(n));
    
    if (inst.triggerAttackRelease) {
      inst.triggerAttackRelease(noteNames, duration, time, velocity);
    }
  }

  // Play single note
  playNote(midiNote, duration, instrument = 'lead', time = Tone.now(), velocity = 0.7) {
    if (!this.initialized) return;
    
    const inst = this.instruments[instrument];
    if (!inst) return;

    const noteName = this.midiToNote(midiNote);
    
    if (inst.triggerAttackRelease) {
      inst.triggerAttackRelease(noteName, duration, time, velocity);
    }
  }

  // Play bass with optional sub layer
  playBass(midiNote, duration, time = Tone.now(), addSub = true) {
    if (!this.initialized) return;
    
    const noteName = this.midiToNote(midiNote);
    this.instruments.bass.triggerAttackRelease(noteName, duration, time, 0.8);
    
    if (addSub && midiNote < 48) {
      this.instruments.subBass.triggerAttackRelease(noteName, duration, time, 0.5);
    }
  }

  // Play drum hit
  playDrum(type, time = Tone.now(), velocity = 1) {
    if (!this.initialized) return;
    
    switch(type) {
      case 'kick':
        this.instruments.kick.triggerAttackRelease('C1', '4n', time, velocity);
        break;
      case 'snare':
        this.instruments.snare.triggerAttackRelease('8n', time, velocity * 0.8);
        this.instruments.snareBody.triggerAttackRelease('E2', '16n', time, velocity * 0.5);
        break;
      case 'hihat':
        this.instruments.hihat.triggerAttackRelease('32n', time, velocity * 0.4);
        break;
      case 'openHat':
        this.instruments.openHat.triggerAttackRelease('8n', time, velocity * 0.35);
        break;
      case 'clap':
        this.instruments.clap.triggerAttackRelease('16n', time, velocity * 0.7);
        break;
      case 'rim':
        this.instruments.rim.triggerAttackRelease('G4', '32n', time, velocity * 0.6);
        break;
    }
  }

  // Stop all
  stopAll() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    Object.values(this.instruments).forEach(inst => {
      if (inst.releaseAll) inst.releaseAll();
    });
  }

  // Set reverb
  setReverb(wet) {
    if (this.masterReverb) {
      this.masterReverb.wet.value = wet;
    }
  }

  // Set BPM
  setBPM(bpm) {
    Tone.Transport.bpm.value = bpm;
  }

  now() {
    return Tone.now();
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;
