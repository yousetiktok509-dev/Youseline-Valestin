import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, MailOpen } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';

interface Scene1Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene1Invitation: React.FC<Scene1Props> = ({ config, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate gentle starry background
    const items = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
    }));
    setStars(items);
  }, []);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    soundEngine.playEnvelopeOpen();
    setIsOpen(true);
  };

  const handleProceed = () => {
    soundEngine.playChime(784, 0.2);
    // Song begins gently with smooth fade-in after Baguens clicks "Découvrir ma surprise"
    soundEngine.startMusic(true);
    onNext();
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden bg-gradient-to-b from-[#090205] via-[#14050b] to-[#080204]">
      {/* Twinkling ambient starry night */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-[#fcedbb] animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: 0.6,
              animationDuration: `${2 + star.delay}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Floating subtle ambient glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#7d1224]/20 blur-3xl pointer-events-none -translate-y-8" />

      {/* Main Experience Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="text-center mb-6 sm:mb-8 z-10"
      >
        <span className="inline-block text-[11px] sm:text-xs font-cinzel tracking-[0.3em] uppercase text-[#e5c158] opacity-90 mb-2">
          Célébration Exclusive · {config.birthdayDate}
        </span>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-cinzel font-bold text-gold-gradient tracking-wide px-2">
          UNE NUIT MAGIQUE POUR {config.honoreeName.toUpperCase()} ❤️
        </h1>
      </motion.div>

      {/* The Romantic Bordeaux Envelope & Letter */}
      <div className="relative z-20 w-full max-w-[360px] sm:max-w-[420px] aspect-[4/3] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* CLOSED ENVELOPE */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.8 }}
              onClick={handleOpenEnvelope}
              className="group cursor-pointer relative w-full h-full rounded-2xl p-6 flex flex-col justify-between shadow-2xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                background: 'linear-gradient(135deg, #7d1224 0%, #4a0914 100%)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7), 0 0 30px rgba(229,193,88,0.25)',
                border: '1.5px solid rgba(229,193,88,0.5)',
              }}
            >
              {/* Envelope flap aesthetic styling */}
              <div
                className="absolute inset-x-0 top-0 h-1/2 rounded-t-2xl pointer-events-none"
                style={{
                  background: 'linear-gradient(180deg, rgba(229,193,88,0.15) 0%, transparent 100%)',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  borderBottom: '1px solid rgba(229,193,88,0.3)',
                }}
              />

              {/* Gold border accent inner */}
              <div className="absolute inset-3 border border-[#e5c158]/30 rounded-xl pointer-events-none" />

              {/* Envelope Header / Postage */}
              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-1.5 text-[#e5c158]/80 text-xs font-cinzel">
                  <Sparkles className="w-3.5 h-3.5 text-[#e5c158]" />
                  <span>CONFIDENTIEL</span>
                </div>
                {/* Gold postage stamp */}
                <div className="w-10 h-12 border-2 border-dashed border-[#e5c158]/60 bg-[#500b17] rounded flex flex-col items-center justify-center text-[10px] text-[#e5c158] font-cinzel">
                  <span>30</span>
                  <span className="text-[8px] uppercase">OCT</span>
                  <Heart className="w-2.5 h-2.5 fill-[#e5c158] text-[#e5c158]" />
                </div>
              </div>

              {/* Front Label with Honoree Name */}
              <div className="my-auto text-center z-10 py-3">
                <p className="text-xs font-serif italic text-[#f1cbd2]/80 mb-1">
                  Invitation Spéciale
                </p>
                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-gold-gradient tracking-wide">
                  Pour mon amour, {config.honoreeName} ❤️
                </h2>
              </div>

              {/* Golden Wax Seal with "B" Monogram */}
              <div className="flex flex-col items-center justify-center z-10">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#a67c1e] via-[#f1d06e] to-[#cba034] shadow-lg flex items-center justify-center border-2 border-[#fff1bd] gold-glow"
                >
                  <span className="text-xl font-cinzel font-bold text-[#4a0914]">
                    {config.honoreeName.charAt(0)}
                  </span>
                </motion.div>
                <span className="mt-2 text-xs font-sans tracking-wide text-[#fcf8f2]/90 flex items-center gap-1.5 bg-[#3a0610]/60 px-3 py-1 rounded-full border border-[#e5c158]/40">
                  <MailOpen className="w-3.5 h-3.5 text-[#e5c158]" />
                  Ouvre ton invitation 💌
                </span>
              </div>
            </motion.div>
          ) : (
            /* OPENED LETTER */
            <motion.div
              key="opened-letter"
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-2xl text-[#1a080c]"
              style={{
                background: 'linear-gradient(135deg, #fdfaf3 0%, #f6edd9 100%)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.8), 0 0 35px rgba(229,193,88,0.4)',
                border: '2px solid rgba(229,193,88,0.7)',
                minHeight: '380px',
              }}
            >
              {/* Gold border decorative line */}
              <div className="absolute inset-2.5 border border-[#cba034]/40 rounded-xl pointer-events-none" />

              {/* Letter Header */}
              <div className="flex justify-between items-center pb-3 border-b border-[#cba034]/30">
                <div className="flex items-center gap-1 text-[#7d1224] font-cinzel text-xs font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-[#7d1224]" />
                  <span>POUR BAGUENS</span>
                </div>
                <span className="text-[11px] font-cinzel text-[#8c6b16] tracking-widest uppercase">
                  {config.birthdayDate}
                </span>
              </div>

              {/* Letter Prose (From prompt requirement) */}
              <div className="my-4 text-left font-playfair text-[#2a0e14] text-sm sm:text-base leading-relaxed space-y-3 overflow-y-auto max-h-[220px] pr-1">
                <p className="font-semibold text-[#7d1224] text-base sm:text-lg">
                  Mon amour,
                </p>
                <p>
                  Aujourd&apos;hui, j&apos;ai préparé quelque chose de spécial pour toi. Même si je ne suis pas physiquement à tes côtés, je voulais que tu vives un anniversaire différent.
                </p>
                <p>
                  Cette soirée est entièrement pour toi. Laisse-moi t&apos;emmener dans un endroit où chaque détail a été préparé avec amour.
                </p>
                <p className="font-semibold text-[#7d1224]">
                  Joyeux anniversaire, mon Baguens. ❤️
                </p>
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceed}
                className="w-full py-3 px-5 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase text-[#fff] flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #7d1224 0%, #4a0914 100%)',
                  border: '1px solid #e5c158',
                  boxShadow: '0 6px 18px rgba(125,18,36,0.5)',
                }}
              >
                <span>Découvrir ma surprise</span>
                <Sparkles className="w-4 h-4 text-[#e5c158]" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle music hint */}
      <p className="text-[11px] font-sans text-[#fcf8f2]/50 mt-6 tracking-wide z-10 text-center">
        Expérience immersive sonore · Active le son pour une magie totale
      </p>
    </div>
  );
};
