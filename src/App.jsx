import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import audioEngine from './audioEngine';
import {
  NOTES, CHORD_TYPES, RNB_PROGRESSIONS, SCALES, MELODY_PATTERNS,
  DRUM_PATTERNS, CATEGORIES, parseNumeral, generateChordMidi,
  midiToNoteName, generateMelody
} from './musicData';
import {
  generateMultipleArrangements, generateArrangement,
  CHORD_RHYTHMS, BASS_PATTERNS, VOICINGS,
  humanize, humanizeVelocity
} from './advancedGenerator';
import {
  createMidiFile, downloadMidi
} from './midiExport';

export default function App() {
  // Core settings
  const [key, setKey] = useState(0);
  const [bpm, setBpm] = useState(85);
  const [selectedProgression, setSelectedProgression] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScale, setSelectedScale] = useState('pentatonicMinor');
  const [selectedDrumPattern, setSelectedDrumPattern] = useState('trapSoul');
  const [reverbAmount, setReverbAmount] = useState(0.3);
  const [variationLevel, setVariationLevel] = useState(0.5);
  
  // Instrument toggles
  const [instruments, setInstruments] = useState({
    piano: true,
    pad: false,
    guitar: false,
    bass: true,
    melody: true,
    drums: true
  });
  
  // Generated content
  const [arrangements, setArrangements] = useState([]);
  const [selectedArrangement, setSelectedArrangement] = useState(0);
  const [generationCount, setGenerationCount] = useState(0);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);

  // Filter progressions
  const filteredProgressions = selectedCategory === 'all'
    ? RNB_PROGRESSIONS
    : RNB_PROGRESSIONS.filter(p => p.category === selectedCategory);

  const currentProgression = RNB_PROGRESSIONS[selectedProgression];

  // Generate new arrangements
  const generateNew = useCallback(() => {
    if (!currentProgression) return;
    
    const newArrangements = generateMultipleArrangements(
      currentProgression, 
      key, 
      6, 
      { 
        variationLevel,
        scale: selectedScale,
      }
    );
    
    setArrangements(newArrangements);
    setSelectedArrangement(0);
    setGenerationCount(prev => prev + 1);
  }, [currentProgression, key, variationLevel, selectedScale]);

  // Generate on settings change
  useEffect(() => {
    generateNew();
  }, [selectedProgression, key]);

  // Initialize audio
  const initAudio = async () => {
    if (audioReady) return;
    setIsLoading(true);
    try {
      await audioEngine.init();
      setAudioReady(true);
    } catch (err) {
      console.error('Failed to init audio:', err);
    }
    setIsLoading(false);
  };

  // Get current arrangement
  const currentArr = arrangements[selectedArrangement];

  // Play/Stop
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      audioEngine.stopAll();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
      setCurrentChordIndex(-1);
      return;
    }

    if (!audioReady) await initAudio();
    if (!currentArr) return;

    setIsPlaying(true);
    
    const beatsPerChord = 4;
    const totalBeats = currentArr.chords.length * beatsPerChord;
    const swing = currentArr.swing || 0.15;
    
    audioEngine.setBPM(currentArr.tempo || bpm);
    audioEngine.setReverb(reverbAmount);
    
    Tone.Transport.cancel();
    
    const drumPattern = DRUM_PATTERNS[selectedDrumPattern];
    const chordRhythm = currentArr.chordRhythm || CHORD_RHYTHMS[0];
    const bassPattern = currentArr.bassPattern || BASS_PATTERNS[0];

    currentArr.chords.forEach((chord, chordIndex) => {
      const chordStartBeats = chordIndex * beatsPerChord;
      
      // Visual indicator
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => setCurrentChordIndex(chordIndex), time);
      }, `${chordStartBeats}:0:0`);

      // Play chords with rhythm pattern
      if (instruments.piano) {
        chordRhythm.pattern.forEach(hit => {
          const beatTime = chordStartBeats + hit.beat;
          const swingOffset = hit.beat % 1 > 0.4 ? swing * 0.25 : 0;
          
          Tone.Transport.schedule((time) => {
            audioEngine.playChord(
              chord.midiNotes, 
              `${hit.duration * 0.9}n`, 
              'piano', 
              humanize(time, 0.01), 
              humanizeVelocity(currentArr.velocity || 80) / 127
            );
          }, `${Math.floor(beatTime)}:${((beatTime % 1) + swingOffset) * 4}:0`);
        });
      }

      if (instruments.pad) {
        Tone.Transport.schedule((time) => {
          audioEngine.playChord(
            chord.midiNotes.map(n => n + 12), 
            '1m', 
            'pad', 
            time, 
            0.35
          );
        }, `${chordStartBeats}:0:0`);
      }

      if (instruments.guitar) {
        // Arpeggiate with rhythm
        const arpTimes = [0, 0.15, 0.3, 0.45];
        chord.midiNotes.slice(0, 4).forEach((note, i) => {
          Tone.Transport.schedule((time) => {
            audioEngine.playNote(note + 12, '4n', 'guitar', time, 0.55);
          }, `${chordStartBeats}:${arpTimes[i] * 4}:0`);
        });
      }

      // Bass with pattern
      if (instruments.bass) {
        const bassRoot = chord.root + 36;
        bassPattern.pattern.forEach(hit => {
          const beatTime = chordStartBeats + hit.beat;
          const note = bassRoot + hit.interval;
          
          Tone.Transport.schedule((time) => {
            audioEngine.playBass(note, `${hit.duration}n`, humanize(time, 0.008));
          }, `${Math.floor(beatTime)}:${(beatTime % 1) * 4}:0`);
        });
      }

      // Melody
      if (instruments.melody && currentArr.melodies && currentArr.melodies[chordIndex]) {
        const melody = currentArr.melodies[chordIndex];
        melody.notes.forEach((note, i) => {
          const beatOffset = melody.rhythm[i] || i * 0.5;
          const swingOffset = i % 2 === 1 ? swing : 0;
          const totalOffset = beatOffset + swingOffset;
          
          Tone.Transport.schedule((time) => {
            audioEngine.playNote(
              note, 
              '8n', 
              'lead', 
              humanize(time, 0.015), 
              humanizeVelocity(85) / 127
            );
          }, `${chordStartBeats + Math.floor(totalOffset)}:${(totalOffset % 1) * 4}:0`);
        });
      }

      // Drums
      if (instruments.drums) {
        // Kick
        drumPattern.kick.forEach(k => {
          if (k < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('kick', humanize(time, 0.005));
            }, `${chordStartBeats + Math.floor(k)}:${(k % 1) * 4}:0`);
          }
        });
        
        // Snare
        drumPattern.snare.forEach(s => {
          if (s < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('snare', humanize(time, 0.008));
            }, `${chordStartBeats + s}:0:0`);
          }
        });
        
        // Hi-hats
        drumPattern.hihat.forEach(h => {
          if (h < beatsPerChord) {
            const swingHat = h % 0.5 > 0.2 ? swing * 0.5 : 0;
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('hihat', time);
            }, `${chordStartBeats + Math.floor(h)}:${((h % 1) + swingHat) * 4}:0`);
          }
        });
        
        drumPattern.openHat.forEach(h => {
          if (h < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('openHat', time);
            }, `${chordStartBeats + Math.floor(h)}:${(h % 1) * 4}:0`);
          }
        });
      }
    });

    // End
    Tone.Transport.schedule(() => {
      Tone.Transport.stop();
      setIsPlaying(false);
      setCurrentChordIndex(-1);
    }, `${totalBeats}:0:0`);

    Tone.Transport.start();
  }, [isPlaying, audioReady, currentArr, bpm, instruments, selectedDrumPattern, reverbAmount]);

  // Export MIDI
  const exportMidi = useCallback((type) => {
    if (!currentArr) return;
    
    const beatsPerChord = 4;
    let notes = [];
    
    if (type === 'chords' || type === 'full') {
      currentArr.chords.forEach((chord, idx) => {
        const startBeat = idx * beatsPerChord;
        const rhythm = currentArr.chordRhythm || CHORD_RHYTHMS[0];
        
        rhythm.pattern.forEach(hit => {
          chord.midiNotes.forEach(note => {
            notes.push({
              note,
              start: startBeat + hit.beat,
              duration: hit.duration * 0.9,
              velocity: humanizeVelocity(80),
              channel: 0
            });
          });
        });
      });
    }
    
    if (type === 'melody' || type === 'full') {
      if (currentArr.melodies) {
        currentArr.melodies.forEach((melody, idx) => {
          const startBeat = idx * beatsPerChord;
          melody.notes.forEach((note, i) => {
            notes.push({
              note,
              start: startBeat + (melody.rhythm[i] || i * 0.5),
              duration: 0.4,
              velocity: humanizeVelocity(90),
              channel: 1
            });
          });
        });
      }
    }
    
    if (type === 'bass' || type === 'full') {
      const pattern = currentArr.bassPattern || BASS_PATTERNS[0];
      currentArr.chords.forEach((chord, idx) => {
        const startBeat = idx * beatsPerChord;
        const bassRoot = chord.root + 36;
        
        pattern.pattern.forEach(hit => {
          notes.push({
            note: bassRoot + hit.interval,
            start: startBeat + hit.beat,
            duration: hit.duration,
            velocity: humanizeVelocity(95),
            channel: 2
          });
        });
      });
    }
    
    if (type === 'drums' || type === 'full') {
      const pattern = DRUM_PATTERNS[selectedDrumPattern];
      currentArr.chords.forEach((_, idx) => {
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
    
    const midiData = createMidiFile(notes, currentArr.tempo || bpm, `rnb_${type}_${NOTES[key]}`);
    downloadMidi(midiData, `rnb_${type}_${NOTES[key]}_${currentArr.tempo || bpm}bpm_v${selectedArrangement + 1}.mid`);
  }, [currentArr, key, bpm, selectedDrumPattern, selectedArrangement]);

  const toggleInstrument = (inst) => {
    setInstruments(prev => ({ ...prev, [inst]: !prev[inst] }));
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Ambient backgrounds */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.15), transparent)',
        pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'radial-gradient(ellipse 60% 40% at 80% 100%, rgba(236, 72, 153, 0.1), transparent)',
        pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            margin: 0,
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            R&B Producer Pro
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'rgba(232, 228, 240, 0.5)', marginTop: '8px' }}>
            Advanced Generation • Unique Variations Every Time • MIDI Export
          </p>
          
          {!audioReady && (
            <button onClick={initAudio} disabled={isLoading} style={enableAudioBtn}>
              {isLoading ? 'Loading Instruments...' : '🎹 Click to Enable Audio'}
            </button>
          )}
        </header>

        {/* Main Controls Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', marginBottom: '20px' }}>
          
          {/* Key, BPM, Variation */}
          <div style={panelStyle}>
            <h3 style={labelStyle}>Settings</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={smallLabel}>Key: <span style={{ color: '#c084fc' }}>{NOTES[key]}</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                {NOTES.map((note, i) => (
                  <button key={note} onClick={() => setKey(i)} style={{
                    ...keyBtn, 
                    background: key === i ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)',
                    color: key === i ? '#fff' : 'rgba(232,228,240,0.5)'
                  }}>
                    {note}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={smallLabel}>Variation: <span style={{ color: '#fb923c' }}>{Math.round(variationLevel * 100)}%</span></label>
              <input type="range" min="0" max="1" step="0.1" value={variationLevel} 
                onChange={(e) => setVariationLevel(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={smallLabel}>Reverb: <span style={{ color: '#22d3ee' }}>{Math.round(reverbAmount * 100)}%</span></label>
              <input type="range" min="0" max="0.8" step="0.05" value={reverbAmount}
                onChange={(e) => setReverbAmount(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            
            <div>
              <label style={smallLabel}>Scale</label>
              <select value={selectedScale} onChange={(e) => setSelectedScale(e.target.value)} style={selectStyle}>
                {Object.entries(SCALES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
          </div>

          {/* Progression Selector */}
          <div style={panelStyle}>
            <h3 style={labelStyle}>Chord Progression</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedProgression(0); }}
                  style={{
                    ...catBtn,
                    border: selectedCategory === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.08)',
                    background: selectedCategory === cat.id ? `${cat.color}20` : 'transparent',
                    color: selectedCategory === cat.id ? cat.color : 'rgba(232,228,240,0.4)'
                  }}>
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', maxHeight: '180px', overflowY: 'auto' }}>
              {filteredProgressions.map((prog) => {
                const isSelected = RNB_PROGRESSIONS[selectedProgression]?.name === prog.name;
                return (
                  <button key={prog.name} onClick={() => setSelectedProgression(RNB_PROGRESSIONS.indexOf(prog))}
                    style={{
                      ...progBtn,
                      background: isSelected ? `${prog.color}25` : 'rgba(255,255,255,0.02)',
                      border: isSelected ? `1px solid ${prog.color}50` : '1px solid transparent',
                      color: isSelected ? '#fff' : 'rgba(232,228,240,0.6)'
                    }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '0.75rem' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: prog.color }} />
                      {prog.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drums & Patterns */}
          <div style={panelStyle}>
            <h3 style={labelStyle}>Rhythm</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={smallLabel}>Drum Pattern</label>
              <select value={selectedDrumPattern} onChange={(e) => setSelectedDrumPattern(e.target.value)} style={selectStyle}>
                {Object.entries(DRUM_PATTERNS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </div>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={smallLabel}>Tempo: <span style={{ color: '#f472b6' }}>{currentArr?.tempo || bpm} BPM</span></label>
              <input type="range" min="60" max="120" value={bpm} 
                onChange={(e) => setBpm(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            
            {currentArr && (
              <div style={{ fontSize: '0.7rem', color: 'rgba(232,228,240,0.4)', marginTop: '12px' }}>
                <div>Chord Rhythm: {currentArr.chordRhythm?.name}</div>
                <div>Bass Pattern: {currentArr.bassPattern?.name}</div>
                <div>Swing: {Math.round((currentArr.swing || 0) * 100)}%</div>
              </div>
            )}
          </div>
        </div>

        {/* Generated Variations */}
        <div style={{ ...panelStyle, marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ ...labelStyle, margin: 0 }}>
              Generated Variations 
              <span style={{ marginLeft: '10px', fontSize: '0.65rem', color: 'rgba(232,228,240,0.3)' }}>
                (#{generationCount})
              </span>
            </h3>
            <button onClick={generateNew} style={regenerateBtn}>
              🎲 Regenerate All
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {arrangements.map((arr, i) => (
              <button key={arr.id} onClick={() => setSelectedArrangement(i)}
                style={{
                  ...variationBtn,
                  background: selectedArrangement === i ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(236,72,153,0.2))' : 'rgba(255,255,255,0.02)',
                  border: selectedArrangement === i ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.05)',
                }}>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '4px' }}>{arr.name}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.5 }}>{arr.tempo} BPM</div>
                <div style={{ fontSize: '0.6rem', opacity: 0.4, marginTop: '2px' }}>{arr.chordRhythm?.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Instrument Mixer */}
        <div style={{ ...panelStyle, marginBottom: '20px' }}>
          <h3 style={{ ...labelStyle, marginBottom: '14px' }}>Instrument Mixer</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { key: 'piano', label: '🎹 Piano', color: '#8b5cf6' },
              { key: 'pad', label: '🎛️ Pad', color: '#6366f1' },
              { key: 'guitar', label: '🎸 Guitar', color: '#22c55e' },
              { key: 'bass', label: '🎸 Bass', color: '#f97316' },
              { key: 'melody', label: '🎵 Melody', color: '#ec4899' },
              { key: 'drums', label: '🥁 Drums', color: '#ef4444' },
            ].map(inst => (
              <button key={inst.key} onClick={() => toggleInstrument(inst.key)}
                style={{
                  ...instBtn,
                  border: instruments[inst.key] ? `1px solid ${inst.color}` : '1px solid rgba(255,255,255,0.08)',
                  background: instruments[inst.key] ? `${inst.color}15` : 'rgba(255,255,255,0.02)',
                  color: instruments[inst.key] ? inst.color : 'rgba(232,228,240,0.3)',
                }}>
                {inst.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Display */}
        {currentArr && (
          <div style={{ ...panelStyle, marginBottom: '20px', padding: '24px' }}>
            <h3 style={{ ...labelStyle, textAlign: 'center', marginBottom: '16px' }}>
              {currentProgression?.name} in {NOTES[key]} — {currentArr.name}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${currentArr.chords.length}, 1fr)`, gap: '12px', marginBottom: '24px' }}>
              {currentArr.chords.map((chord, i) => (
                <div key={i} className={currentChordIndex === i ? 'playing' : ''}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: currentChordIndex === i ? `${chord.color}30` : 'rgba(255,255,255,0.02)',
                    border: currentChordIndex === i ? `2px solid ${chord.color}` : '2px solid transparent',
                    textAlign: 'center',
                    transition: 'all 0.15s',
                    transform: currentChordIndex === i ? 'scale(1.03)' : 'scale(1)'
                  }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 600, color: chord.color }}>{chord.rootName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(232,228,240,0.5)', marginBottom: '6px' }}>{chord.typeName}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(232,228,240,0.25)', fontFamily: 'monospace' }}>
                    {chord.midiNotes.map(n => midiToNoteName(n)).join(' ')}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: 'rgba(232,228,240,0.2)', marginTop: '4px' }}>
                    {chord.voicing && VOICINGS[chord.voicing]?.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Playback */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button onClick={togglePlay} disabled={!audioReady}
                style={{
                  ...playBtn,
                  background: isPlaying ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                  boxShadow: isPlaying ? '0 6px 24px rgba(239,68,68,0.4)' : '0 6px 24px rgba(139,92,246,0.4)',
                  opacity: audioReady ? 1 : 0.5
                }}>
                {isPlaying ? '■ Stop' : '▶ Play'}
              </button>
              
              <button onClick={generateNew} style={shuffleBtn}>
                🔀 New Variations
              </button>
            </div>
          </div>
        )}

        {/* Export */}
        <div style={{ ...panelStyle, marginBottom: '20px' }}>
          <h3 style={{ ...labelStyle, textAlign: 'center', marginBottom: '16px' }}>Export MIDI</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {[
              { type: 'chords', label: 'Chords', color: '#8b5cf6' },
              { type: 'melody', label: 'Melody', color: '#ec4899' },
              { type: 'bass', label: 'Bass', color: '#f97316' },
              { type: 'drums', label: 'Drums', color: '#ef4444' },
              { type: 'full', label: 'Full Track', color: '#22c55e' },
            ].map(exp => (
              <button key={exp.type} onClick={() => exportMidi(exp.type)}
                style={{ ...exportBtn, borderColor: `${exp.color}40`, background: `${exp.color}10`, color: exp.color }}>
                {exp.label}
              </button>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: 'rgba(232,228,240,0.3)' }}>
            Each variation exports unique MIDI • Drag into your DAW
          </p>
        </div>

        {/* Quick Info */}
        {currentArr && (
          <div style={{ ...panelStyle, padding: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '0.75rem' }}>
              <div>
                <div style={{ color: 'rgba(232,228,240,0.4)', marginBottom: '4px' }}>Chord Voicings</div>
                <div style={{ color: '#c084fc' }}>{currentArr.chords.map(c => VOICINGS[c.voicing]?.name || 'Close').join(', ')}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(232,228,240,0.4)', marginBottom: '4px' }}>Chord Rhythm</div>
                <div style={{ color: '#f472b6' }}>{currentArr.chordRhythm?.name}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(232,228,240,0.4)', marginBottom: '4px' }}>Bass Pattern</div>
                <div style={{ color: '#fb923c' }}>{currentArr.bassPattern?.name}</div>
              </div>
              <div>
                <div style={{ color: 'rgba(232,228,240,0.4)', marginBottom: '4px' }}>Swing Amount</div>
                <div style={{ color: '#22d3ee' }}>{Math.round((currentArr.swing || 0) * 100)}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const panelStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  borderRadius: '14px',
  padding: '16px',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const labelStyle = {
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: 'rgba(232, 228, 240, 0.35)',
  marginBottom: '10px'
};

const smallLabel = { display: 'block', marginBottom: '5px', fontSize: '0.8rem', color: 'rgba(232,228,240,0.6)' };

const selectStyle = {
  width: '100%',
  padding: '7px 10px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.04)',
  color: '#e8e4f0',
  fontSize: '0.8rem',
  cursor: 'pointer'
};

const keyBtn = {
  width: '28px', height: '28px', borderRadius: '5px', border: 'none',
  cursor: 'pointer', fontSize: '0.7rem', fontWeight: 500, transition: 'all 0.15s'
};

const catBtn = {
  padding: '5px 12px', borderRadius: '14px', cursor: 'pointer',
  fontSize: '0.7rem', fontWeight: 500, transition: 'all 0.15s'
};

const progBtn = {
  padding: '8px', borderRadius: '8px', cursor: 'pointer',
  textAlign: 'left', transition: 'all 0.12s'
};

const variationBtn = {
  padding: '12px', borderRadius: '10px', cursor: 'pointer',
  textAlign: 'center', transition: 'all 0.15s', color: '#e8e4f0'
};

const instBtn = {
  padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
  fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s'
};

const playBtn = {
  padding: '14px 48px', borderRadius: '30px', border: 'none',
  color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer',
  transition: 'all 0.2s'
};

const shuffleBtn = {
  padding: '14px 28px', borderRadius: '30px',
  border: '1px solid rgba(139,92,246,0.4)',
  background: 'rgba(139,92,246,0.1)',
  color: '#c084fc', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
};

const regenerateBtn = {
  padding: '8px 20px', borderRadius: '20px',
  border: '1px solid rgba(251,146,60,0.4)',
  background: 'rgba(251,146,60,0.1)',
  color: '#fb923c', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
};

const exportBtn = {
  padding: '10px 24px', borderRadius: '8px',
  border: '1px solid', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
};

const enableAudioBtn = {
  marginTop: '14px', padding: '10px 28px', borderRadius: '24px',
  border: '1px solid rgba(139,92,246,0.4)',
  background: 'rgba(139,92,246,0.15)',
  color: '#c084fc', fontSize: '0.85rem', cursor: 'pointer'
};
