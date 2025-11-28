import React, { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import audioEngine from './audioEngine';
import { 
  ARTISTS, SONG_STRUCTURES, DRUM_PATTERNS, BASS_PATTERNS, NOTES,
  generateSongArrangement, SECTION_TYPES
} from './songStructure';
import { createMidiFile, downloadMidi, generateMidiEvents } from './midiExport';

export default function App() {
  // Core state
  const [selectedArtist, setSelectedArtist] = useState('bryson');
  const [keyTranspose, setKeyTranspose] = useState(0);
  const [reverbAmount, setReverbAmount] = useState(0.25);
  
  // Song arrangement
  const [arrangement, setArrangement] = useState(null);
  const [genCount, setGenCount] = useState(0);
  
  // Instruments
  const [instruments, setInstruments] = useState({
    piano: true,
    pad: true,
    strings: false,
    guitar: false,
    bass: true,
    melody: true,
    drums: true
  });
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState(-1);
  const [currentChord, setCurrentChord] = useState(-1);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioReady, setAudioReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const playbackRef = useRef(null);
  const intervalRef = useRef(null);

  // Generate new arrangement
  const generateNew = useCallback(() => {
    const newArrangement = generateSongArrangement(selectedArtist, keyTranspose);
    setArrangement(newArrangement);
    setGenCount(c => c + 1);
    setCurrentSection(-1);
    setCurrentChord(-1);
    setPlaybackTime(0);
  }, [selectedArtist, keyTranspose]);

  // Generate on artist/key change
  useEffect(() => {
    generateNew();
  }, [selectedArtist, keyTranspose]);

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

  // Stop playback
  const stopPlayback = useCallback(() => {
    if (playbackRef.current) {
      clearTimeout(playbackRef.current);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    audioEngine.stopAll();
    setIsPlaying(false);
    setCurrentSection(-1);
    setCurrentChord(-1);
  }, []);

  // Play full song
  const handlePlay = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    
    if (!arrangement) return;
    
    const ready = await initAudio();
    if (!ready) return;
    
    setIsPlaying(true);
    setPlaybackTime(0);
    
    audioEngine.setReverb(reverbAmount);
    audioEngine.setBPM(arrangement.tempo);
    
    // Flatten all chords with timing info
    const allEvents = [];
    let currentBeat = 0;
    
    arrangement.sections.forEach((section, sectionIdx) => {
      const beatsPerBar = 4;
      const sectionStartBeat = currentBeat;
      
      // Each chord gets equal time within the section
      const chordsInSection = section.chords.length;
      const barsPerChord = section.bars / chordsInSection;
      const beatsPerChord = barsPerChord * beatsPerBar;
      
      section.chords.forEach((chord, chordIdx) => {
        const chordStartBeat = sectionStartBeat + (chordIdx * beatsPerChord);
        
        allEvents.push({
          type: 'chord',
          sectionIdx,
          chordIdx,
          chord,
          startBeat: chordStartBeat,
          duration: beatsPerChord,
          sectionType: section.type,
          energy: section.energy
        });
      });
      
      currentBeat += section.bars * beatsPerBar;
    });
    
    // Build arrangement for audio engine
    const flatChords = allEvents.map(e => e.chord);
    const beatsPerChord = allEvents.length > 0 ? allEvents[0].duration : 4;
    
    // Play using audio engine
    const songArrangement = {
      chords: flatChords,
      bpm: arrangement.tempo,
      swing: arrangement.swing,
      instruments,
      drumPattern: arrangement.drumPattern,
      bassPattern: arrangement.bassPattern.pattern || BASS_PATTERNS.rootFifth.pattern
    };
    
    // Custom callback for section/chord tracking
    let eventIndex = 0;
    const updateVisuals = () => {
      if (eventIndex < allEvents.length) {
        const event = allEvents[eventIndex];
        setCurrentSection(event.sectionIdx);
        setCurrentChord(event.chordIdx);
        eventIndex++;
      }
    };
    
    // Start playback
    const totalDuration = audioEngine.playArrangement(songArrangement, (chordIdx) => {
      if (chordIdx < allEvents.length) {
        const event = allEvents[chordIdx];
        setCurrentSection(event.sectionIdx);
        setCurrentChord(event.chordIdx);
      }
    });
    
    // Update playback time
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setPlaybackTime(elapsed);
      
      if (elapsed >= arrangement.durationSeconds) {
        stopPlayback();
      }
    }, 100);
    
    // Auto-stop at end
    playbackRef.current = setTimeout(() => {
      stopPlayback();
    }, arrangement.durationSeconds * 1000 + 1000);
    
  }, [isPlaying, arrangement, instruments, reverbAmount, stopPlayback]);

  // Export full song MIDI
  const exportMidi = useCallback((type) => {
    if (!arrangement) return;
    
    // Flatten arrangement to events
    const notes = [];
    let currentBeat = 0;
    
    arrangement.sections.forEach((section) => {
      const beatsPerBar = 4;
      const chordsInSection = section.chords.length;
      const barsPerChord = section.bars / chordsInSection;
      const beatsPerChord = barsPerChord * beatsPerBar;
      
      section.chords.forEach((chord, chordIdx) => {
        const chordStartBeat = currentBeat + (chordIdx * beatsPerChord);
        
        // Piano/Chords
        if (type === 'piano' || type === 'chords' || type === 'full') {
          [0, 2].forEach(beat => {
            chord.notes.forEach(note => {
              notes.push({
                note,
                start: chordStartBeat + beat,
                duration: 1.5,
                velocity: Math.round(70 + section.energy * 20),
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
              start: chordStartBeat,
              duration: beatsPerChord * 0.9,
              velocity: 55,
              channel: 1
            });
          });
        }
        
        // Bass
        if (type === 'bass' || type === 'full') {
          const bassPattern = arrangement.bassPattern.pattern || BASS_PATTERNS.rootFifth.pattern;
          bassPattern.forEach(hit => {
            if (hit.beat < beatsPerChord) {
              notes.push({
                note: chord.bassNote + (hit.interval || 0),
                start: chordStartBeat + hit.beat,
                duration: hit.duration,
                velocity: 90,
                channel: 2
              });
            }
          });
        }
        
        // Drums
        if (type === 'drums' || type === 'full') {
          const drumPattern = arrangement.drumPattern;
          
          // Repeat pattern for each bar in chord duration
          for (let bar = 0; bar < barsPerChord; bar++) {
            const barStart = chordStartBeat + (bar * 4);
            
            drumPattern.kick.forEach(beat => {
              notes.push({ note: 36, start: barStart + beat, duration: 0.25, velocity: 100, channel: 9 });
            });
            drumPattern.snare.forEach(beat => {
              notes.push({ note: 38, start: barStart + beat, duration: 0.2, velocity: 90, channel: 9 });
            });
            drumPattern.hihat.forEach(beat => {
              notes.push({ note: 42, start: barStart + beat, duration: 0.1, velocity: 65, channel: 9 });
            });
          }
        }
      });
      
      currentBeat += section.bars * beatsPerBar;
    });
    
    const keyName = NOTES[keyTranspose] || 'C';
    const midi = createMidiFile(notes, arrangement.tempo, `${arrangement.artist}_${type}`);
    downloadMidi(midi, `${selectedArtist}_${type}_${keyName}_${arrangement.structure.replace(/\s/g, '_')}.mid`);
  }, [arrangement, keyTranspose, selectedArtist]);

  const toggleInst = (key) => setInstruments(prev => ({ ...prev, [key]: !prev[key] }));
  const displayKey = NOTES[keyTranspose] || 'C';
  const artist = ARTISTS[selectedArtist];

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="app">
      <div className="bg bg1" />
      <div className="bg bg2" />
      
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1>R&B Producer Pro</h1>
          <p>Full Song Structures • Artist Styles • Professional Production</p>
          
          {!audioReady && (
            <button className="btn-enable" onClick={initAudio} disabled={isLoading}>
              {isLoading ? 'Loading Instruments...' : '🎹 Enable Audio'}
            </button>
          )}
        </header>

        {/* Artist Selection */}
        <section className="panel">
          <h3 className="label">Select Artist Style</h3>
          <div className="artist-grid">
            {Object.entries(ARTISTS).map(([key, art]) => (
              <button 
                key={key}
                className={`artist-btn ${selectedArtist === key ? 'active' : ''}`}
                style={{ '--color': art.color }}
                onClick={() => setSelectedArtist(key)}
              >
                <strong>{art.name}</strong>
                <span>{art.description}</span>
                <div className="artist-tags">
                  {art.style_tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Controls Row */}
        <div className="controls-row">
          {/* Key Selection */}
          <div className="panel control-panel">
            <h3 className="label">Key: <span className="value">{displayKey}</span></h3>
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

          {/* Song Info */}
          {arrangement && (
            <div className="panel control-panel song-info">
              <h3 className="label">Song Info</h3>
              <div className="info-grid">
                <div>Structure: <span>{arrangement.structure}</span></div>
                <div>Tempo: <span>{arrangement.tempo} BPM</span></div>
                <div>Duration: <span>{arrangement.durationFormatted}</span></div>
                <div>Sections: <span>{arrangement.sections.length}</span></div>
              </div>
            </div>
          )}

          {/* Reverb */}
          <div className="panel control-panel">
            <h3 className="label">Reverb: <span className="value">{Math.round(reverbAmount * 100)}%</span></h3>
            <input 
              type="range" 
              min="0" max="0.5" step="0.05" 
              value={reverbAmount} 
              onChange={e => setReverbAmount(+e.target.value)} 
            />
          </div>
        </div>

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

        {/* Song Structure Visualization */}
        {arrangement && (
          <section className="panel song-panel">
            <div className="song-header">
              <h3 className="label">
                {arrangement.artist} - {arrangement.structure} 
                <span className="gen-badge">#{genCount}</span>
              </h3>
              <button className="btn-regen" onClick={generateNew}>🎲 New Arrangement</button>
            </div>
            
            {/* Progress bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${(playbackTime / arrangement.durationSeconds) * 100}%`,
                    background: `linear-gradient(90deg, ${artist?.color || '#8b5cf6'}, #ec4899)`
                  }} 
                />
              </div>
              <div className="progress-time">
                <span>{formatTime(playbackTime)}</span>
                <span>{arrangement.durationFormatted}</span>
              </div>
            </div>

            {/* Section overview */}
            <div className="sections-overview">
              {arrangement.sections.map((section, idx) => (
                <div 
                  key={idx}
                  className={`section-block ${currentSection === idx ? 'active' : ''}`}
                  style={{ 
                    flex: section.bars,
                    '--color': artist?.color || '#8b5cf6',
                    opacity: 0.4 + (section.energy * 0.6)
                  }}
                >
                  <span className="section-name">{section.name}</span>
                </div>
              ))}
            </div>

            {/* Current section detail */}
            {arrangement.sections[currentSection >= 0 ? currentSection : 0] && (
              <div className="current-section">
                <h4 style={{ color: artist?.color }}>
                  {arrangement.sections[currentSection >= 0 ? currentSection : 0].name}
                </h4>
                <p>{arrangement.sections[currentSection >= 0 ? currentSection : 0].description}</p>
                
                <div className="chord-display">
                  {arrangement.sections[currentSection >= 0 ? currentSection : 0].chords.map((chord, idx) => (
                    <div 
                      key={idx}
                      className={`chord-card ${currentSection >= 0 && currentChord === idx ? 'active' : ''}`}
                      style={{ '--color': chord.color }}
                    >
                      <div className="chord-name">{chord.name}</div>
                      <div className="chord-type">{chord.typeName}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Play controls */}
            <div className="play-controls">
              <button 
                className={`btn-play ${isPlaying ? 'stop' : ''}`}
                onClick={handlePlay}
                disabled={!audioReady}
              >
                {isPlaying ? '■ Stop' : '▶ Play Full Song'}
              </button>
              <button className="btn-shuffle" onClick={generateNew}>
                🔀 Generate New
              </button>
            </div>
          </section>
        )}

        {/* Full song structure breakdown */}
        {arrangement && (
          <section className="panel structure-panel">
            <h3 className="label">Full Song Structure</h3>
            <div className="structure-timeline">
              {arrangement.sections.map((section, idx) => (
                <div 
                  key={idx} 
                  className={`structure-section ${currentSection === idx ? 'playing' : ''}`}
                  style={{ '--color': artist?.color }}
                >
                  <div className="section-header">
                    <span className="section-num">{idx + 1}</span>
                    <span className="section-title">{section.name}</span>
                    <span className="section-bars">{section.bars} bars</span>
                  </div>
                  <div className="section-chords">
                    {section.progression.join(' → ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Export */}
        <section className="panel export-panel">
          <h3 className="label">Export Full Song MIDI</h3>
          <div className="export-grid">
            {[
              { type: 'piano', label: '🎹 Piano', color: '#8b5cf6' },
              { type: 'pad', label: '🎛️ Pad', color: '#14b8a6' },
              { type: 'bass', label: '🎸 Bass', color: '#f97316' },
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
          <button className="btn-export-full" onClick={() => exportMidi('full')}>
            📦 Export Complete Song ({arrangement?.durationFormatted})
          </button>
        </section>
      </div>
    </div>
  );
}
