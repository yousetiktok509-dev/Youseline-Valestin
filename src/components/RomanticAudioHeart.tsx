import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
  Heart,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Music,
  Sparkles,
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { PartyConfig } from '../types/party';

interface RomanticAudioHeartProps {
  config: PartyConfig;
}

export const RomanticAudioHeart: React.FC<RomanticAudioHeartProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [audioState, setAudioState] = useState(soundEngine.getState());

  useEffect(() => {
    // Subscribe to sound engine updates
    const unsubscribe = soundEngine.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePlay = () => {
    soundEngine.togglePlayPause();
  };

  const handleRestart = () => {
    soundEngine.restartMusic();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    soundEngine.setVolume(val);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    soundEngine.seek(time);
  };

  const progressPercent = audioState.duration > 0
    ? (audioState.currentTime / audioState.duration) * 100
    : 0;

  // Heartbeat animation synchronized to romantic tempo (~70 BPM, ~0.92s per beat cycle)
  // Double-beat pattern (systole / diastole "lub-dub") typical of a real beating heart
  const buttonHeartbeatVariants: Variants = {
    playing: {
      scale: [1, 1.12, 1.04, 1.18, 1, 1],
      boxShadow: [
        '0 0 12px rgba(229,193,88,0.4), 0 0 20px rgba(158,27,50,0.5)',
        '0 0 24px rgba(229,193,88,0.85), 0 0 35px rgba(255,51,102,0.7)',
        '0 0 16px rgba(229,193,88,0.5), 0 0 25px rgba(181,31,59,0.5)',
        '0 0 32px rgba(255,241,189,0.95), 0 0 45px rgba(229,193,88,0.85)',
        '0 0 12px rgba(229,193,88,0.4), 0 0 20px rgba(158,27,50,0.5)',
        '0 0 12px rgba(229,193,88,0.4), 0 0 20px rgba(158,27,50,0.5)',
      ],
      transition: {
        duration: 0.92,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.15, 0.28, 0.44, 0.64, 1],
      },
    },
    paused: {
      scale: 1,
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
      transition: { duration: 0.3 },
    },
  };

  const heartIconVariants: Variants = {
    beating: {
      scale: [1, 1.25, 1.1, 1.35, 1, 1],
      rotate: [0, -3, 0, 4, 0, 0],
      filter: [
        'drop-shadow(0 0 4px rgba(255,241,189,0.7))',
        'drop-shadow(0 0 12px rgba(255,215,120,1))',
        'drop-shadow(0 0 6px rgba(255,241,189,0.8))',
        'drop-shadow(0 0 16px rgba(255,77,109,1))',
        'drop-shadow(0 0 4px rgba(255,241,189,0.7))',
        'drop-shadow(0 0 4px rgba(255,241,189,0.7))',
      ],
      transition: {
        duration: 0.92,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.15, 0.28, 0.44, 0.64, 1],
      },
    },
    idle: {
      scale: 1,
      rotate: 0,
      filter: 'drop-shadow(0 0 0px transparent)',
      transition: { duration: 0.3 },
    },
  };

  const shockwaveVariants: Variants = {
    pulse: {
      scale: [1, 1.85],
      opacity: [0.75, 0],
      transition: {
        duration: 0.92,
        repeat: Infinity,
        ease: 'easeOut',
      },
    },
    idle: {
      scale: 1,
      opacity: 0,
    },
  };

  return (
    <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-40">
      {/* The Heart-Shaped Music Button with synchronized pulse */}
      <motion.button
        animate={audioState.isPlaying ? 'playing' : 'paused'}
        variants={buttonHeartbeatVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer border-2 z-10 ${
          audioState.isPlaying
            ? 'bg-gradient-to-tr from-[#9e1b32] via-[#b51f3b] to-[#e5c158] border-[#fff1bd]'
            : 'bg-gradient-to-tr from-[#3a0610] to-[#1a0307] border-[#e5c158]/50 hover:border-[#e5c158]'
        }`}
        title="Contrôles de la chanson pour Baguens"
      >
        {/* Synchronized Framer Motion shockwave ring when playing */}
        {audioState.isPlaying && (
          <motion.span
            animate="pulse"
            variants={shockwaveVariants}
            className="absolute inset-0 rounded-full border-2 border-[#e5c158] pointer-events-none"
          />
        )}

        {/* Heart Icon with synchronized heartbeat pulse & rotation */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={audioState.isPlaying ? 'beating' : 'idle'}
            variants={heartIconVariants}
            className="flex items-center justify-center"
          >
            <Heart
              className={`w-5 h-5 ${
                audioState.isPlaying
                  ? 'fill-[#fff1bd] text-[#fff1bd]'
                  : 'text-[#e5c158] fill-[#e5c158]/20'
              }`}
            />
          </motion.div>

          {audioState.isPlaying ? (
            <motion.span
              animate={{
                y: [-1, -6, -1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 0.92,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-1.5 -right-1 text-[11px] text-[#fff1bd] drop-shadow-[0_0_6px_#ffd778] pointer-events-none select-none font-bold"
            >
              ♫
            </motion.span>
          ) : (
            <Music className="w-2.5 h-2.5 absolute text-[#e5c158]/70 pointer-events-none" />
          )}
        </div>

        {/* Mini status indicator dot */}
        <span
          className={`absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full border border-black shadow-sm ${
            audioState.isPlaying ? 'bg-emerald-400' : 'bg-amber-500/70'
          }`}
        />
      </motion.button>

      {/* Floating Popup Controls Card */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click outside on mobile */}
            <div
              className="fixed inset-0 bg-black/40 -z-10 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-14 w-[300px] sm:w-[330px] bordeaux-card rounded-2xl p-4 sm:p-5 shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2] backdrop-blur-md overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#e5c158]/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#e5c158]/20 flex items-center justify-center border border-[#e5c158]/50 text-[#e5c158]">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-cinzel text-[#e5c158] tracking-widest uppercase block">
                      ✦ NOTRE CHANSON D&apos;ANNIVERSAIRE ✦
                    </span>
                    <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white truncate max-w-[200px]">
                      {config.customAudioName || 'Baguens, mon amour, mon bonheur'}
                    </h4>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-full bg-[#3d0915] text-[#e5c158] hover:bg-[#590e22] flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Scrubber */}
              <div className="my-3 space-y-1">
                <div className="relative w-full h-2 bg-[#1b050c] rounded-full overflow-hidden border border-[#e5c158]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#e5c158] to-[#ff3366] transition-all duration-150"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={audioState.duration || 100}
                    value={audioState.currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono text-[#f1cbd2]/80 px-0.5">
                  <span>{formatTime(audioState.currentTime)}</span>
                  <span>{formatTime(audioState.duration)}</span>
                </div>
              </div>

              {/* Playback Buttons */}
              <div className="flex items-center justify-center gap-3 py-1">
                {/* Restart from 0:00 */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleRestart}
                  className="p-2.5 rounded-full bg-[#2a0610] hover:bg-[#3f0918] border border-[#e5c158]/40 text-[#e5c158] transition-colors cursor-pointer shadow-md"
                  title="Recommencer la chanson"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>

                {/* Main Play / Pause */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTogglePlay}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#e5c158] via-[#ffd978] to-[#c29623] text-[#3a0610] flex items-center justify-center shadow-lg gold-glow cursor-pointer border border-[#fff1bd]"
                  title={audioState.isPlaying ? 'Mettre en pause' : 'Lancer la musique'}
                >
                  {audioState.isPlaying ? (
                    <Pause className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  )}
                </motion.button>

                {/* Mute toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => soundEngine.toggleMute()}
                  className="p-2.5 rounded-full bg-[#2a0610] hover:bg-[#3f0918] border border-[#e5c158]/40 text-[#e5c158] transition-colors cursor-pointer shadow-md"
                  title={audioState.isMuted ? 'Activer le son' : 'Couper le son'}
                >
                  {audioState.isMuted ? (
                    <VolumeX className="w-4 h-4 text-red-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {/* Volume Slider */}
              <div className="mt-3 pt-3 border-t border-[#e5c158]/20 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-[#e5c158]/80 shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={audioState.isMuted ? 0 : audioState.volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-[#e5c158] cursor-pointer h-1.5 rounded-lg bg-[#1a040b]"
                />
                <span className="text-[10px] font-mono text-[#e5c158] w-8 text-right">
                  {audioState.isMuted ? '0%' : `${Math.round(audioState.volume * 100)}%`}
                </span>
              </div>

              {/* Romantic Note */}
              <div className="mt-2.5 text-center">
                <p className="text-[10px] font-playfair text-[#f1cbd2]/80 italic flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#e5c158]" />
                  <span>Dédiée à Baguens avec tout mon amour ❤️</span>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
