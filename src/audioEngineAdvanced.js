import * as Tone from 'tone';
import { generateTrackVariation, generateChordVoicing, ARP_PATTERNS } from './variationEngine';
import { SampleManager, SampleSequencer } from './sampleLoader';

/**
 * PROFESSIONAL MULTI-PLATINUM R&B AUDIO ENGINE
 * Every generation is unique with advanced variations
 */
class AdvancedRnBAudioEngine {
  constructor() {
    this.initialized = false;
    this.instruments = {};
    this.effects = {};
    this.parts = {};
    this.isPlaying = false;
    this.currentVariation = null;

    // Sample system
    this.sampleManager = new SampleManager();
    this.sampleSequencer = new SampleSequencer(this.sampleManager);

    // Instrument banks - multiple instances for variations
    this.instrumentBanks = {};
  }

  async init() {
    if (this.initialized) {
      console.log('✅ Audio engine already initialized');
      return true;
    }

    try {
      console.log('🎹 Initializing Advanced R&B Audio Engine...');
      console.log('Browser:', navigator.userAgent);

      // Start Tone.js audio context
      console.log('Starting Tone.js...');
      await Tone.start();
      console.log('✅ Tone.js started');

      // Check context state
      const context = Tone.getContext();
      console.log('Audio context state:', context.state);

      if (context.state === 'suspended') {
        console.log('Resuming suspended audio context...');
        await context.resume();
      }

      // High-quality audio context settings for smooth playback
      context.lookAhead = 0.2; // Increased for smoother playback
      // Note: latencyHint is read-only, cannot be set here
      console.log('✅ Audio context configured (lookAhead:', context.lookAhead, ', latencyHint:', context.latencyHint, ')');

      // ============================================
      // PROFESSIONAL MASTER CHAIN - Smooth & Clean
      // ============================================
      console.log('Creating master chain...');

      // Reduced master gain to prevent clipping/distortion
      this.masterGain = new Tone.Gain(0.5).toDestination(); // Reduced from 0.75
      console.log('✓ Master gain (0.5 - prevents distortion)');

      this.masterLimiter = new Tone.Limiter(-3).connect(this.masterGain); // Increased threshold to -3
      console.log('✓ Limiter');

      // Gentler compression for smoother sound
      try {
        this.multibandComp = new Tone.MultibandCompressor({
          lowFrequency: 250,
          highFrequency: 2000,
          low: { threshold: -30, ratio: 3 },    // Gentler - reduced from -20, 6
          mid: { threshold: -25, ratio: 3 },    // Gentler - reduced from -15, 4
          high: { threshold: -20, ratio: 2 }    // Gentler - reduced from -12, 3
        }).connect(this.masterLimiter);
        console.log('✓ Multiband compressor (gentle)');
      } catch (e) {
        console.warn('Multiband compressor failed, using simple compressor:', e);
        this.multibandComp = new Tone.Compressor({
          threshold: -25,
          ratio: 3,
          attack: 0.003,
          release: 0.25
        }).connect(this.masterLimiter);
      }

      this.stereoWidener = new Tone.StereoWidener(0.5).connect(this.multibandComp); // Reduced from 0.7
      console.log('✓ Stereo widener');

      // Master reverb - smoother, less harsh
      console.log('🎛️ Generating reverb (this may take a few seconds)...');
      try {
        this.masterReverb = new Tone.Reverb({
          decay: 1.8,    // Reduced from 2.0
          wet: 0.2,      // Reduced from 0.25
          preDelay: 0.01
        }).connect(this.stereoWidener);

        // Set timeout for reverb generation
        await Promise.race([
          this.masterReverb.generate(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Reverb generation timeout')), 5000)
          )
        ]);
        console.log('✅ Reverb generated');
      } catch (e) {
        console.warn('Reverb generation failed, using simpler reverb:', e);
        // Fallback to simpler reverb
        this.masterReverb = new Tone.Reverb({
          decay: 1.2,
          wet: 0.15
        }).connect(this.stereoWidener);
        await this.masterReverb.generate();
      }

      // Reduced saturation for cleaner sound
      this.masterSaturation = new Tone.Distortion({
        distortion: 0.2,  // Reduced from 0.4
        wet: 0.15         // Reduced from 0.3
      }).connect(this.masterReverb);
      console.log('✓ Saturation (gentle)');

      // Dry/wet mixer
      this.masterMixer = new Tone.Gain(1.0).connect(this.masterSaturation);
      this.drySignal = new Tone.Gain(1.0).connect(this.stereoWidener);
      console.log('✓ Mixer chains');

      this.initialized = true;
      console.log('✅ Advanced R&B Audio Engine initialized - Multi-Platinum Quality');
      console.log('Audio ready to play!');
      return true;
    } catch (error) {
      console.error('❌ Audio engine initialization error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      // Try to clean up
      try {
        if (this.masterReverb) this.masterReverb.dispose();
        if (this.masterSaturation) this.masterSaturation.dispose();
        if (this.stereoWidener) this.stereoWidener.dispose();
        if (this.multibandComp) this.multibandComp.dispose();
        if (this.masterLimiter) this.masterLimiter.dispose();
        if (this.masterGain) this.masterGain.dispose();
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }

      throw error;
    }
  }

  /**
   * Generate new variation - makes every beat unique!
   */
  generateNewVariation() {
    this.currentVariation = generateTrackVariation();
    console.log('🎲 New variation generated:', this.currentVariation.id);
    return this.currentVariation;
  }

  /**
   * Create instruments based on current variation
   */
  async createInstruments(variation) {
    if (!variation) variation = this.generateNewVariation();

    console.log('🎸 Creating instruments with variation:', variation.id);

    // Dispose old instruments
    this.disposeInstruments();

    const instruments = {};
    const effects = {};

    // ============================================
    // PIANO - Rhodes/Electric Piano with variation
    // ============================================
    const pianoVar = variation.piano;
    instruments.piano = new Tone.PolySynth(Tone.FMSynth, {
      maxPolyphony: 16,
      voice: {
        harmonicity: pianoVar.harmonicity,
        modulationIndex: pianoVar.modulationIndex,
        oscillator: { type: 'sine' },
        envelope: {
          attack: pianoVar.attackTime,
          decay: pianoVar.decayTime,
          sustain: pianoVar.sustain,
          release: pianoVar.release
        },
        modulation: { type: 'triangle' },
        modulationEnvelope: {
          attack: pianoVar.attackTime,
          decay: pianoVar.decayTime * 0.6,
          sustain: pianoVar.sustain * 0.7,
          release: pianoVar.release * 0.5
        }
      }
    });

    effects.pianoTremolo = new Tone.Tremolo(pianoVar.tremoloRate, pianoVar.tremoloDepth).start();
    effects.pianoChorus = new Tone.Chorus(2, 2.5, pianoVar.chorusDepth).start();
    effects.pianoFilter = new Tone.Filter(2000 * pianoVar.brightness, 'lowpass');

    instruments.piano.connect(effects.pianoFilter);
    effects.pianoFilter.connect(effects.pianoTremolo);
    effects.pianoTremolo.connect(effects.pianoChorus);
    effects.pianoChorus.connect(this.masterMixer);
    instruments.piano.volume.value = pianoVar.volume;

    // ============================================
    // PAD - Lush atmospheric pad with variation
    // ============================================
    const padVar = variation.pad;
    instruments.pad = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 12,
      voice: {
        oscillator: {
          type: padVar.oscillatorType,
          detune: padVar.detune
        },
        envelope: {
          attack: padVar.attack,
          decay: padVar.decay,
          sustain: padVar.sustain,
          release: padVar.release
        }
      }
    });

