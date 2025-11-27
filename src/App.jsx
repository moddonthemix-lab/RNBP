import React, { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import audioEngine from './audioEngine';
import { 
  CHORD_VOICINGS, ARTIST_PROGRESSIONS, getChordMidi, 
  getAllProgressions, NOTES, noteToMidi 
} from './chordLibrary';
import { DRUM_PATTERNS } from './musicData';
import { createMidiFile, downloadMidi } from './midiExport';

// Randomization helpers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Chord rhythm patterns
const CHORD_RHYTHMS = [
  { name: 'Sustained', pattern: [{ beat: 0, dur: 3.5 }] },
  { name: 'Half Notes', pattern: [{ beat: 0, dur: 1.8 }, { beat: 2, dur: 1.8 }] },
  { name: 'R&B Pump', pattern: [{ beat: 0, dur: 0.4 }, { beat: 0.5, dur: 0.4 }, { beat: 2, dur: 1.2 }, { beat: 3.5, dur: 0.4 }] },
  { name: 'Neo Soul Stabs', pattern: [{ beat: 0, dur: 0.3 }, { beat: 1, dur: 0.6 }, { beat: 2.5, dur: 0.3 }, { beat: 3, dur: 0.8 }] },
  { name: 'Gospel Bounce', pattern: [{ beat: 0, dur: 0.8 }, { beat: 1.5, dur: 0.4 }, { beat: 2, dur: 0.8 }, { beat: 3.5, dur: 0.4 }] },
  { name: 'Ballad Swell', pattern: [{ beat: 0, dur: 2.5 }, { beat: 3, dur: 0.8 }] },
  { name: 'Syncopated', pattern: [{ beat: 0, dur: 1.2 }, { beat: 1.5, dur: 0.8 }, { beat: 2.5, dur: 1.2 }] },
];

// Bass patterns
const BASS_PATTERNS = [
  { name: 'Root Hold', pattern: [{ beat: 0, interval: 0, dur: 3 }] },
  { name: 'Root-Fifth', pattern: [{ beat: 0, interval: 0, dur: 1.5 }, { beat: 2, interval: 7, dur: 1.5 }] },
  { name: 'Octave Bounce', pattern: [{ beat: 0, interval: 0, dur: 0.5 }, { beat: 0.75, interval: 12, dur: 0.5 }, { beat: 2, interval: 0, dur: 0.5 }, { beat: 2.75, interval: 12, dur: 0.5 }] },
  { name: 'Walking', pattern: [{ beat: 0, interval: 0, dur: 0.8 }, { beat: 1, interval: 4, dur: 0.8 }, { beat: 2, interval: 7, dur: 0.8 }, { beat: 3, interval: 5, dur: 0.8 }] },
  { name: 'Syncopated', pattern: [{ beat: 0, interval: 0, dur: 1 }, { beat: 1.5, interval: 0, dur: 0.4 }, { beat: 2.5, interval: 7, dur: 1 }] },
  { name: 'Trap 808', pattern: [{ beat: 0, interval: 0, dur: 2 }, { beat: 2.5, interval: 0, dur: 0.3 }, { beat: 3, interval: -5, dur: 0.8 }] },
];

export default function App() {
  // State
  const [selectedArtist, setSelectedArtist] = useState('sza');
  const [selectedProgIndex, setSelectedProgIndex] = useState(0);
  const [transpose, setTranspose] = useState(0);
  const [bpm, setBpm] = useState(82);
  const [swing, setSwing] = useState(0.15);
  const [reverbAmount, setReverbAmount] = useState(0.3);
  
  // Generated variations
  const [variations, setVariations] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(0);
  const [genCount, setGenCount] = useState(0);
  
  // Instrument toggles
  const [instruments, setInstruments] = useState({
    rhodes: true,
    wurli: false,
    pad: false,
    guitar: false,
    bass: true,
    melody: true,
    drums: true
  });
  
  // Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChordIdx, setCurrentChordIdx] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get current artist and progression
  const currentArtist = ARTIST_PROGRESSIONS[selectedArtist];
  const currentProg = currentArtist?.progressions[selectedProgIndex];

  // Generate variations
  const generateVariations = useCallback(() => {
    if (!currentProg) return;
    
    const newVariations = [];
    
    for (let v = 0; v < 6; v++) {
      const variation = {
        id: `${Date.now()}-${v}`,
        name: `Version ${v + 1}`,
        tempo: random(70, 95),
        swing: randomFloat(0.08, 0.22),
        chordRhythm: randomChoice(CHORD_RHYTHMS),
        bassPattern: randomChoice(BASS_PATTERNS),
        instrument: randomChoice(['rhodes', 'wurli', 'rhodes']),
        velocity: random(70, 95) / 100,
        chords: []
      };
      
      // Process each chord in the progression
      currentProg.chords.forEach((chordName, i) => {
        const chordData = getChordMidi(chordName);
        
        variation.chords.push({
          name: chordName,
          lh: chordData.lh,
          rh: chordData.rh,
          all: chordData.all,
          color: chordData.color,
          // Add variation - sometimes add extensions
          extended: Math.random() > 0.7
        });
      });
      
      newVariations.push(variation);
    }
    
    setVariations(newVariations);
    setSelectedVariation(0);
    setGenCount(prev => prev + 1);
  }, [currentProg]);

  // Generate on progression change
  useEffect(() => {
    generateVariations();
  }, [selectedArtist, selectedProgIndex]);

  // Init audio
  const initAudio = async () => {
    if (audioReady) return;
    setIsLoading(true);
    try {
      await audioEngine.init();
      setAudioReady(true);
    } catch (e) {
      console.error('Audio init failed:', e);
    }
    setIsLoading(false);
  };

  const currentVar = variations[selectedVariation];

  // Play/Stop
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      audioEngine.stopAll();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
      setCurrentChordIdx(-1);
      return;
    }

    if (!audioReady) await initAudio();
    if (!currentVar) return;

    setIsPlaying(true);
    
    const beatsPerChord = 4;
    const totalBeats = currentVar.chords.length * beatsPerChord;
    const usedSwing = currentVar.swing || swing;
    
    audioEngine.setBPM(currentVar.tempo || bpm);
    audioEngine.setReverb(reverbAmount);
    
    Tone.Transport.cancel();
    
    const drumPattern = DRUM_PATTERNS.trapSoul;
    const chordRhythm = currentVar.chordRhythm;
    const bassPattern = currentVar.bassPattern;
    const pianoInst = instruments.wurli ? 'wurli' : 'rhodes';

    currentVar.chords.forEach((chord, chordIdx) => {
      const startBeat = chordIdx * beatsPerChord;
      
      // Visual update
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => setCurrentChordIdx(chordIdx), time);
      }, `${startBeat}:0:0`);

      // CHORDS - Using split hand voicing for realism
      if (instruments.rhodes || instruments.wurli) {
        chordRhythm.pattern.forEach(hit => {
          const beatTime = startBeat + hit.beat;
          const swingOffset = hit.beat % 1 > 0.3 ? usedSwing * 0.2 : 0;
          
          Tone.Transport.schedule((time) => {
            // Play left hand (bass notes) and right hand (chord) separately
            audioEngine.playChordSplit(
              chord.lh,
              chord.rh,
              `${hit.dur}n`,
              pianoInst,
              time + (Math.random() - 0.5) * 0.01, // Humanize
              currentVar.velocity * (0.9 + Math.random() * 0.2)
            );
          }, `${Math.floor(beatTime)}:${((beatTime % 1) + swingOffset) * 4}:0`);
        });
      }

      // PAD
      if (instruments.pad) {
        Tone.Transport.schedule((time) => {
          audioEngine.playChord(chord.rh.map(n => n + 12), '1m', 'pad', time, 0.4);
        }, `${startBeat}:0:0`);
      }

      // GUITAR - Arpeggiate
      if (instruments.guitar) {
        const arpNotes = [...chord.rh].sort(() => Math.random() - 0.5);
        arpNotes.forEach((note, i) => {
          Tone.Transport.schedule((time) => {
            audioEngine.playNote(note, '4n', 'pluck', time, 0.6);
          }, `${startBeat}:${i * 0.4}:0`);
        });
      }

      // BASS
      if (instruments.bass) {
        const bassRoot = chord.lh[0]; // Use left hand root
        bassPattern.pattern.forEach(hit => {
          const beatTime = startBeat + hit.beat;
          const note = bassRoot + hit.interval;
          
          Tone.Transport.schedule((time) => {
            audioEngine.playBass(note, `${hit.dur}n`, time + (Math.random() - 0.5) * 0.008);
          }, `${Math.floor(beatTime)}:${(beatTime % 1) * 4}:0`);
        });
      }

      // MELODY - Generate simple melody from chord tones
      if (instruments.melody) {
        const melodyNotes = [...chord.rh, chord.rh[0] + 12].sort(() => Math.random() - 0.5).slice(0, 4);
        const melodyTimes = [0, 0.5, 1.5, 2.5].map(t => t + (Math.random() - 0.5) * 0.2);
        
        melodyNotes.forEach((note, i) => {
          if (Math.random() > 0.3) { // Don't play every note
            const swingTime = i % 2 === 1 ? usedSwing : 0;
            Tone.Transport.schedule((time) => {
              audioEngine.playNote(note + 12, '8n', 'lead', time, 0.5 + Math.random() * 0.2);
            }, `${startBeat + Math.floor(melodyTimes[i])}:${((melodyTimes[i] % 1) + swingTime) * 4}:0`);
          }
        });
      }

      // DRUMS
      if (instruments.drums) {
        drumPattern.kick.forEach(k => {
          if (k < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('kick', time + (Math.random() - 0.5) * 0.005);
            }, `${startBeat + Math.floor(k)}:${(k % 1) * 4}:0`);
          }
        });
        
        drumPattern.snare.forEach(s => {
          if (s < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('snare', time + (Math.random() - 0.5) * 0.008);
            }, `${startBeat + s}:0:0`);
          }
        });
        
        drumPattern.hihat.forEach(h => {
          if (h < beatsPerChord) {
            const swingHat = h % 0.5 > 0.2 ? usedSwing * 0.4 : 0;
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('hihat', time);
            }, `${startBeat + Math.floor(h)}:${((h % 1) + swingHat) * 4}:0`);
          }
        });
        
        drumPattern.openHat?.forEach(h => {
          if (h < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('openHat', time);
            }, `${startBeat + Math.floor(h)}:${(h % 1) * 4}:0`);
          }
        });
      }
    });

    // End
    Tone.Transport.schedule(() => {
      Tone.Transport.stop();
      setIsPlaying(false);
      setCurrentChordIdx(-1);
    }, `${totalBeats}:0:0`);

    Tone.Transport.start();
  }, [isPlaying, audioReady, currentVar, bpm, swing, instruments, reverbAmount]);

  // Export MIDI
  const exportMidi = useCallback((type) => {
    if (!currentVar) return;
    
    const beatsPerChord = 4;
    let notes = [];
    
    if (type === 'chords' || type === 'full') {
      currentVar.chords.forEach((chord, idx) => {
        const startBeat = idx * beatsPerChord;
        
        currentVar.chordRhythm.pattern.forEach(hit => {
          [...chord.lh, ...chord.rh].forEach(note => {
            notes.push({
              note,
              start: startBeat + hit.beat,
              duration: hit.dur,
              velocity: 80 + random(-10, 10),
              channel: 0
            });
          });
        });
      });
    }
    
    if (type === 'bass' || type === 'full') {
      currentVar.chords.forEach((chord, idx) => {
        const startBeat = idx * beatsPerChord;
        const bassRoot = chord.lh[0];
        
        currentVar.bassPattern.pattern.forEach(hit => {
          notes.push({
            note: bassRoot + hit.interval,
            start: startBeat + hit.beat,
            duration: hit.dur,
            velocity: 90 + random(-10, 10),
            channel: 1
          });
        });
      });
    }
    
    if (type === 'drums' || type === 'full') {
      const pattern = DRUM_PATTERNS.trapSoul;
      currentVar.chords.forEach((_, idx) => {
        const startBeat = idx * beatsPerChord;
        
        pattern.kick.forEach(k => {
          if (k < beatsPerChord) {
            notes.push({ note: 36, start: startBeat + k, duration: 0.25, velocity: 100, channel: 9 });
          }
        });
        pattern.snare.forEach(s => {
          if (s < beatsPerChord) {
            notes.push({ note: 38, start: startBeat + s, duration: 0.25, velocity: 90, channel: 9 });
          }
        });
        pattern.hihat.forEach(h => {
          if (h < beatsPerChord) {
            notes.push({ note: 42, start: startBeat + h, duration: 0.1, velocity: 60, channel: 9 });
          }
        });
      });
    }
    
    const midiData = createMidiFile(notes, currentVar.tempo || bpm, `rnb_${type}`);
    downloadMidi(midiData, `rnb_${selectedArtist}_${type}_v${selectedVariation + 1}.mid`);
  }, [currentVar, bpm, selectedArtist, selectedVariation]);

  const toggleInst = (key) => setInstruments(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', minHeight: '100vh' }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139,92,246,0.15), transparent)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(236,72,153,0.1), transparent)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 300, margin: 0,
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            R&B Producer Pro
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'rgba(232,228,240,0.5)', marginTop: '6px' }}>
            Real Voicings • Artist-Specific Chords • Professional Sound
          </p>
          
          {!audioReady && (
            <button onClick={initAudio} disabled={isLoading} style={enableBtn}>
              {isLoading ? 'Loading...' : '🎹 Enable Audio'}
            </button>
          )}
        </header>

        {/* Artist Selection */}
        <div style={{ ...panel, marginBottom: '16px' }}>
          <h3 style={label}>Select Artist Style</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.entries(ARTIST_PROGRESSIONS).map(([key, artist]) => (
              <button key={key} onClick={() => { setSelectedArtist(key); setSelectedProgIndex(0); }}
                style={{
                  ...artistBtn,
                  background: selectedArtist === key ? `${artist.color}30` : 'rgba(255,255,255,0.03)',
                  borderColor: selectedArtist === key ? artist.color : 'rgba(255,255,255,0.08)',
                  color: selectedArtist === key ? '#fff' : 'rgba(232,228,240,0.6)'
                }}>
                <div style={{ fontWeight: 600 }}>{artist.name}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{artist.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', marginBottom: '16px' }}>
          {/* Settings */}
          <div style={panel}>
            <h3 style={label}>Settings</h3>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={sliderLabel}>Tempo: <span style={{ color: '#f472b6' }}>{bpm} BPM</span></div>
              <input type="range" min="60" max="110" value={bpm} onChange={e => setBpm(+e.target.value)} style={{ width: '100%' }} />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={sliderLabel}>Swing: <span style={{ color: '#fb923c' }}>{Math.round(swing * 100)}%</span></div>
              <input type="range" min="0" max="0.35" step="0.01" value={swing} onChange={e => setSwing(+e.target.value)} style={{ width: '100%' }} />
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div style={sliderLabel}>Reverb: <span style={{ color: '#22d3ee' }}>{Math.round(reverbAmount * 100)}%</span></div>
              <input type="range" min="0" max="0.6" step="0.05" value={reverbAmount} onChange={e => setReverbAmount(+e.target.value)} style={{ width: '100%' }} />
            </div>
          </div>

          {/* Progressions */}
          <div style={panel}>
            <h3 style={label}>{currentArtist?.name} Progressions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {currentArtist?.progressions.map((prog, i) => (
                <button key={prog.name} onClick={() => setSelectedProgIndex(i)}
                  style={{
                    ...progBtn,
                    background: selectedProgIndex === i ? `${currentArtist.color}25` : 'rgba(255,255,255,0.02)',
                    borderColor: selectedProgIndex === i ? `${currentArtist.color}60` : 'transparent'
                  }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '2px' }}>{prog.name}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{prog.description}</div>
                  <div style={{ fontSize: '0.6rem', color: currentArtist.color, marginTop: '4px' }}>
                    {prog.chords.join(' → ')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={panel}>
            <h3 style={label}>Current Variation</h3>
            {currentVar && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(232,228,240,0.5)', lineHeight: 1.8 }}>
                <div>Tempo: <span style={{ color: '#f472b6' }}>{currentVar.tempo} BPM</span></div>
                <div>Swing: <span style={{ color: '#fb923c' }}>{Math.round(currentVar.swing * 100)}%</span></div>
                <div>Chord Rhythm: <span style={{ color: '#c084fc' }}>{currentVar.chordRhythm.name}</span></div>
                <div>Bass Pattern: <span style={{ color: '#22c55e' }}>{currentVar.bassPattern.name}</span></div>
                <div>Piano: <span style={{ color: '#6366f1' }}>{currentVar.instrument}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Variations */}
        <div style={{ ...panel, marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ ...label, margin: 0 }}>Generated Variations <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>(#{genCount})</span></h3>
            <button onClick={generateVariations} style={regenBtn}>🎲 Regenerate</button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {variations.map((v, i) => (
              <button key={v.id} onClick={() => setSelectedVariation(i)}
                style={{
                  ...varBtn,
                  background: selectedVariation === i ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))' : 'rgba(255,255,255,0.02)',
                  borderColor: selectedVariation === i ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.05)'
                }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{v.name}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{v.tempo} BPM</div>
                <div style={{ fontSize: '0.55rem', opacity: 0.4 }}>{v.chordRhythm.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Instruments */}
        <div style={{ ...panel, marginBottom: '16px' }}>
          <h3 style={{ ...label, marginBottom: '12px' }}>Instruments</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { key: 'rhodes', label: '🎹 Rhodes', color: '#8b5cf6' },
              { key: 'wurli', label: '🎹 Wurlitzer', color: '#6366f1' },
              { key: 'pad', label: '🎛️ Pad', color: '#14b8a6' },
              { key: 'guitar', label: '🎸 Guitar', color: '#22c55e' },
              { key: 'bass', label: '🎸 Bass', color: '#f97316' },
              { key: 'melody', label: '🎵 Melody', color: '#ec4899' },
              { key: 'drums', label: '🥁 Drums', color: '#ef4444' },
            ].map(inst => (
              <button key={inst.key} onClick={() => toggleInst(inst.key)}
                style={{
                  ...instBtn,
                  borderColor: instruments[inst.key] ? inst.color : 'rgba(255,255,255,0.08)',
                  background: instruments[inst.key] ? `${inst.color}15` : 'transparent',
                  color: instruments[inst.key] ? inst.color : 'rgba(232,228,240,0.4)'
                }}>
                {inst.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Display */}
        {currentVar && (
          <div style={{ ...panel, padding: '24px', marginBottom: '16px' }}>
            <h3 style={{ ...label, textAlign: 'center', marginBottom: '16px' }}>
              {currentProg?.name} — {currentVar.name}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentVar.chords.length}, 1fr)`, gap: '12px', marginBottom: '24px' }}>
              {currentVar.chords.map((chord, i) => (
                <div key={i} className={currentChordIdx === i ? 'playing' : ''}
                  style={{
                    padding: '16px 12px',
                    borderRadius: '12px',
                    background: currentChordIdx === i ? `${chord.color}35` : 'rgba(255,255,255,0.02)',
                    border: currentChordIdx === i ? `2px solid ${chord.color}` : '2px solid transparent',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    transform: currentChordIdx === i ? 'scale(1.04)' : 'scale(1)'
                  }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 600, color: chord.color, marginBottom: '6px' }}>
                    {chord.name}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(232,228,240,0.3)', fontFamily: 'monospace' }}>
                    <div>LH: {chord.lh.map(n => NOTES[n % 12]).join(' ')}</div>
                    <div>RH: {chord.rh.map(n => NOTES[n % 12]).join(' ')}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={togglePlay} disabled={!audioReady}
                style={{
                  ...playBtn,
                  background: isPlaying ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  opacity: audioReady ? 1 : 0.5
                }}>
                {isPlaying ? '■ Stop' : '▶ Play'}
              </button>
              <button onClick={generateVariations} style={shuffleBtn}>🔀 New Variations</button>
            </div>
          </div>
        )}

        {/* Export */}
        <div style={panel}>
          <h3 style={{ ...label, textAlign: 'center', marginBottom: '14px' }}>Export MIDI</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { type: 'chords', label: 'Chords', color: '#8b5cf6' },
              { type: 'bass', label: 'Bass', color: '#f97316' },
              { type: 'drums', label: 'Drums', color: '#ef4444' },
              { type: 'full', label: 'Full Track', color: '#22c55e' },
            ].map(exp => (
              <button key={exp.type} onClick={() => exportMidi(exp.type)}
                style={{ ...exportBtn, borderColor: `${exp.color}40`, background: `${exp.color}12`, color: exp.color }}>
                {exp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const panel = { background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)' };
const label = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(232,228,240,0.35)', marginBottom: '10px' };
const sliderLabel = { fontSize: '0.8rem', color: 'rgba(232,228,240,0.6)', marginBottom: '4px' };

const enableBtn = { marginTop: '12px', padding: '10px 28px', borderRadius: '24px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.15)', color: '#c084fc', fontSize: '0.85rem', cursor: 'pointer' };
const artistBtn = { padding: '10px 16px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', minWidth: '140px' };
const progBtn = { padding: '10px', borderRadius: '10px', border: '1px solid transparent', cursor: 'pointer', textAlign: 'left', color: '#e8e4f0', transition: 'all 0.12s' };
const varBtn = { padding: '12px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', textAlign: 'center', color: '#e8e4f0', transition: 'all 0.15s' };
const instBtn = { padding: '8px 14px', borderRadius: '8px', border: '1px solid', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s' };
const playBtn = { padding: '14px 48px', borderRadius: '30px', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' };
const shuffleBtn = { padding: '14px 24px', borderRadius: '30px', border: '1px solid rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.1)', color: '#c084fc', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' };
const regenBtn = { padding: '6px 16px', borderRadius: '16px', border: '1px solid rgba(251,146,60,0.4)', background: 'rgba(251,146,60,0.1)', color: '#fb923c', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' };
const exportBtn = { padding: '10px 22px', borderRadius: '8px', border: '1px solid', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' };
