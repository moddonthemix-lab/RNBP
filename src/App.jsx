import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import audioEngine from './audioEngine';
import {
  NOTES, CHORD_TYPES, RNB_PROGRESSIONS, SCALES, MELODY_PATTERNS,
  DRUM_PATTERNS, CATEGORIES, parseNumeral, generateChordMidi,
  midiToNoteName, generateMelody
} from './musicData';
import {
  createMidiFile, downloadMidi, generateChordMidiNotes,
  generateMelodyMidiNotes, generateBassMidiNotes, generateDrumMidiNotes
} from './midiExport';

export default function App() {
  // State
  const [key, setKey] = useState(0);
  const [bpm, setBpm] = useState(85);
  const [selectedProgression, setSelectedProgression] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedScale, setSelectedScale] = useState('pentatonicMinor');
  const [selectedMelodyPattern, setSelectedMelodyPattern] = useState(0);
  const [selectedDrumPattern, setSelectedDrumPattern] = useState('trapSoul');
  const [swingAmount, setSwingAmount] = useState(0.15);
  const [reverbAmount, setReverbAmount] = useState(0.3);
  
  // Instrument toggles
  const [instruments, setInstruments] = useState({
    piano: true,
    pad: false,
    guitar: false,
    bass: true,
    melody: true,
    drums: true
  });
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChordIndex, setCurrentChordIndex] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);
  
  // Generated data
  const [generatedChords, setGeneratedChords] = useState([]);
  
  const scheduledEventsRef = useRef([]);

  // Filter progressions by category
  const filteredProgressions = selectedCategory === 'all'
    ? RNB_PROGRESSIONS
    : RNB_PROGRESSIONS.filter(p => p.category === selectedCategory);

  // Generate chords when settings change
  useEffect(() => {
    const progression = RNB_PROGRESSIONS[selectedProgression];
    if (!progression) return;
    
    const chords = progression.numerals.map((numeral, i) => {
      const chord = parseNumeral(numeral, key);
      const inversion = i % 2; // Alternate inversions for voice leading
      const midiNotes = generateChordMidi(chord, 3, inversion);
      return { ...chord, midiNotes, inversion };
    });
    
    setGeneratedChords(chords);
  }, [key, selectedProgression]);

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

  // Play/Stop toggle
  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      // Stop playback
      audioEngine.stopAll();
      Tone.Transport.stop();
      Tone.Transport.cancel();
      setIsPlaying(false);
      setCurrentChordIndex(-1);
      return;
    }

    // Initialize if needed
    if (!audioReady) {
      await initAudio();
    }

    setIsPlaying(true);
    
    const beatsPerChord = 4;
    const totalBeats = generatedChords.length * beatsPerChord;
    
    audioEngine.setBPM(bpm);
    audioEngine.setReverb(reverbAmount);
    
    // Schedule all events
    Tone.Transport.cancel();
    
    const drumPattern = DRUM_PATTERNS[selectedDrumPattern];
    const melodyPattern = MELODY_PATTERNS[selectedMelodyPattern];
    const scale = selectedScale;
    
    generatedChords.forEach((chord, chordIndex) => {
      const chordStartBeats = chordIndex * beatsPerChord;
      const chordStartTime = `${chordStartBeats}:0:0`;
      
      // Update visual indicator
      Tone.Transport.schedule((time) => {
        Tone.Draw.schedule(() => {
          setCurrentChordIndex(chordIndex);
        }, time);
      }, chordStartTime);
      
      // Play chord instruments
      if (instruments.piano) {
        Tone.Transport.schedule((time) => {
          audioEngine.playChord(chord.midiNotes, '2n', 'piano', time, 0.7);
        }, chordStartTime);
        
        // Slight re-trigger at beat 3 for movement
        Tone.Transport.schedule((time) => {
          audioEngine.playChord(chord.midiNotes, '4n', 'piano', time, 0.5);
        }, `${chordStartBeats + 2}:0:0`);
      }
      
      if (instruments.pad) {
        Tone.Transport.schedule((time) => {
          audioEngine.playChord(chord.midiNotes.map(n => n + 12), '1m', 'pad', time, 0.4);
        }, chordStartTime);
      }
      
      if (instruments.guitar) {
        // Arpeggiate the chord
        chord.midiNotes.forEach((note, i) => {
          const delay = i * 0.12;
          Tone.Transport.schedule((time) => {
            audioEngine.playNote(note + 12, '2n', 'guitar', time, 0.6);
          }, `${chordStartBeats}:0:${delay * 4}`);
        });
      }
      
      // Bass line
      if (instruments.bass) {
        const bassNote = chord.root + 36;
        Tone.Transport.schedule((time) => {
          audioEngine.playBass(bassNote, '2n', time);
        }, chordStartTime);
        
        Tone.Transport.schedule((time) => {
          audioEngine.playBass(bassNote + 7, '4n', time);
        }, `${chordStartBeats + 2}:0:0`);
      }
      
      // Melody
      if (instruments.melody) {
        const melodyNotes = generateMelody(chord, scale, melodyPattern.pattern, 5);
        const rhythm = melodyPattern.rhythm || melodyPattern.pattern.map((_, i) => i * 0.5);
        
        melodyNotes.forEach((note, i) => {
          const beatOffset = rhythm[i] || i * 0.5;
          const swingOffset = i % 2 === 1 ? swingAmount : 0;
          const totalOffset = beatOffset + swingOffset;
          
          Tone.Transport.schedule((time) => {
            audioEngine.playNote(note, '8n', 'lead', time, 0.6);
          }, `${chordStartBeats + Math.floor(totalOffset)}:${(totalOffset % 1) * 4}:0`);
        });
      }
      
      // Drums (loop pattern each bar)
      if (instruments.drums) {
        for (let beat = 0; beat < beatsPerChord; beat++) {
          const beatTime = chordStartBeats + beat;
          
          // Kick
          if (drumPattern.kick.some(k => Math.abs(k - beat) < 0.01 || Math.abs(k - beat - 0.75) < 0.01)) {
            drumPattern.kick.forEach(k => {
              if (k >= beat && k < beat + 1) {
                const offset = k - beat;
                Tone.Transport.schedule((time) => {
                  audioEngine.playDrum('kick', time);
                }, `${beatTime}:${offset * 4}:0`);
              }
            });
          }
          
          // Snare
          if (drumPattern.snare.includes(beat)) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('snare', time);
            }, `${beatTime}:0:0`);
          }
        }
        
        // Hi-hats
        drumPattern.hihat.forEach(h => {
          if (h < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('hihat', time);
            }, `${chordStartBeats + Math.floor(h)}:${(h % 1) * 4}:0`);
          }
        });
        
        // Open hats
        drumPattern.openHat.forEach(h => {
          if (h < beatsPerChord) {
            Tone.Transport.schedule((time) => {
              audioEngine.playDrum('openHat', time);
            }, `${chordStartBeats + Math.floor(h)}:${(h % 1) * 4}:0`);
          }
        });
      }
    });
    
    // Loop point
    Tone.Transport.schedule(() => {
      Tone.Transport.stop();
      setIsPlaying(false);
      setCurrentChordIndex(-1);
    }, `${totalBeats}:0:0`);
    
    Tone.Transport.start();
  }, [isPlaying, audioReady, generatedChords, bpm, instruments, selectedScale, selectedMelodyPattern, selectedDrumPattern, swingAmount, reverbAmount]);

  // Export MIDI
  const exportMidi = useCallback((type) => {
    const beatsPerChord = 4;
    let notes = [];
    
    const chordsWithMidi = generatedChords.map(chord => ({
      ...chord,
      midiNotes: chord.midiNotes
    }));
    
    if (type === 'chords' || type === 'full') {
      notes = [...notes, ...generateChordMidiNotes(chordsWithMidi, beatsPerChord)];
    }
    
    if (type === 'melody' || type === 'full') {
      const melodyPattern = MELODY_PATTERNS[selectedMelodyPattern];
      const melodies = generatedChords.map(chord => ({
        notes: generateMelody(chord, selectedScale, melodyPattern.pattern, 5),
        rhythm: melodyPattern.rhythm
      }));
      notes = [...notes, ...generateMelodyMidiNotes(melodies, beatsPerChord)];
    }
    
    if (type === 'bass' || type === 'full') {
      notes = [...notes, ...generateBassMidiNotes(generatedChords, beatsPerChord)];
    }
    
    if (type === 'drums' || type === 'full') {
      const pattern = DRUM_PATTERNS[selectedDrumPattern];
      notes = [...notes, ...generateDrumMidiNotes(pattern, generatedChords.length)];
    }
    
    const midiData = createMidiFile(notes, bpm, `rnb_${type}_${NOTES[key]}`);
    downloadMidi(midiData, `rnb_${type}_${NOTES[key]}_${bpm}bpm.mid`);
  }, [generatedChords, key, bpm, selectedScale, selectedMelodyPattern, selectedDrumPattern]);

  // Toggle instrument
  const toggleInstrument = (inst) => {
    setInstruments(prev => ({ ...prev, [inst]: !prev[inst] }));
  };

  const currentProgression = RNB_PROGRESSIONS[selectedProgression];

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
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            margin: 0,
            background: 'linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            R&B Producer
          </h1>
          <p style={{
            fontSize: '1rem',
            color: 'rgba(232, 228, 240, 0.5)',
            marginTop: '8px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}>
            Real Instruments • MIDI Export • Professional Sound
          </p>
          
          {!audioReady && (
            <button
              onClick={initAudio}
              disabled={isLoading}
              style={{
                marginTop: '16px',
                padding: '12px 32px',
                borderRadius: '30px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#c084fc',
                fontSize: '0.9rem',
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isLoading ? 'Loading Instruments...' : '🎹 Click to Enable Audio'}
            </button>
          )}
        </header>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Key & BPM */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <h3 style={labelStyle}>Key & Tempo</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>
                Key: <span style={{ color: '#c084fc', fontWeight: 600 }}>{NOTES[key]}</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {NOTES.map((note, i) => (
                  <button
                    key={note}
                    onClick={() => setKey(i)}
                    style={{
                      width: '32px', height: '32px',
                      borderRadius: '6px', border: 'none',
                      background: key === i ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'rgba(255,255,255,0.05)',
                      color: key === i ? '#fff' : 'rgba(232, 228, 240, 0.6)',
                      cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500
                    }}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                BPM: <span style={{ color: '#f472b6', fontWeight: 600 }}>{bpm}</span>
              </label>
              <input
                type="range" min="60" max="140" value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                Swing: <span style={{ color: '#fb923c', fontWeight: 600 }}>{Math.round(swingAmount * 100)}%</span>
              </label>
              <input
                type="range" min="0" max="0.4" step="0.02" value={swingAmount}
                onChange={(e) => setSwingAmount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem' }}>
                Reverb: <span style={{ color: '#22d3ee', fontWeight: 600 }}>{Math.round(reverbAmount * 100)}%</span>
              </label>
              <input
                type="range" min="0" max="0.8" step="0.05" value={reverbAmount}
                onChange={(e) => setReverbAmount(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* Progression Selector */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            gridColumn: 'span 2'
          }}>
            <h3 style={labelStyle}>Chord Progression</h3>
            
            {/* Category Tabs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setSelectedProgression(0); }}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '16px',
                    border: selectedCategory === cat.id ? `1px solid ${cat.color}` : '1px solid rgba(255,255,255,0.1)',
                    background: selectedCategory === cat.id ? `${cat.color}25` : 'rgba(255,255,255,0.02)',
                    color: selectedCategory === cat.id ? cat.color : 'rgba(232,228,240,0.5)',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: 500
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
              {filteredProgressions.map((prog, i) => {
                const isSelected = RNB_PROGRESSIONS[selectedProgression]?.name === prog.name;
                return (
                  <button
                    key={prog.name}
                    onClick={() => setSelectedProgression(RNB_PROGRESSIONS.indexOf(prog))}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: isSelected ? `1px solid ${prog.color}50` : '1px solid transparent',
                      background: isSelected ? `${prog.color}20` : 'rgba(255,255,255,0.02)',
                      color: isSelected ? '#fff' : 'rgba(232,228,240,0.6)',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '0.8rem' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: prog.color }} />
                      {prog.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.5, marginLeft: '14px' }}>{prog.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Melody & Scale */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}>
            <h3 style={labelStyle}>Melody</h3>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Scale</label>
              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                style={selectStyle}
              >
                {Object.entries(SCALES).map(([key, scale]) => (
                  <option key={key} value={key}>{scale.name}</option>
                ))}
              </select>
            </div>
            
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Pattern</label>
              <select
                value={selectedMelodyPattern}
                onChange={(e) => setSelectedMelodyPattern(Number(e.target.value))}
                style={selectStyle}
              >
                {MELODY_PATTERNS.map((p, i) => (
                  <option key={p.name} value={i}>{p.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.8rem' }}>Drum Pattern</label>
              <select
                value={selectedDrumPattern}
                onChange={(e) => setSelectedDrumPattern(e.target.value)}
                style={selectStyle}
              >
                {Object.entries(DRUM_PATTERNS).map(([key, p]) => (
                  <option key={key} value={key}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Instrument Mixer */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '24px'
        }}>
          <h3 style={{ ...labelStyle, marginBottom: '16px' }}>Instrument Mixer</h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { key: 'piano', label: '🎹 Piano', color: '#8b5cf6' },
              { key: 'pad', label: '🎛️ Pad', color: '#6366f1' },
              { key: 'guitar', label: '🎸 Guitar', color: '#22c55e' },
              { key: 'bass', label: '🎸 Bass', color: '#f97316' },
              { key: 'melody', label: '🎵 Melody', color: '#ec4899' },
              { key: 'drums', label: '🥁 Drums', color: '#ef4444' },
            ].map(inst => (
              <button
                key={inst.key}
                onClick={() => toggleInstrument(inst.key)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  border: instruments[inst.key] ? `1px solid ${inst.color}` : '1px solid rgba(255,255,255,0.1)',
                  background: instruments[inst.key] ? `${inst.color}20` : 'rgba(255,255,255,0.02)',
                  color: instruments[inst.key] ? inst.color : 'rgba(232,228,240,0.4)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.15s'
                }}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chord Display */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <h3 style={{ ...labelStyle, textAlign: 'center', marginBottom: '20px' }}>
            {currentProgression?.name} in {NOTES[key]}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${generatedChords.length}, 1fr)`, gap: '16px', marginBottom: '28px' }}>
            {generatedChords.map((chord, i) => (
              <div
                key={i}
                className={currentChordIndex === i ? 'playing' : ''}
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  background: currentChordIndex === i ? `${chord.color}30` : 'rgba(255,255,255,0.02)',
                  border: currentChordIndex === i ? `2px solid ${chord.color}` : '2px solid transparent',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  transform: currentChordIndex === i ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '1.8rem', fontWeight: 600, color: chord.color, marginBottom: '6px' }}>
                  {chord.rootName}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(232,228,240,0.5)', marginBottom: '8px' }}>
                  {chord.typeName}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(232,228,240,0.3)', fontFamily: 'monospace' }}>
                  {chord.midiNotes.map(n => midiToNoteName(n)).join(' ')}
                </div>
              </div>
            ))}
          </div>

          {/* Playback Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button
              onClick={togglePlay}
              disabled={!audioReady && !isLoading}
              style={{
                padding: '16px 56px',
                borderRadius: '40px',
                border: 'none',
                background: isPlaying
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                  : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: 600,
                cursor: audioReady ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: isPlaying
                  ? '0 8px 32px rgba(239, 68, 68, 0.4)'
                  : '0 8px 32px rgba(139, 92, 246, 0.4)',
                transition: 'all 0.2s',
                opacity: audioReady ? 1 : 0.5
              }}
            >
              {isPlaying ? (
                <><span style={{ fontSize: '1.2rem' }}>■</span> Stop</>
              ) : (
                <><span style={{ fontSize: '1.2rem' }}>▶</span> Play</>
              )}
            </button>
          </div>
        </div>

        {/* Export Section */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '20px',
          padding: '28px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '24px'
        }}>
          <h3 style={{ ...labelStyle, textAlign: 'center', marginBottom: '20px' }}>Export MIDI</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { type: 'chords', label: 'Chords', color: '#8b5cf6' },
              { type: 'melody', label: 'Melody', color: '#ec4899' },
              { type: 'bass', label: 'Bass', color: '#f97316' },
              { type: 'drums', label: 'Drums', color: '#ef4444' },
              { type: 'full', label: 'Full Track', color: '#22c55e' },
            ].map(exp => (
              <button
                key={exp.type}
                onClick={() => exportMidi(exp.type)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: `1px solid ${exp.color}40`,
                  background: `${exp.color}15`,
                  color: exp.color,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                {exp.label}
              </button>
            ))}
          </div>
          
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'rgba(232,228,240,0.4)' }}>
            Drag MIDI files into FL Studio, Ableton, Logic, or any DAW
          </p>
        </div>

        {/* Production Tips */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.04)'
        }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', color: 'rgba(232,228,240,0.7)' }}>
            Production Tips for {currentProgression?.category?.toUpperCase() || 'R&B'}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <TipCard title="Chords" color="#8b5cf6" tips={[
              'Use inversions for smooth voice leading',
              'Add 9ths and 11ths for lush harmony',
              'Rhodes/Wurlitzer for authentic R&B'
            ]} />
            <TipCard title="Rhythm" color="#f97316" tips={[
              `${bpm} BPM is ${bpm < 75 ? 'slow jam' : bpm < 95 ? 'mid-tempo groove' : 'uptempo'} territory`,
              `${Math.round(swingAmount * 100)}% swing adds human feel`,
              'Layer trap hi-hats for modern sound'
            ]} />
            <TipCard title="Mix" color="#22c55e" tips={[
              'Bass and kick should complement, not clash',
              'Use sidechain compression on pads',
              'Reverb on snare and vocals, not bass'
            ]} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const labelStyle = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: 'rgba(232, 228, 240, 0.4)',
  marginBottom: '12px'
};

const selectStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(255,255,255,0.05)',
  color: '#e8e4f0',
  fontSize: '0.85rem',
  cursor: 'pointer'
};

// Tip Card Component
function TipCard({ title, color, tips }) {
  return (
    <div style={{
      padding: '14px',
      background: `${color}10`,
      borderRadius: '10px',
      border: `1px solid ${color}20`
    }}>
      <h5 style={{ color, margin: '0 0 8px 0', fontSize: '0.8rem' }}>{title}</h5>
      <ul style={{ margin: 0, paddingLeft: '14px', fontSize: '0.75rem', color: 'rgba(232,228,240,0.5)', lineHeight: 1.6 }}>
        {tips.map((tip, i) => <li key={i}>{tip}</li>)}
      </ul>
    </div>
  );
}
