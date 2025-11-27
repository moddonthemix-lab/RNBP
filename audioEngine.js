import * as Tone from 'tone';
import { midiToNoteName } from './musicData';

// Audio engine singleton
class AudioEngine {
  constructor() {
    this.initialized = false;
    this.instruments = {};
    this.activeNotes = new Set();
    this.masterVolume = new Tone.Volume(-6).toDestination();
    this.reverb = new Tone.Reverb({ decay: 2.5, wet: 0.3 }).connect(this.masterVolume);
    this.compressor = new Tone.Compressor(-20, 4).connect(this.reverb);
  }

  async init() {
    if (this.initialized) return;
    
    await Tone.start();
    console.log('Audio context started');
    
    // Create instruments with realistic sounds
    
    // Electric Piano (Rhodes-like) - using FM synthesis for that bell-like tone
    this.instruments.piano = new Tone.PolySynth(Tone.FMSynth, {
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.3,
        sustain: 0.4,
        release: 1.2
      },
      modulation: { type: 'square' },
      modulationEnvelope: {
        attack: 0.01,
        decay: 0.5,
        sustain: 0.2,
        release: 0.5
      }
    });
    
    // Add tremolo for that classic Rhodes wobble
    const tremolo = new Tone.Tremolo(4, 0.3).start();
    const pianoChorus = new Tone.Chorus(3, 2.5, 0.5).start();
    this.instruments.piano.connect(tremolo);
    tremolo.connect(pianoChorus);
    pianoChorus.connect(this.compressor);
    this.instruments.piano.volume.value = -8;

