/**
 * Sample Loading & Playback System
 * Multi-Platinum Quality Custom Sample Support
 */
import * as Tone from 'tone';

/**
 * Sample Manager - Load and manage custom samples
 */
export class SampleManager {
  constructor() {
    this.samples = {
      kick: [],
      snare: [],
      hihat: [],
      perc: [],
      melody: [],
      chord: [],
      fx: [],
      vocal: []
    };

    this.players = {};
    this.samplers = {};
  }

  /**
   * Load a sample from file
   */
  async loadSample(file, category = 'melody') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target.result;
          const audioContext = Tone.getContext().rawContext;
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          const sampleData = {
            id: Date.now() + Math.random(),
            name: file.name,
            buffer: audioBuffer,
            category,
            duration: audioBuffer.duration,
            sampleRate: audioBuffer.sampleRate
          };

          this.samples[category].push(sampleData);
          resolve(sampleData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Load multiple samples at once
   */
  async loadSamples(files, category = 'melody') {
    const promises = Array.from(files).map(file => this.loadSample(file, category));
    return Promise.all(promises);
  }

  /**
   * Create a player for a sample
   */
  createPlayer(sampleId, category = 'melody') {
    const sample = this.samples[category].find(s => s.id === sampleId);
    if (!sample) return null;

    const player = new Tone.Player({
      url: sample.buffer,
      loop: false,
      fadeIn: 0.01,
      fadeOut: 0.01
    });

    return player;
  }

  /**
   * Create a sampler from loaded samples (for melodic playback)
   */
  createSampler(sampleId, category = 'melody', baseNote = 'C3') {
    const sample = this.samples[category].find(s => s.id === sampleId);
    if (!sample) return null;

    const sampler = new Tone.Sampler({
      urls: {
        [baseNote]: sample.buffer
      },
      release: 1,
      baseUrl: ''
    });

    return sampler;
  }

  /**
   * Create a one-shot player (for drums/percussion)
   */
  createOneShot(sampleId, category = 'kick') {
    const sample = this.samples[category].find(s => s.id === sampleId);
    if (!sample) return null;

    const player = new Tone.Player(sample.buffer);
    player.volume.value = -6;

    return player;
  }

  /**
   * Get all samples in a category
   */
  getSamples(category) {
    return this.samples[category] || [];
  }

  /**
   * Remove a sample
   */
  removeSample(sampleId, category) {
    const index = this.samples[category].findIndex(s => s.id === sampleId);
    if (index !== -1) {
      this.samples[category].splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Clear all samples in a category
   */
  clearCategory(category) {
    this.samples[category] = [];
  }

  /**
   * Clear all samples
   */
  clearAll() {
    Object.keys(this.samples).forEach(category => {
      this.samples[category] = [];
    });
  }

  /**
   * Get sample info
   */
  getSampleInfo(sampleId, category) {
    return this.samples[category].find(s => s.id === sampleId);
  }
}

/**
 * Sample Sequencer - Sequence samples in time
 */
export class SampleSequencer {
  constructor(sampleManager) {
    this.sampleManager = sampleManager;
    this.parts = [];
  }

  /**
   * Schedule a sample to play
   */
  scheduleSample(sampleId, category, time, destination, pitch = 0, velocity = 1.0) {
    const sample = this.sampleManager.getSampleInfo(sampleId, category);
    if (!sample) return;

    const player = new Tone.Player(sample.buffer);
    player.connect(destination);
    player.volume.value = Tone.gainToDb(velocity);

    if (pitch !== 0) {
      player.playbackRate = Math.pow(2, pitch / 12);
    }

    player.start(time);

    return player;
  }

  /**
   * Create a sample part for rhythmic playback
   */
  createSamplePart(sampleId, category, pattern, destination, loop = false) {
    const sample = this.sampleManager.getSampleInfo(sampleId, category);
    if (!sample) return null;

    // Pattern: [{ time: '0:0:0', pitch: 0, velocity: 1.0 }, ...]
    const part = new Tone.Part((time, event) => {
      const player = new Tone.Player(sample.buffer);
      player.connect(destination);
      player.volume.value = Tone.gainToDb(event.velocity || 1.0);

      if (event.pitch && event.pitch !== 0) {
        player.playbackRate = Math.pow(2, event.pitch / 12);
      }

      player.start(time);

      // Dispose player after playback
      setTimeout(() => {
        player.dispose();
      }, (sample.duration * 1000) + 100);
    }, pattern);

    if (loop) {
      part.loop = true;
      part.loopEnd = '4m'; // 4 bars
    }

    this.parts.push(part);
    return part;
  }

  /**
   * Stop all parts
   */
  stopAll() {
    this.parts.forEach(part => {
      part.stop();
      part.dispose();
    });
    this.parts = [];
  }
}

/**
 * Sample slicer - Slice samples into parts
 */
export const sliceSample = (audioBuffer, numSlices = 8) => {
  const slices = [];
  const sliceLength = audioBuffer.duration / numSlices;

  for (let i = 0; i < numSlices; i++) {
    const startTime = i * sliceLength;
    const endTime = (i + 1) * sliceLength;

    slices.push({
      index: i,
      start: startTime,
      end: endTime,
      duration: sliceLength
    });
  }

  return slices;
};

/**
 * Detect tempo of sample (basic implementation)
 */
export const detectTempo = (audioBuffer, options = {}) => {
  // This is a simplified tempo detection
  // For production use, you'd want a more sophisticated algorithm

  const {
    minTempo = 60,
    maxTempo = 180,
    sensitivity = 0.5
  } = options;

  // Analyze the audio buffer to find peaks
  const channelData = audioBuffer.getChannelData(0);
  const peaks = [];
  const threshold = sensitivity;

  for (let i = 0; i < channelData.length; i++) {
    if (Math.abs(channelData[i]) > threshold) {
      peaks.push(i);
      // Skip ahead to avoid counting same peak multiple times
      i += Math.floor(audioBuffer.sampleRate * 0.1);
    }
  }

  // Calculate average time between peaks
  if (peaks.length < 2) return null;

  const intervals = [];
  for (let i = 1; i < peaks.length; i++) {
    const timeBetween = (peaks[i] - peaks[i - 1]) / audioBuffer.sampleRate;
    intervals.push(timeBetween);
  }

  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const bpm = 60 / avgInterval;

  // Ensure BPM is within reasonable range
  if (bpm >= minTempo && bpm <= maxTempo) {
    return Math.round(bpm);
  } else if (bpm < minTempo) {
    // Try doubling if too slow
    return Math.round(bpm * 2);
  } else {
    // Try halving if too fast
    return Math.round(bpm / 2);
  }
};

/**
 * Pitch shift a sample
 */
export const pitchShiftSample = (semitones) => {
  return Math.pow(2, semitones / 12);
};

/**
 * Time stretch a sample (using Tone.js built-in)
 */
export const createTimeStretchPlayer = (audioBuffer, stretchFactor = 1.0) => {
  const player = new Tone.Player(audioBuffer);
  player.playbackRate = 1 / stretchFactor; // Inverse for time stretch
  return player;
};

export default {
  SampleManager,
  SampleSequencer,
  sliceSample,
  detectTempo,
  pitchShiftSample,
  createTimeStretchPlayer
};