    effects.padFilter = new Tone.Filter(padVar.filterFreq, 'lowpass', -24);
    effects.padFilter.Q.value = padVar.filterQ;
    effects.padChorus = new Tone.Chorus(padVar.chorusRate, 3, padVar.chorusDepth).start();

    instruments.pad.connect(effects.padFilter);
    effects.padFilter.connect(effects.padChorus);
    effects.padChorus.connect(this.masterMixer);
    instruments.pad.volume.value = padVar.volume;

    // ============================================
    // STRINGS - Cinematic strings with variation
    // ============================================
    const stringsVar = variation.strings;
    instruments.strings = new Tone.PolySynth(Tone.Synth, {
      maxPolyphony: 10,
      voice: {
        oscillator: {
          type: 'fatsawtooth',
          spread: stringsVar.spread,
          count: stringsVar.voiceCount
        },
        envelope: {
          attack: stringsVar.attack,
          decay: stringsVar.decay,
          sustain: stringsVar.sustain,
          release: stringsVar.release
        }
      }
    });

    effects.stringsFilter = new Tone.Filter(stringsVar.filterFreq, 'lowpass');
    effects.stringsVibrato = new Tone.Vibrato(stringsVar.vibratoRate, stringsVar.vibratoDepth);

    instruments.strings.connect(effects.stringsFilter);
    effects.stringsFilter.connect(effects.stringsVibrato);
    effects.stringsVibrato.connect(this.masterMixer);
    instruments.strings.volume.value = stringsVar.volume;

