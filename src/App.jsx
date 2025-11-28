import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import audioEngine from './audioEngine';
import { 
  NOTES, ARTIST_PROGRESSIONS, DRUM_PATTERNS, BASS_PATTERNS,
  buildChord, transposeChord
} from './chordLibrary';
import { createMidiFile, downloadMidi, generateMidiEvents } from './midiExport';

// Random helpers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomFloat = (min, max) => Math.random() * (max - min) + min;
const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function App() {
  // Core state
  const [selectedArtist, setSelectedArtist] = useState('sza');
  const [selectedProgIdx, setSelectedProgIdx] = useState(0);
  const [keyTranspose, setKeyTranspose] = useState(0);
  const [bpm, setBpm] = useState(80);
  const [swing, setSwing] = useState(0.12);
  const [reverbAmount, setReverbAmount] = useState(0.25);
  
  // Generated variations
  const [variations, setVariations] = useState([]);
  const [selectedVar, setSelectedVar] = useState(0);
  const [genCount, setGenCount] = useState(0);
  
  // Instruments
  const [instruments, setInstruments] = useState({
    piano: true,
    pad: false,
    strings: false,
    guitar: false,
    bass: true,
    melody: true,
    drums: true
  });
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChord, setCurrentChord] = useState(-1);
  const [audioReady, setAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Current data
  const artist = ARTIST_PROGRESSIONS[selectedArtist];
  const progression = artist?.progressions[selectedProgIdx];

  // Generate variations when progression changes
  const generateVariations = useCallback(() => {
    if (!progression) return;
    
    const drumKeys = Object.keys(DRUM_PATTERNS);
    const bassKeys = Object.keys(BASS_PATTERNS);
    
    const newVars = Array.from({ length: 6 }, (_, i) => {
      const drumKey = randomChoice(drumKeys);
      const bassKey = randomChoice(bassKeys);
      
      // Build chords with transposition
      const chords = progression.chords.map(name => {
        const chord = buildChord(name, 3);
        return transposeChord(chord, keyTranspose);
      });
      
      return {
        id: `${Date.now()}-${i}`,
        name: `Version ${i + 1}`,
        bpm: random(72, 92),
        swing: randomFloat(0.08, 0.18),
        drumPattern: DRUM_PATTERNS[drumKey],
        drumPatternName: drumKey,
        bassPattern: BASS_PATTERNS[bassKey].pattern,
        bassPatternName: BASS_PATTERNS[bassKey].name,
        chords
      };
    });
    
    setVariations(newVars);
    setSelectedVar(0);
    setGenCount(c => c + 1);
  }, [progression, keyTranspose]);

  useEffect(() => {
    generateVariations();
  }, [selectedArtist, selectedProgIdx, keyTranspose]);

  // Init audio
  const initAudio = async () => {
    if (audioReady) return true;
    setIsLoading(true);
    try {
      await audioEngine.init();
      setAudioReady(true);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Audio init error:', e);
      setIsLoading(false);
      return false;
    }
  };

  // Current variation
  const currentVar = variations[selectedVar];

  // Play
  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      audioEngine.stopAll();
      setIsPlaying(false);
      setCurrentChord(-1);
      return;
    }
    
    if (!currentVar) return;
    
    const ready = await initAudio();
    if (!ready) return;
    
    audioEngine.setReverb(reverbAmount);
    
    const arrangement = {
      chords: currentVar.chords,
      bpm: currentVar.bpm,
      swing: currentVar.swing,
      instruments,
      drumPattern: currentVar.drumPattern,
      bassPattern: currentVar.bassPattern
    };
    
    setIsPlaying(true);
    
    audioEngine.playArrangement(arrangement, (chordIdx) => {
      setCurrentChord(chordIdx);
      
      // Check if done
      if (chordIdx >= currentVar.chords.length - 1) {
        setTimeout(() => {
          setIsPlaying(false);
          setCurrentChord(-1);
        }, 3000);
      }
    });
  }, [isPlaying, currentVar, instruments, reverbAmount]);

  // Stop
  const handleStop = useCallback(() => {
    audioEngine.stopAll();
    setIsPlaying(false);
    setCurrentChord(-1);
  }, []);

  // Export MIDI
  const exportMidi = useCallback((type) => {
    if (!currentVar) return;
    
    const arrangement = {
      chords: currentVar.chords,
      bpm: currentVar.bpm,
      drumPattern: currentVar.drumPattern,
      bassPattern: currentVar.bassPattern
    };
    
    const notes = generateMidiEvents(arrangement, type);
    const midi = createMidiFile(notes, currentVar.bpm, `RnB_${type}`);
    const keyName = NOTES[keyTranspose] || 'C';
    downloadMidi(midi, `rnb_${selectedArtist}_${type}_${keyName}_v${selectedVar + 1}.mid`);
  }, [currentVar, selectedArtist, selectedVar, keyTranspose]);

  const toggleInst = (key) => setInstruments(prev => ({ ...prev, [key]: !prev[key] }));

  const displayKey = NOTES[keyTranspose] || 'C';

  return (
    <div className="app">
      {/* Backgrounds */}
      <div className="bg bg1" />
      <div className="bg bg2" />
      
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>R&B Producer Pro</h1>
          <p>Professional Chord Progressions • Real Voicings • MIDI Export</p>
          
          {!audioReady && (
            <button className="btn-enable" onClick={initAudio} disabled={isLoading}>
              {isLoading ? 'Loading...' : '🎹 Enable Audio'}
            </button>
          )}
        </header>

        {/* Artist Selection */}
        <section className="panel artist-panel">
          <h3 className="label">Artist Style</h3>
          <div className="artist-grid">
            {Object.entries(ARTIST_PROGRESSIONS).map(([key, art]) => (
              <button 
                key={key}
                className={`artist-btn ${selectedArtist === key ? 'active' : ''}`}
                style={{ 
                  '--color': art.color,
                  borderColor: selectedArtist === key ? art.color : 'rgba(255,255,255,0.08)'
                }}
                onClick={() => { setSelectedArtist(key); setSelectedProgIdx(0); }}
              >
                <strong>{art.name}</strong>
                <span>{art.description}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Main Controls */}
        <div className="main-grid">
          {/* Settings */}
          <section className="panel">
            <h3 className="label">Settings</h3>
            
            <div className="control-group">
              <div className="control-label">Key: <span className="value purple">{displayKey}</span></div>
              <div className="key-grid">
                {NOTES.map((note, i) => (
                  <button 
                    key={note}
                    className={`key-btn ${keyTranspose === i ? 'active' : ''}`}
                    onClick={() => setKeyTranspose(i)}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="control-group">
              <div className="control-label">BPM: <span className="value pink">{bpm}</span></div>
              <input type="range" min="60" max="110" value={bpm} onChange={e => setBpm(+e.target.value)} />
            </div>
            
            <div className="control-group">
              <div className="control-label">Swing: <span className="value orange">{Math.round(swing * 100)}%</span></div>
              <input type="range" min="0" max="0.3" step="0.01" value={swing} onChange={e => setSwing(+e.target.value)} />
            </div>
            
            <div className="control-group">
              <div className="control-label">Reverb: <span className="value cyan">{Math.round(reverbAmount * 100)}%</span></div>
              <input type="range" min="0" max="0.5" step="0.05" value={reverbAmount} onChange={e => setReverbAmount(+e.target.value)} />
            </div>
          </section>

          {/* Progressions */}
          <section className="panel">
            <h3 className="label">{artist?.name} Progressions</h3>
            <div className="prog-grid">
              {artist?.progressions.map((prog, i) => (
                <button 
                  key={prog.name}
                  className={`prog-btn ${selectedProgIdx === i ? 'active' : ''}`}
                  style={{ '--color': artist.color }}
                  onClick={() => setSelectedProgIdx(i)}
                >
                  <strong>{prog.name}</strong>
                  <span className="desc">{prog.desc}</span>
                  <span className="chords">{prog.chords.join(' → ')}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Info */}
          <section className="panel">
            <h3 className="label">Variation Info</h3>
            {currentVar && (
              <div className="info-list">
                <div>Key: <span className="purple">{displayKey}</span></div>
                <div>BPM: <span className="pink">{currentVar.bpm}</span></div>
                <div>Swing: <span className="orange">{Math.round(currentVar.swing * 100)}%</span></div>
                <div>Drums: <span className="red">{currentVar.drumPatternName}</span></div>
                <div>Bass: <span className="green">{currentVar.bassPatternName}</span></div>
              </div>
            )}
          </section>
        </div>

        {/* Variations */}
        <section className="panel">
          <div className="panel-header">
            <h3 className="label">Variations <span className="gen-count">#{genCount}</span></h3>
            <button className="btn-regen" onClick={generateVariations}>🎲 Regenerate</button>
          </div>
          
          <div className="var-grid">
            {variations.map((v, i) => (
              <button 
                key={v.id}
                className={`var-btn ${selectedVar === i ? 'active' : ''}`}
                onClick={() => setSelectedVar(i)}
              >
                <strong>{v.name}</strong>
                <span>{v.bpm} BPM</span>
                <span className="small">{v.drumPatternName}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Instruments */}
        <section className="panel">
          <h3 className="label">Instruments</h3>
          <div className="inst-grid">
            {[
              { key: 'piano', label: '🎹 Piano', color: '#8b5cf6' },
              { key: 'pad', label: '🎛️ Pad', color: '#14b8a6' },
              { key: 'strings', label: '🎻 Strings', color: '#06b6d4' },
              { key: 'guitar', label: '🎸 Guitar', color: '#22c55e' },
              { key: 'bass', label: '🎸 Bass', color: '#f97316' },
              { key: 'melody', label: '🎵 Melody', color: '#ec4899' },
              { key: 'drums', label: '🥁 Drums', color: '#ef4444' },
            ].map(inst => (
              <button 
                key={inst.key}
                className={`inst-btn ${instruments[inst.key] ? 'active' : ''}`}
                style={{ '--color': inst.color }}
                onClick={() => toggleInst(inst.key)}
              >
                {inst.label}
              </button>
            ))}
          </div>
        </section>

        {/* Chord Display */}
        {currentVar && (
          <section className="panel chord-panel">
            <h3 className="label center">
              {progression?.name} in {displayKey} — {currentVar.name}
            </h3>
            
            <div className="chord-grid" style={{ gridTemplateColumns: `repeat(${currentVar.chords.length}, 1fr)` }}>
              {currentVar.chords.map((chord, i) => (
                <div 
                  key={i}
                  className={`chord-card ${currentChord === i ? 'active' : ''}`}
                  style={{ '--color': chord.color }}
                >
                  <div className="chord-name">{chord.name}</div>
                  <div className="chord-type">{chord.typeName}</div>
                  <div className="chord-notes">
                    {chord.notes.map(n => NOTES[n % 12]).join(' ')}
                  </div>
                </div>
              ))}
            </div>

            <div className="play-controls">
              <button 
                className={`btn-play ${isPlaying ? 'stop' : ''}`}
                onClick={isPlaying ? handleStop : handlePlay}
                disabled={!audioReady}
              >
                {isPlaying ? '■ Stop' : '▶ Play'}
              </button>
              <button className="btn-shuffle" onClick={generateVariations}>
                🔀 New Variations
              </button>
            </div>
          </section>
        )}

        {/* Export */}
        <section className="panel export-panel">
          <h3 className="label center">Export MIDI</h3>
          
          <div className="export-grid">
            {[
              { type: 'piano', label: '🎹 Piano', color: '#8b5cf6' },
              { type: 'pad', label: '🎛️ Pad', color: '#14b8a6' },
              { type: 'strings', label: '🎻 Strings', color: '#06b6d4' },
              { type: 'guitar', label: '🎸 Guitar', color: '#22c55e' },
              { type: 'bass', label: '🎸 Bass', color: '#f97316' },
              { type: 'melody', label: '🎵 Melody', color: '#ec4899' },
              { type: 'drums', label: '🥁 Drums', color: '#ef4444' },
            ].map(exp => (
              <button 
                key={exp.type}
                className="export-btn"
                style={{ '--color': exp.color }}
                onClick={() => exportMidi(exp.type)}
              >
                {exp.label}
              </button>
            ))}
          </div>
          
          <button 
            className="btn-export-full"
            onClick={() => exportMidi('full')}
          >
            📦 Export Full Track
          </button>
          
          <p className="export-hint">Export any instrument separately or full arrangement</p>
        </section>
      </div>
    </div>
  );
}
