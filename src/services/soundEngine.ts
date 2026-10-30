/**
 * Professional Romantic Audio Engine for Continuous Song Playback & Sound Effects
 * Supports HTML5 Audio for custom MP3 ("Baguens, mon amour, mon bonheur") with:
 * - Smooth fade-in
 * - Cross-scene continuous playback without interruption
 * - Scene-adaptive dynamic volume adjustments (dim for cake, crescendo for fireworks)
 * - Heart-shaped floating controls (play, pause, restart, volume, seek)
 * - Fallback to procedural Web Audio synthesizer if no audio file is provided.
 */

type AudioStateListener = (state: {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  trackName: string;
}) => void;

class RomanticSoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private isMuted = false;
  private userVolume = 0.7; // User preferred volume (0 to 1)
  private sceneMultiplier = 1.0; // Dynamic multiplier based on current scene
  private musicInterval: number | null = null;
  private currentStep = 0;
  private tempo = 64; // gentle romantic tempo bpm
  private customAudio: HTMLAudioElement | null = null;
  private melodyType: 'piano' | 'harp' | 'celesta' = 'piano';
  private trackName = 'Baguens, mon amour, mon bonheur';
  private trackUrl = '/assets/aistudio/Joyeux_anniversaire__mon__2__8fafcb2d.mp3';
  private listeners: Set<AudioStateListener> = new Set();
  private fadeInterval: number | null = null;

  constructor() {
    // Setup audio element for HTML5 playback
    this.setupAudioElement(this.trackUrl, this.trackName);
  }

  private setupAudioElement(url: string, name: string) {
    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.src = '';
      this.customAudio = null;
    }

    this.trackUrl = url;
    this.trackName = name;

    try {
      const audio = new Audio();
      audio.src = url;
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.getEffectiveVolume();

      audio.addEventListener('play', () => {
        this.isMusicPlaying = true;
        this.notifyListeners();
      });

      audio.addEventListener('pause', () => {
        this.isMusicPlaying = false;
        this.notifyListeners();
      });

      audio.addEventListener('timeupdate', () => {
        this.notifyListeners();
      });

      audio.addEventListener('loadedmetadata', () => {
        this.notifyListeners();
      });

      audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      });

      this.customAudio = audio;
    } catch (e) {
      console.warn('Could not initialize HTMLAudioElement:', e);
    }
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error('Audio listener error:', err);
      }
    });
  }

  public getState() {
    return {
      isPlaying: this.isMusicPlaying,
      isMuted: this.isMuted,
      volume: this.userVolume,
      currentTime: this.customAudio?.currentTime || 0,
      duration: this.customAudio?.duration || 264, // ~4:24 for default song
      trackName: this.trackName,
    };
  }

  private getEffectiveVolume(): number {
    if (this.isMuted) return 0;
    const vol = this.userVolume * this.sceneMultiplier;
    return Math.max(0, Math.min(1, vol));
  }

  private updateEffectiveVolume(smooth = false) {
    const target = this.getEffectiveVolume();

    if (this.customAudio) {
      if (!smooth) {
        this.customAudio.volume = target;
      } else {
        // Smooth fade towards target volume
        if (this.fadeInterval) clearInterval(this.fadeInterval);
        const start = this.customAudio.volume;
        const diff = target - start;
        const steps = 20;
        let step = 0;

        this.fadeInterval = window.setInterval(() => {
          step++;
          if (this.customAudio) {
            this.customAudio.volume = Math.max(0, Math.min(1, start + (diff * (step / steps))));
          }
          if (step >= steps) {
            if (this.fadeInterval) clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
        }, 50);
      }
    }

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(target * 0.4, this.ctx.currentTime, smooth ? 0.8 : 0.05);
    }
    this.notifyListeners();
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Master music bus with gentle lowpass filter for warm, intimate romantic ambiance
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2400;
        filter.Q.value = 1.0;

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.35;

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.6;

        this.musicGain.connect(filter);
        filter.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Initialize or replace custom song
   */
  public setCustomAudio(url?: string, name?: string, autoPlay = false) {
    if (this.customAudio) {
      this.customAudio.pause();
    }

    if (url) {
      this.stopProceduralMusic();
      this.setupAudioElement(url, name || 'Baguens, mon amour, mon bonheur');
      if (autoPlay) {
        this.startMusic(true);
      }
    } else {
      // Fallback to procedural
      if (this.customAudio) {
        this.customAudio.pause();
        this.customAudio = null;
      }
      if (autoPlay) {
        this.startProceduralMusic();
      }
    }
  }

  /**
   * Adapts music volume dynamically to the active scene
   * - Scene 4 (Gâteau): slightly reduce volume so the candle animations and breath blowing stand out
   * - Scene 9 (Surprise Finale): increase volume for fireworks and the grand romantic message
   * - Other scenes: standard volume
   */
  public adaptToScene(sceneId: number) {
    if (sceneId === 4) {
      // Cake scene: softer volume for intimate wish & breath sounds
      this.sceneMultiplier = 0.6;
    } else if (sceneId === 9) {
      // Grand Finale: crescendo for fireworks
      this.sceneMultiplier = 1.15;
    } else {
      // Standard scenes (Ballroom, dinner, garden, etc.)
      this.sceneMultiplier = 1.0;
    }
    this.updateEffectiveVolume(true);
  }

  public setVolume(vol: number) {
    this.userVolume = Math.max(0, Math.min(1, vol));
    if (this.userVolume > 0 && this.isMuted) {
      this.isMuted = false;
    }
    this.updateEffectiveVolume(false);
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.updateEffectiveVolume(true);
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  public getTrackName(): string {
    return this.trackName;
  }

  public getTrackUrl(): string {
    return this.trackUrl;
  }

  public seek(seconds: number) {
    if (this.customAudio && !isNaN(this.customAudio.duration)) {
      this.customAudio.currentTime = Math.max(0, Math.min(seconds, this.customAudio.duration));
      this.notifyListeners();
    }
  }

  public restartMusic() {
    if (this.customAudio) {
      this.customAudio.currentTime = 0;
      this.customAudio.play().catch(() => {});
      this.isMusicPlaying = true;
      this.notifyListeners();
    } else {
      this.stopProceduralMusic();
      this.startProceduralMusic();
    }
  }

  public pauseMusic() {
    if (this.customAudio) {
      this.customAudio.pause();
    }
    this.stopProceduralMusic();
    this.isMusicPlaying = false;
    this.notifyListeners();
  }

  public resumeMusic() {
    this.startMusic(false);
  }

  public togglePlayPause() {
    if (this.isMusicPlaying) {
      this.pauseMusic();
    } else {
      this.resumeMusic();
    }
  }

  /**
   * Start music with gentle fade-in
   */
  public startMusic(fadeIn = true) {
    this.initContext();

    if (this.customAudio) {
      // Start at lower volume and ramp up if fadeIn
      if (fadeIn) {
        this.customAudio.volume = 0.05;
      } else {
        this.customAudio.volume = this.getEffectiveVolume();
      }

      const playPromise = this.customAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            if (fadeIn) {
              this.updateEffectiveVolume(true);
            }
            this.notifyListeners();
          })
          .catch((err) => {
            console.warn('Autoplay prevented. Audio will resume on user interaction.', err);
          });
      }
      return;
    }

    // Procedural fallback
    this.startProceduralMusic();
  }

  public stopMusic() {
    this.pauseMusic();
  }

  public setMelodyType(type: 'piano' | 'harp' | 'celesta') {
    this.melodyType = type;
  }

  // --- PROCEDURAL FALLBACK MUSIC ---
  private startProceduralMusic() {
    if (this.musicInterval) return;
    this.isMusicPlaying = true;

    const progressions = [
      { root: 174.61, notes: [174.61, 220.0, 261.63, 349.23, 440.0, 523.25, 659.25] },
      { root: 130.81, notes: [130.81, 196.0, 261.63, 329.63, 392.0, 493.88, 523.25] },
      { root: 146.83, notes: [146.83, 220.0, 293.66, 349.23, 440.0, 523.25, 587.33] },
      { root: 116.54, notes: [116.54, 174.61, 233.08, 293.66, 349.23, 440.0, 523.25] },
      { root: 110.0, notes: [110.0, 164.81, 220.0, 261.63, 329.63, 392.0, 493.88] },
      { root: 116.54, notes: [116.54, 146.83, 174.61, 233.08, 293.66, 349.23, 440.0] },
      { root: 130.81, notes: [130.81, 196.0, 261.63, 349.23, 392.0, 523.25, 659.25] },
    ];

    let chordIdx = 0;
    let arpeggioStep = 0;
    const stepDurationMs = (60 / this.tempo) * 500;

    this.musicInterval = window.setInterval(() => {
      if (!this.ctx || !this.musicGain || this.isMuted) return;

      const chord = progressions[chordIdx];
      if (arpeggioStep === 0) {
        this.playProceduralNote(chord.root, 0.28, 2.8, 'sine');
      }

      const noteIdx = (arpeggioStep * 2 + (chordIdx % 3)) % chord.notes.length;
      const freq = chord.notes[noteIdx];
      const noteType =
        this.melodyType === 'harp' ? 'triangle' : this.melodyType === 'celesta' ? 'sine' : 'triangle';
      this.playProceduralNote(freq, 0.14, 1.8, noteType);

      arpeggioStep++;
      if (arpeggioStep >= 8) {
        arpeggioStep = 0;
        chordIdx = (chordIdx + 1) % progressions.length;
      }
    }, stepDurationMs);

    this.notifyListeners();
  }

  private stopProceduralMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  private playProceduralNote(
    freq: number,
    peakGain: number,
    duration: number,
    type: OscillatorType = 'triangle'
  ) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(peakGain * this.getEffectiveVolume(), now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // AudioContext safe catch
    }
  }

  // --- SOUND EFFECTS ---
  public playEnvelopeOpen() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);
    filter.Q.setValueAtTime(2.5, now);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
    this.playChime(660, 0.15);
  }

  public playDoorOpen() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 1.2);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 1.5);
  }

  public playCandleBlow() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.5);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);
    noise.start(now);
  }

  public playChime(baseFreq = 880, volume = 0.25) {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
    freqs.forEach((f, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const now = this.ctx.currentTime + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(volume * (1 - idx * 0.15), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.85);
    });
  }

  public playChampagneClink() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(2340, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(4680, now);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.sfxGain);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
  }

  public playFirework() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const launchOsc = this.ctx.createOscillator();
    const launchGain = this.ctx.createGain();
    launchOsc.frequency.setValueAtTime(300, now);
    launchOsc.frequency.exponentialRampToValueAtTime(950, now + 0.3);
    launchGain.gain.setValueAtTime(0.12, now);
    launchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);
    launchOsc.connect(launchGain);
    launchGain.connect(this.sfxGain);
    launchOsc.start(now);
    launchOsc.stop(now + 0.35);

    const boomDelay = 0.32;
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();
    boomOsc.type = 'sine';
    boomOsc.frequency.setValueAtTime(140, now + boomDelay);
    boomOsc.frequency.exponentialRampToValueAtTime(35, now + boomDelay + 0.7);
    boomGain.gain.setValueAtTime(0.0, now);
    boomGain.gain.setValueAtTime(0.5, now + boomDelay);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + boomDelay + 1.1);
    boomOsc.connect(boomGain);
    boomGain.connect(this.sfxGain);
    boomOsc.start(now + boomDelay);
    boomOsc.stop(now + boomDelay + 1.2);

    setTimeout(() => {
      this.playChime(1200 + Math.random() * 400, 0.18);
    }, 450);
  }

  public playConfetti() {
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.2);
  }
}

export const soundEngine = new RomanticSoundEngine();