    // Warm Pad for sustained chords
    this.instruments.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.5,
        decay: 0.2,
        sustain: 0.8,
        release: 2
      }
    });
    const padFilter = new Tone.Filter(800, 'lowpass');
    const padChorus = new Tone.Chorus(2, 3.5, 0.7).start();
    this.instruments.pad.connect(padFilter);
    padFilter.connect(padChorus);
    padChorus.connect(this.compressor);
    this.instruments.pad.volume.value = -18;

    // Guitar (pluck synthesis for clean guitar)
    this.instruments.guitar = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 3000,
      resonance: 0.98,
      release: 1.5
    });
    const guitarChorus = new Tone.Chorus(1.5, 2, 0.3).start();
    const guitarDelay = new Tone.FeedbackDelay(0.15, 0.2);
    this.instruments.guitar.connect(guitarChorus);
    guitarChorus.connect(guitarDelay);
    guitarDelay.connect(this.compressor);
    this.instruments.guitar.volume.value = -6;

    // Clean Electric Guitar with slight overdrive for R&B
    this.instruments.electricGuitar = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.8
      }
    });
    const guitarDist = new Tone.Distortion(0.1);
    const guitarFilter2 = new Tone.Filter(2500, 'lowpass');
    this.instruments.electricGuitar.connect(guitarDist);
    guitarDist.connect(guitarFilter2);
    guitarFilter2.connect(this.compressor);
    this.instruments.electricGuitar.volume.value = -10;

    // Bass - deep sub with character
    this.instruments.bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      filter: {
        Q: 2,
        type: 'lowpass',
        frequency: 400
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.9,
        release: 0.4
      },
      filterEnvelope: {
        attack: 0.02,
        decay: 0.2,
        sustain: 0.5,
        release: 0.4,
        baseFrequency: 100,
        octaves: 2.5
      }
    });
    this.instruments.bass.connect(this.compressor);
    this.instruments.bass.volume.value = -6;

    // Melody lead - smooth sine with vibrato
    this.instruments.lead = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.6,
        release: 0.8
      }
    });
    const leadVibrato = new Tone.Vibrato(5, 0.1);
    const leadDelay = new Tone.FeedbackDelay(0.2, 0.15);
    this.instruments.lead.connect(leadVibrato);
    leadVibrato.connect(leadDelay);
    leadDelay.connect(this.compressor);
    this.instruments.lead.volume.value = -10;

    // Drums
    this.instruments.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 6,
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 0.4
      }
    });
    this.instruments.kick.connect(this.compressor);
    this.instruments.kick.volume.value = -4;

    this.instruments.snare = new Tone.NoiseSynth({
      noise: { type: 'white' },
      envelope: {
        attack: 0.001,
        decay: 0.15,
        sustain: 0,
        release: 0.1
      }
    });
    const snareFilter = new Tone.Filter(5000, 'highpass');
    this.instruments.snare.connect(snareFilter);
    snareFilter.connect(this.compressor);
    this.instruments.snare.volume.value = -12;

    this.instruments.hihat = new Tone.MetalSynth({
      frequency: 250,
      envelope: {
        attack: 0.001,
        decay: 0.05,
        release: 0.01
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    });
    this.instruments.hihat.connect(this.masterVolume);
    this.instruments.hihat.volume.value = -24;

    this.instruments.openHat = new Tone.MetalSynth({
      frequency: 250,
      envelope: {
        attack: 0.001,
        decay: 0.3,
        release: 0.1
      },
      harmonicity: 5.1,
      modulationIndex: 32,
      resonance: 4000,
      octaves: 1.5
    });
    this.instruments.openHat.connect(this.masterVolume);
    this.instruments.openHat.volume.value = -26;

    this.initialized = true;
    console.log('All instruments loaded');
  }

  // Play a chord with specified instrument
  playChord(notes, duration, instrument = 'piano', time = Tone.now(), velocity = 0.7) {
    if (!this.initialized) return;
    
    const inst = this.instruments[instrument];
    if (!inst) return;

    const noteNames = notes.map(n => midiToNoteName(n));
    
    if (inst instanceof Tone.PolySynth) {
      inst.triggerAttackRelease(noteNames, duration, time, velocity);
    }
  }

  // Play a single note
  playNote(midiNote, duration, instrument = 'lead', time = Tone.now(), velocity = 0.7) {
    if (!this.initialized) return;
    
    const inst = this.instruments[instrument];
    if (!inst) return;

    const noteName = midiToNoteName(midiNote);
    
    if (inst.triggerAttackRelease) {
      inst.triggerAttackRelease(noteName, duration, time, velocity);
    }
  }

  // Play bass note
  playBass(midiNote, duration, time = Tone.now()) {
    if (!this.initialized) return;
    
    const noteName = midiToNoteName(midiNote);
    this.instruments.bass.triggerAttackRelease(noteName, duration, time, 0.8);
  }

  // Play drum hit
  playDrum(type, time = Tone.now()) {
    if (!this.initialized) return;
    
    switch(type) {
      case 'kick':
        this.instruments.kick.triggerAttackRelease('C1', '8n', time);
        break;
      case 'snare':
        this.instruments.snare.triggerAttackRelease('8n', time);
        break;
      case 'hihat':
        this.instruments.hihat.triggerAttackRelease('32n', time, 0.3);
        break;
      case 'openHat':
        this.instruments.openHat.triggerAttackRelease('8n', time, 0.3);
        break;
    }
  }

  // Stop all sounds
  stopAll() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    
    Object.values(this.instruments).forEach(inst => {
      if (inst.releaseAll) {
        inst.releaseAll();
      }
    });
  }

  // Set master volume
  setVolume(db) {
    this.masterVolume.volume.value = db;
  }

  // Set reverb amount
  setReverb(wet) {
    this.reverb.wet.value = wet;
  }

  // Get current time
  now() {
    return Tone.now();
  }

  // Get transport
  getTransport() {
    return Tone.Transport;
  }

  // Schedule callback
  schedule(callback, time) {
    return Tone.Transport.schedule(callback, time);
  }

  // Set BPM
  setBPM(bpm) {
    Tone.Transport.bpm.value = bpm;
  }

  // Start transport
  start() {
    Tone.Transport.start();
  }

  // Stop transport
  stop() {
    Tone.Transport.stop();
  }
}

// Export singleton
export const audioEngine = new AudioEngine();
export default audioEngine;