    // ============================================
    // GUITAR/PLUCK - Variable pluck synth
    // ============================================
    const pluckVar = variation.pluck;
    instruments.guitar = new Tone.PluckSynth({
      attackNoise: pluckVar.attackNoise,
      dampening: pluckVar.dampening,
      resonance: pluckVar.resonance,
      release: pluckVar.release
    });

    effects.guitarDelay = new Tone.FeedbackDelay(pluckVar.delayTime, pluckVar.delayFeedback);
    effects.guitarDelay.wet.value = pluckVar.delayMix;
    effects.guitarFilter = new Tone.Filter(5000 * pluckVar.tone, 'lowpass');

    instruments.guitar.connect(effects.guitarFilter);
    effects.guitarFilter.connect(effects.guitarDelay);
    effects.guitarDelay.connect(this.masterMixer);
    instruments.guitar.volume.value = pluckVar.volume;

    // ============================================
    // BASS - Deep sub bass with variation
    // ============================================
    const bassVar = variation.bass;
    instruments.bass = new Tone.MonoSynth({
      oscillator: { type: bassVar.oscillatorType },
      filter: {
        Q: bassVar.filterQ,
        type: 'lowpass',
        frequency: bassVar.filterFreq
      },
      envelope: {
        attack: bassVar.attack,
        decay: bassVar.decay,
        sustain: bassVar.sustain,
        release: bassVar.release
      },
      filterEnvelope: {
        attack: bassVar.filterAttack,
        decay: bassVar.filterDecay,
        sustain: bassVar.filterSustain,
        release: bassVar.release * 0.8,
        baseFrequency: 60,
        octaves: 3
      }
    });

    instruments.bass.connect(this.drySignal);
    instruments.bass.volume.value = bassVar.volume;

