import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Wine, Flame, Heart, ArrowRight, Music, X } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';

interface Scene6Props {
  config: PartyConfig;
  onNext: () => void;
}

export const Scene6RomanticDinner: React.FC<Scene6Props> = ({ config, onNext }) => {
  const [candlesOn, setCandlesOn] = useState(true);
  const [showPlateNote, setShowPlateNote] = useState(false);
  const [showRoseNote, setShowRoseNote] = useState(false);
  const [toastCheers, setToastCheers] = useState(false);

  const toggleCandles = () => {
    setCandlesOn((prev) => {
      const next = !prev;
      if (next) soundEngine.playChime(784, 0.2);
      else soundEngine.playCandleBlow();
      return next;
    });
  };

  const handleToast = () => {
    soundEngine.playChampagneClink();
    setToastCheers(true);
    setTimeout(() => setToastCheers(false), 2400);
  };

  const handleOpenRoseNote = () => {
    soundEngine.playChime(880, 0.25);
    setShowRoseNote(true);
  };

  const handleOpenPlateNote = () => {
    soundEngine.playChime(659, 0.25);
    setShowPlateNote(true);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 bg-gradient-to-b from-[#060205] via-[#15050e] to-[#0a0206] text-[#fcf8f2] overflow-x-hidden">
      {/* Starry Night Sky Background with ambient terrace terrace glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Distant garden glow & fountain mist */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-[#0d2215]/30 to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#ffd778]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center mt-2 mb-4">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
          ✦ RENDEZ-VOUS EN TÊTE-À-TÊTE ✦
        </span>
        <h1 className="text-xl sm:text-3xl font-cinzel font-bold text-gold-gradient tracking-wide mt-1">
          LE DÎNER ROMANTIQUE VIRTUEL
        </h1>
        <p className="font-playfair text-[#f1cbd2] text-xs sm:text-base italic mt-1.5 drop-shadow">
          « Même à distance, j&apos;avais envie de partager un dîner romantique avec toi. »
        </p>
      </div>

      {/* Main Luxury Interactive Terrace & Table Showcase */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-2 sm:my-4">
        {/* Terrace Balcony Setting Container */}
        <div className="relative w-full rounded-3xl p-5 sm:p-8 bordeaux-card border border-[#e5c158]/40 shadow-2xl overflow-hidden">
          {/* Subtle terrace railing backdrop and garden fountain view */}
          <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#100308] to-transparent pointer-events-none opacity-60 flex justify-between px-6 items-center">
            <span className="text-[11px] font-cinzel text-[#e5c158]/50 tracking-widest">
              TERRASSE SOUS LES ÉTOILES
            </span>
            <span className="text-[11px] font-sans text-[#f1cbd2]/50">
              Fontaine &amp; Roses à l&apos;horizon
            </span>
          </div>

          {/* Interactive Dinner Table Layout */}
          <div className="relative mt-8 max-w-xl mx-auto bg-gradient-to-b from-[#fdfbf7] to-[#f4ede1] rounded-2xl p-6 sm:p-8 text-[#250810] shadow-2xl border-4 border-[#e5c158]">
            {/* Table Gold Inlay trim */}
            <div className="absolute inset-2 border border-[#d4af37]/40 rounded-xl pointer-events-none" />

            {/* Chairs Header: Baguens & Ton amour */}
            <div className="flex justify-between items-center mb-6">
              {/* Baguens Chair */}
              <div className="flex items-center gap-2 bg-[#7d1224] text-[#fff] px-3.5 py-1.5 rounded-full border border-[#e5c158] shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e5c158] shadow-[0_0_8px_#e5c158]" />
                <span className="font-cinzel text-xs font-bold tracking-wider uppercase">
                  Place : {config.honoreeName}
                </span>
              </div>

              {/* Ton amour Chair */}
              <div className="flex items-center gap-2 bg-[#4a0815] text-[#fff] px-3.5 py-1.5 rounded-full border border-[#e5c158]/70 shadow-md">
                <Heart className="w-3.5 h-3.5 fill-[#e5c158] text-[#e5c158]" />
                <span className="font-cinzel text-xs font-bold tracking-wider uppercase">
                  Place : {config.senderSignature}
                </span>
              </div>
            </div>

            {/* Table Center: Candelabra, Roses, Plates, Champagne */}
            <div className="grid grid-cols-3 gap-3 items-center py-4">
              {/* Left: Baguens' Plate with Secret Note Underneath */}
              <div className="flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenPlateNote}
                  className="cursor-pointer relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white shadow-xl border-4 border-[#e5c158] flex flex-col items-center justify-center p-2 group hover:gold-glow"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-dashed border-[#c59e2b] flex items-center justify-center text-center">
                    <span className="text-[9px] sm:text-[10px] font-cinzel font-bold text-[#7d1224]">
                      Assiette de Baguens
                    </span>
                  </div>
                  <span className="absolute -bottom-2 bg-[#9e1b32] text-white text-[9px] font-sans px-2 py-0.5 rounded-full border border-[#e5c158]">
                    Touche l&apos;assiette 💌
                  </span>
                </motion.div>
              </div>

              {/* Center: Candelabra and Floral Bouquet */}
              <div className="flex flex-col items-center gap-3">
                {/* Interactive Candles */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleCandles}
                  className="cursor-pointer flex flex-col items-center p-2 rounded-xl bg-[#2b0811]/10 hover:bg-[#2b0811]/20 transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-[#e5c158]">
                    <Flame
                      className={`w-6 h-6 transition-all duration-300 ${
                        candlesOn
                          ? 'fill-[#ffa500] text-[#ff4500] drop-shadow-[0_0_12px_#ff9900]'
                          : 'text-gray-400 opacity-40'
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-cinzel font-bold text-[#7d1224] mt-1">
                    {candlesOn ? 'Bougies Allumées 🕯️' : 'Bougies Éteintes'}
                  </span>
                </motion.button>

                {/* Bouquet of Red Roses */}
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenRoseNote}
                  className="cursor-pointer relative p-2 rounded-xl bg-[#7d1224]/10 hover:bg-[#7d1224]/20 flex flex-col items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#9e1b32] text-white flex items-center justify-center shadow-lg border border-[#e5c158]">
                    <Heart className="w-5 h-5 fill-white text-white" />
                  </div>
                  <span className="text-[10px] font-cinzel font-bold text-[#7d1224] mt-1">
                    Bouquet de Roses 🌹
                  </span>
                  <span className="text-[8px] text-[#7d1224]/80 font-sans">
                    (Touche les fleurs)
                  </span>
                </motion.div>
              </div>

              {/* Right: Crystal Champagne Flutes & Toast */}
              <div className="flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToast}
                  className="cursor-pointer relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f8f1e5] shadow-xl border-4 border-[#e5c158] flex flex-col items-center justify-center p-2 group hover:gold-glow"
                >
                  <div className="flex items-center justify-center gap-1 text-[#7d1224]">
                    <Wine className="w-6 h-6 sm:w-7 sm:h-7 text-[#e5c158] -rotate-12" />
                    <Wine className="w-6 h-6 sm:w-7 sm:h-7 text-[#e5c158] rotate-12" />
                  </div>
                  <span className="absolute -bottom-2 bg-[#e5c158] text-[#3f0912] text-[9px] font-cinzel font-bold px-2 py-0.5 rounded-full border border-[#fff1bd]">
                    Trinquer 🥂
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Toast animation notification */}
            <AnimatePresence>
              {toastCheers && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="mt-3 text-center py-2 px-4 rounded-xl bg-[#7d1224] text-[#fff] font-cinzel text-xs font-bold border border-[#e5c158] shadow-lg"
                >
                  🥂 « À toi, mon Baguens ! À notre amour et à toutes les années magiques qui nous attendent ! Santé ! ❤️ »
                </motion.div>
              )}
            </AnimatePresence>

            {/* Framed Couple Portrait on Table */}
            <div className="mt-5 flex justify-center">
              <div className="flex items-center gap-3 bg-[#24060e] p-2.5 rounded-2xl border-2 border-[#e5c158] gold-glow max-w-sm shadow-xl">
                <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl overflow-hidden border border-[#e5c158] shrink-0">
                  <img
                    src="/assets/aistudio/file_00000000631c81f5978642333dc07885_6062089f.png"
                    alt="Baguens et son amour"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="font-cinzel text-xs font-bold text-gold-gradient block">
                    Baguens &amp; Son Amour ❤️
                  </span>
                  <p className="font-playfair text-[11px] text-[#f1cbd2] italic mt-0.5">
                    « Rien ne sépare deux cœurs qui s&apos;aiment profondément. »
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secret Note Modal: Under Plate */}
      <AnimatePresence>
        {showPlateNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-md bordeaux-card rounded-2xl p-6 shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2]"
            >
              <button
                onClick={() => setShowPlateNote(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#3a0914] text-[#e5c158] flex items-center justify-center hover:bg-[#520d1c] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-cinzel text-[#e5c158] tracking-widest uppercase block mb-1">
                Mot secret sous ton assiette 💌
              </span>
              <h3 className="font-cinzel text-lg font-bold text-gold-gradient mb-3">
                Pour mon Baguens chéri
              </h3>

              <div className="bg-[#24060e] p-4 rounded-xl border border-[#e5c158]/40 mb-4">
                <p className="font-playfair text-base sm:text-lg leading-relaxed text-[#fcf8f2] italic">
                  « {config.dinnerSecretNote} »
                </p>
              </div>

              <button
                onClick={() => setShowPlateNote(false)}
                className="w-full py-2.5 rounded-xl font-cinzel text-xs font-bold text-white bg-[#9e1b32] hover:bg-[#b5203b] border border-[#e5c158]/50 cursor-pointer"
              >
                Garder précieusement dans mon cœur ❤️
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Secret Note Modal: Under Bouquet of Roses */}
      <AnimatePresence>
        {showRoseNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-md bordeaux-card rounded-2xl p-6 shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2]"
            >
              <button
                onClick={() => setShowRoseNote(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#3a0914] text-[#e5c158] flex items-center justify-center hover:bg-[#520d1c] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-xs font-cinzel text-[#e5c158] tracking-widest uppercase block mb-1">
                Le secret des roses rouges 🌹
              </span>
              <h3 className="font-cinzel text-lg font-bold text-gold-gradient mb-3">
                Mille raisons de t&apos;aimer
              </h3>

              <div className="bg-[#24060e] p-4 rounded-xl border border-[#e5c158]/40 mb-4">
                <p className="font-playfair text-base sm:text-lg leading-relaxed text-[#fcf8f2] italic">
                  « {config.roseHiddenNote} »
                </p>
              </div>

              <button
                onClick={() => setShowRoseNote(false)}
                className="w-full py-2.5 rounded-xl font-cinzel text-xs font-bold text-white bg-[#9e1b32] hover:bg-[#b5203b] border border-[#e5c158]/50 cursor-pointer"
              >
                Fermer 🌹
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom CTA to Gift Room */}
      <div className="relative z-10 flex justify-center mt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNext}
          className="py-3 px-8 rounded-xl font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase text-white flex items-center gap-2 shadow-xl cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #9e1b32 0%, #5b0e1b 100%)',
            border: '1.5px solid #e5c158',
            boxShadow: '0 8px 24px rgba(158,27,50,0.6)',
          }}
        >
          <span>Entrer dans la Salle des Cadeaux 🎁</span>
          <ArrowRight className="w-4 h-4 text-[#e5c158]" />
        </motion.button>
      </div>
    </div>
  );
};
