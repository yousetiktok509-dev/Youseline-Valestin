import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Heart, KeyRound, Sparkles } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface PasscodeLockProps {
  correctCode: string;
  honoreeName: string;
  onUnlock: () => void;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({ correctCode, honoreeName, onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() === correctCode.trim()) {
      soundEngine.playChime(880, 0.3);
      onUnlock();
    } else {
      setError(true);
      soundEngine.playCandleBlow();
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-[#080205] via-[#16050e] to-[#0a0206] text-[#fcf8f2]">
      {/* Background glow */}
      <div className="absolute w-80 h-80 bg-[#7d1224]/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`relative w-full max-w-sm bordeaux-card rounded-2xl p-6 sm:p-8 text-center shadow-2xl border-2 border-[#e5c158] gold-glow ${
          error ? 'animate-shake' : ''
        }`}
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#9e1b32] to-[#500b17] border-2 border-[#e5c158] flex items-center justify-center shadow-lg mb-4">
          <Lock className="w-6 h-6 text-[#e5c158]" />
        </div>

        <span className="text-[10px] font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
          ✦ ACCÈS PRIVÉ &amp; SÉCURISÉ ✦
        </span>
        <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-gold-gradient mt-1">
          Pour {honoreeName} ❤️
        </h2>
        <p className="font-playfair text-[#f1cbd2] text-xs sm:text-sm mt-2 leading-relaxed italic">
          Cette fête d&apos;anniversaire virtuelle t&apos;est réservée. Entre ton code secret d&apos;accès.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#e5c158]" />
            <input
              type="password"
              maxLength={8}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Code d'accès secret"
              className="w-full bg-[#1e050d] border border-[#e5c158]/50 rounded-xl py-3 pl-10 pr-4 text-center font-cinzel text-lg tracking-[0.3em] text-[#fff] placeholder:text-[#f1cbd2]/30 focus:outline-none focus:border-[#e5c158] focus:gold-glow"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs text-[#ff5577] font-sans">
              Code incorrect. Demande à ton amour le code secret !
            </p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 rounded-xl font-cinzel font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #9e1b32 0%, #500b17 100%)',
              border: '1.5px solid #e5c158',
            }}
          >
            <Sparkles className="w-4 h-4 text-[#e5c158]" />
            <span>Déverrouiller ma fête</span>
          </motion.button>
        </form>

        <p className="text-[10px] font-sans text-[#f1cbd2]/50 mt-4">
          Indice : la date de ton anniversaire (3010)
        </p>
      </motion.div>
    </div>
  );
};