    // Sub bass
    instruments.sub = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: bassVar.attack,
        decay: bassVar.decay * 0.5,
        sustain: bassVar.sustain,
        release: bassVar.release * 0.5
      }
    });

    effects.subFilter = new Tone.Filter(80, 'lowpass');
    instruments.sub.connect(effects.subFilter);
    effects.subFilter.connect(this.drySignal);
    instruments.sub.volume.value = bassVar.volume - 4;

    // ============================================
    // LEAD SYNTH - Melodic lead with variation
    // ============================================
    const leadVar = variation.lead;
    instruments.lead = new Tone.Synth({
      oscillator: { type: leadVar.oscillatorType },
      envelope: {
        attack: leadVar.attack,
        decay: leadVar.decay,
        sustain: leadVar.sustain,
        release: leadVar.release
      }
    });

    effects.leadVibrato = new Tone.Vibrato(leadVar.vibratoRate, leadVar.vibratoDepth);
    effects.leadDelay = new Tone.FeedbackDelay('8n', 0.2);
    effects.leadFilter = new Tone.Filter(leadVar.filterCutoff, 'lowpass');
    effects.leadFilter.Q.value = leadVar.filterRes;

    instruments.lead.connect(effects.leadFilter);
    effects.leadFilter.connect(effects.leadVibrato);
    effects.leadVibrato.connect(effects.leadDelay);
    effects.leadDelay.connect(this.masterMixer);
    instruments.lead.volume.value = leadVar.volume;

    // ============================================
    // DRUMS - With variations
    // ============================================
    const drumVar = variation.drums;

    // Kick
    instruments.kick = new Tone.MembraneSynth({
      pitchDecay: drumVar.kick.pitchDecay,
      octaves: drumVar.kick.octaves,
      oscillator: { type: 'sine' },
      envelope: {
        attack: drumVar.kick.attack,
        decay: drumVar.kick.decay,
        sustain: 0.01,
        release: 0.6
      }
    });
    instruments.kick.connect(this.drySignal);
    instruments.kick.volume.value = drumVar.kick.volume;

    // Snare
    instruments.snare = new Tone.NoiseSynth({
      noise: { type: drumVar.snare.noiseType },
      envelope: {
        attack: drumVar.snare.attack,
        decay: drumVar.snare.decay,
        sustain: 0.01,
        release: 0.1
      }
    });

    effects.snareFilter = new Tone.Filter(drumVar.snare.filterFreq, 'bandpass');
    effects.snareReverb = new Tone.Reverb(1.2);
    await effects.snareReverb.generate();
    effects.snareReverb.wet.value = drumVar.snare.reverbMix;

    instruments.snare.connect(effects.snareFilter);
    effects.snareFilter.connect(effects.snareReverb);
    effects.snareReverb.connect(this.drySignal);
    instruments.snare.volume.value = drumVar.snare.volume;

    // Hi-hat closed
    instruments.hihat = new Tone.MetalSynth({
      frequency: drumVar.hihat.frequency,
      envelope: {
        attack: drumVar.hihat.attack,
        decay: drumVar.hihat.decay,
        release: 0.01
      },
      harmonicity: drumVar.hihat.harmonicity,
      modulationIndex: drumVar.hihat.modulationIndex,
      resonance: 4000,
      octaves: 1.5
    });
    instruments.hihat.connect(this.drySignal);
    instruments.hihat.volume.value = drumVar.hihat.volume;

    // Hi-hat open
    instruments.openHat = new Tone.MetalSynth({
      frequency: drumVar.openHat.frequency,
      envelope: {
        attack: drumVar.openHat.attack,
        decay: drumVar.openHat.decay,
        release: 0.1
      },
      harmonicity: drumVar.openHat.harmonicity,
      modulationIndex: drumVar.openHat.modulationIndex,
      resonance: 4000,
      octaves: 1.5
    });

    effects.openHatReverb = new Tone.Reverb(0.8);
    await effects.openHatReverb.generate();
    effects.openHatReverb.wet.value = drumVar.openHat.reverbMix;

    instruments.openHat.connect(effects.openHatReverb);
    effects.openHatReverb.connect(this.drySignal);
    instruments.openHat.volume.value = drumVar.openHat.volume;

    this.instruments = instruments;
    this.effects = effects;

    // Apply master variation effects
    this.stereoWidener.width.value = variation.masterStereoWidth;
    this.masterSaturation.wet.value = variation.masterWarmth;
    this.masterReverb.decay = variation.reverbDecay;
    this.masterReverb.wet.value = variation.reverbWet;

    console.log('✅ Instruments created with unique variation');
    return true;
  }

  /**
   * Convert MIDI number to note name
   */
  midiToNote(midi) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midi / 12) - 1;
    const note = notes[midi % 12];
    return `${note}${octave}`;
  }

  /**
   * Set BPM
   */
  setBPM(bpm) {
    Tone.getTransport().bpm.value = bpm;
  }

  /**
   * Set reverb amount
   */
  setReverb(amount) {
    if (this.masterReverb) {
      this.masterReverb.wet.value = Math.min(0.6, amount);
    }
  }

  /**
   * Play full arrangement with variations and samples
   */
  async playArrangement(arrangement, onChordChange) {
    if (!this.initialized) {
      console.error('❌ Audio engine not initialized');
      return 0;
    }

    if (this.isPlaying) {
      console.log('⚠️ Already playing, stopping first');
      this.stopAll();
    }

    this.isPlaying = true;
    console.log('▶️ Starting playback...');

    try {
      // Generate new variation for this playback
      const variation = arrangement.variation || this.generateNewVariation();
      await this.createInstruments(variation);

    const transport = Tone.getTransport();
    transport.cancel();
    transport.position = 0;

    const {
      chords,
      bpm,
      instruments: enabledInstruments,
      drumPattern,
      bassPattern,
      swing,
      customSamples
    } = arrangement;

    const beatsPerChord = 4;
    const secondsPerBeat = 60 / bpm;

    this.setBPM(bpm);

    // Apply global swing from variation
    transport.swing = variation.swingGlobal;
    transport.swingSubdivision = '8n';

    // Create events array for each part
    const events = {
      piano: [],
      pad: [],
      strings: [],
      guitar: [],
      bass: [],
      melody: [],
      kick: [],
      snare: [],
      hihat: [],
      openHat: []
    };

    // Get rhythm variation
    const rhythmVar = variation.rhythm;
    const guitarArpPattern = ARP_PATTERNS[rhythmVar.guitar.arpPattern];

    chords.forEach((chord, chordIdx) => {
      const chordStartTime = chordIdx * beatsPerChord * secondsPerBeat;

      // Apply chord voicing variation
      const voicedNotes = generateChordVoicing(chord.notes, variation.chordVoicing);

      // Piano - use rhythm variation
      if (enabledInstruments.piano) {
        rhythmVar.piano.pattern.forEach(beat => {
          const swingOffset = (beat % 1) * rhythmVar.piano.swingAmount * secondsPerBeat;
          const time = chordStartTime + (beat * secondsPerBeat) + swingOffset;
          events.piano.push({ time, notes: voicedNotes, duration: 1.5 * secondsPerBeat });
        });
      }

      // Pad - sustained
      if (enabledInstruments.pad) {
        events.pad.push({
          time: chordStartTime,
          notes: voicedNotes.map(n => n + 12),
          duration: beatsPerChord * secondsPerBeat * 0.9
        });
      }

      // Strings - sustained
      if (enabledInstruments.strings) {
        events.strings.push({
          time: chordStartTime,
          notes: voicedNotes,
          duration: beatsPerChord * secondsPerBeat * 0.9
        });
      }

      // Guitar - VARIED ARPEGGIATION (fixes the repetitive guitar problem!)
      if (enabledInstruments.guitar) {
        const arpNotes = guitarArpPattern.generate([...voicedNotes]);
        arpNotes.forEach((note, i) => {
          const noteTime = i * rhythmVar.guitar.speed;
          const swingOffset = (i % 2) * rhythmVar.guitar.swingAmount * rhythmVar.guitar.speed;
          events.guitar.push({
            time: chordStartTime + noteTime + swingOffset,
            note
          });
        });
      }

      // Bass - pattern
      if (enabledInstruments.bass) {
        const bassRoot = chord.bassNote || chord.notes[0] - 12;
        bassPattern.forEach(hit => {
          if (hit.beat < beatsPerChord) {
            events.bass.push({
              time: chordStartTime + (hit.beat * secondsPerBeat),
              note: bassRoot + (hit.interval || 0),
              duration: hit.duration * secondsPerBeat,
              subMix: variation.bass.subMix
            });
          }
        });
      }

      // Melody - from scale with rhythm variation
      if (enabledInstruments.melody) {
        rhythmVar.melody.pattern.forEach((beat, i) => {
          if (i < voicedNotes.length && Math.random() > 0.3) {
            const swingAmount = (i % 2 === 1) ? swing * secondsPerBeat : 0;
            events.melody.push({
              time: chordStartTime + (beat * secondsPerBeat) + swingAmount,
              note: voicedNotes[i % voicedNotes.length] + 12,
              duration: rhythmVar.melody.noteLength * secondsPerBeat
            });
          }
        });
      }

      // Drums
      if (enabledInstruments.drums) {
        // Kick
        drumPattern.kick.forEach(beat => {
          if (beat < beatsPerChord) {
            events.kick.push({ time: chordStartTime + (beat * secondsPerBeat) });
          }
        });

        // Snare
        drumPattern.snare.forEach(beat => {
          if (beat < beatsPerChord) {
            events.snare.push({ time: chordStartTime + (beat * secondsPerBeat) });
          }
        });

        // Hi-hat
        drumPattern.hihat.forEach(beat => {
          if (beat < beatsPerChord) {
            const swingAmount = (beat * 2) % 2 === 1 ? swing * 0.3 * secondsPerBeat : 0;
            events.hihat.push({ time: chordStartTime + (beat * secondsPerBeat) + swingAmount });
          }
        });

        // Open hat
        if (drumPattern.openHat) {
          drumPattern.openHat.forEach(beat => {
            if (beat < beatsPerChord) {
              events.openHat.push({ time: chordStartTime + (beat * secondsPerBeat) });
            }
          });
        }
      }

      // Schedule visual chord change
      transport.schedule((time) => {
        Tone.getDraw().schedule(() => {
          if (onChordChange) onChordChange(chordIdx);
        }, time);
      }, chordStartTime);
    });

    // Create and start Parts
    this.createParts(events);

    // Play custom samples if provided
    if (customSamples && customSamples.length > 0) {
      this.playCustomSamples(customSamples, chords.length * beatsPerChord * secondsPerBeat);
    }

    // Schedule end
    const totalTime = chords.length * beatsPerChord * secondsPerBeat;
    transport.schedule(() => {
      console.log('⏹️ Playback ended');
      this.stopAll();
    }, totalTime + 0.5);

    // Start transport
    console.log('🎵 Starting transport...');
    transport.start('+0.1');

    console.log(`✅ Playback started - Duration: ${totalTime.toFixed(2)}s`);
    return totalTime;

    } catch (error) {
      console.error('❌ Playback error:', error);
      this.stopAll();
      return 0;
    }
  }

  /**
   * Create Tone.Parts from events
   */
  createParts(events) {
    // Piano
    if (events.piano.length > 0) {
      this.parts.piano = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.piano.triggerAttackRelease(noteNames, event.duration, time, 0.7);
      }, events.piano).start(0);
    }

    // Pad
    if (events.pad.length > 0) {
      this.parts.pad = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.pad.triggerAttackRelease(noteNames, event.duration, time, 0.4);
      }, events.pad).start(0);
    }

    // Strings
    if (events.strings.length > 0) {
      this.parts.strings = new Tone.Part((time, event) => {
        const noteNames = event.notes.map(n => this.midiToNote(n));
        this.instruments.strings.triggerAttackRelease(noteNames, event.duration, time, 0.35);
      }, events.strings).start(0);
    }

    // Guitar
    if (events.guitar.length > 0) {
      this.parts.guitar = new Tone.Part((time, event) => {
        this.instruments.guitar.triggerAttack(this.midiToNote(event.note), time);
      }, events.guitar).start(0);
    }

    // Bass
    if (events.bass.length > 0) {
      this.parts.bass = new Tone.Part((time, event) => {
        this.instruments.bass.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, 0.8);
        // Add sub bass based on variation
        if (event.note < 48 && event.subMix > 0.4) {
          this.instruments.sub.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, event.subMix);
        }
      }, events.bass).start(0);
    }

    // Melody
    if (events.melody.length > 0) {
      this.parts.melody = new Tone.Part((time, event) => {
        this.instruments.lead.triggerAttackRelease(this.midiToNote(event.note), event.duration, time, 0.6);
      }, events.melody).start(0);
    }

    // Kick
    if (events.kick.length > 0) {
      this.parts.kick = new Tone.Part((time) => {
        this.instruments.kick.triggerAttackRelease('C1', '8n', time, 0.9);
      }, events.kick).start(0);
    }

    // Snare
    if (events.snare.length > 0) {
      this.parts.snare = new Tone.Part((time) => {
        this.instruments.snare.triggerAttackRelease('16n', time, 0.7);
      }, events.snare).start(0);
    }

    // Hi-hat
    if (events.hihat.length > 0) {
      this.parts.hihat = new Tone.Part((time) => {
        this.instruments.hihat.triggerAttackRelease('32n', time, 0.5);
      }, events.hihat).start(0);
    }

    // Open hat
    if (events.openHat.length > 0) {
      this.parts.openHat = new Tone.Part((time) => {
        this.instruments.openHat.triggerAttackRelease('32n', time, 0.5);
      }, events.openHat).start(0);
    }
  }

  /**
   * Play custom samples - Now fully implemented!
   */
  playCustomSamples(samples, totalDuration) {
    if (!samples || samples.length === 0) return;

    console.log(`🎵 Playing ${samples.length} custom samples over ${totalDuration}s`);

    const transport = Tone.getTransport();
    const beatsPerSample = totalDuration / samples.length;

    samples.forEach((sampleInfo, index) => {
      const startTime = index * beatsPerSample;

      // Schedule sample playback
      transport.schedule((time) => {
        try {
          const player = new Tone.Player({
            url: sampleInfo.buffer,
            loop: false,
            fadeIn: 0.01,
            fadeOut: 0.01
          }).connect(this.masterMixer);

          player.volume.value = -6;
          player.start(time);

          // Dispose player after playback
          setTimeout(() => {
            player.dispose();
          }, (sampleInfo.duration * 1000) + 100);

          console.log(`🎵 Playing sample: ${sampleInfo.name} at ${startTime}s`);
        } catch (error) {
          console.error(`❌ Error playing sample ${sampleInfo.name}:`, error);
        }
      }, startTime);
    });
  }

  /**
   * Stop all playback
   */
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

    // Stop sample sequencer
    this.sampleSequencer.stopAll();
  }

  /**
   * Dispose all instruments
   */
  disposeInstruments() {
    Object.values(this.instruments).forEach(inst => {
      if (inst && inst.dispose) {
        inst.dispose();
      }
    });

    Object.values(this.effects).forEach(fx => {
      if (fx && fx.dispose) {
        fx.dispose();
      }
    });

    this.instruments = {};
    this.effects = {};
  }

  /**
   * Get sample manager
   */
  getSampleManager() {
    return this.sampleManager;
  }
}

export const audioEngineAdvanced = new AdvancedRnBAudioEngine();
export default audioEngineAdvanced;
