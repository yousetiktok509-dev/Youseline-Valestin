import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Flame } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';

interface Scene9Props {
  config: PartyConfig;
  onRestart: () => void;
}

interface FireworkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

export const Scene9GrandFinale: React.FC<Scene9Props> = ({ config, onRestart }) => {
  const [countdown, setCountdown] = useState<number | null>(3);
  const [isFinaleActive, setIsFinaleActive] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const fireworksCanvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<FireworkParticle[]>([]);

  // 1. Countdown sequence 3... 2... 1...
  useEffect(() => {
    const t3 = setTimeout(() => {
      soundEngine.playChime(440, 0.2);
      setCountdown(2);
    }, 1200);

    const t2 = setTimeout(() => {
      soundEngine.playChime(554, 0.2);
      setCountdown(1);
    }, 2400);

    const t1 = setTimeout(() => {
      soundEngine.playChime(659, 0.3);
      setCountdown(null);
      triggerGrandFinale();
    }, 3600);

    return () => {
      clearTimeout(t3);
      clearTimeout(t2);
      clearTimeout(t1);
    };
  }, []);

  const triggerGrandFinale = () => {
    setIsFinaleActive(true);

    // Launch continuous fireworks audio and bursts
    soundEngine.playFirework();
    launchConfettiShower();

    const fireInterval = setInterval(() => {
      soundEngine.playFirework();
      createFireworkBurst();
    }, 1600);

    // Show emotional love letter after 3.5s of fireworks
    const letterTimer = setTimeout(() => {
      setShowLetter(true);
    }, 3200);

    return () => {
      clearInterval(fireInterval);
      clearTimeout(letterTimer);
    };
  };

  const launchConfettiShower = () => {
    const end = Date.now() + 6 * 1000;
    const colors = ['#e5c158', '#ffd700', '#c41e3a', '#9e1b32', '#f1cbd2', '#ffffff'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // 2. Realistic Canvas Fireworks Particle System
  const createFireworkBurst = () => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;

    const colors = ['#ffd700', '#e5c158', '#ff3366', '#ff4500', '#ffffff', '#f4a6b6'];
    const originX = Math.random() * canvas.width;
    const originY = (0.2 + Math.random() * 0.4) * canvas.height;
    const baseColor = colors[Math.floor(Math.random() * colors.length)];

    for (let i = 0; i < 65; i++) {
      const angle = (i / 65) * Math.PI * 2;
      const speed = 2 + Math.random() * 5.5;
      particlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: baseColor,
        size: 2 + Math.random() * 2.5,
      });
    }
  };

  useEffect(() => {
    const canvas = fireworksCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = () => {
      ctx.fillStyle = 'rgba(6, 1, 4, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.alpha -= 0.016;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 bg-[#060104] text-[#fcf8f2] overflow-x-hidden">
      {/* 2D Canvas for Fireworks */}
      <canvas
        ref={fireworksCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* COUNTDOWN 3... 2... 1... */}
      <AnimatePresence>
        {countdown !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060104]">
            <motion.div
              key={countdown}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              className="text-center"
            >
              <span className="font-cinzel text-8xl sm:text-9xl font-black text-gold-gradient drop-shadow-[0_0_35px_rgba(229,193,88,0.9)]">
                {countdown}
              </span>
              <p className="font-cinzel text-sm sm:text-base tracking-[0.4em] text-[#e5c158] uppercase mt-4">
                La magie commence...
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Spectacular Fireworks Content */}
      {isFinaleActive && (
        <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-between py-4">
          {/* Grand Illuminated Typography Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="text-center mt-2 px-2"
          >
            <span className="text-[11px] sm:text-xs font-cinzel tracking-[0.4em] text-[#e5c158] uppercase drop-shadow-[0_0_12px_#e5c158]">
              ✦ LE CLIMAX DE TA SOIRÉE ✦
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-wide text-rose-gold-gradient drop-shadow-[0_0_30px_rgba(229,193,88,0.85)] mt-1">
              JOYEUX ANNIVERSAIRE {config.honoreeFullName.toUpperCase()} ❤️🎂
            </h1>
          </motion.div>

          {/* The Grand Finale Romantic Letter */}
          <AnimatePresence>
            {showLetter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="my-6 w-full max-w-2xl rounded-2xl p-6 sm:p-8 text-[#1f060d] shadow-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #fdfbf7 0%, #f6edd9 100%)',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(229,193,88,0.5)',
                  border: '3px solid #e5c158',
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-3 border border-[#b8860b]/40 rounded-xl pointer-events-none" />

                {/* Letter Header */}
                <div className="flex justify-between items-center pb-3 border-b border-[#b8860b]/30 mb-4">
                  <div className="flex items-center gap-1.5 text-[#7d1224] font-cinzel text-xs font-bold">
                    <Heart className="w-4 h-4 fill-[#7d1224]" />
                    <span>LETTRE FINALE · 30 OCTOBRE</span>
                  </div>
                  <span className="text-xs font-cinzel text-[#8c6b16] tracking-widest uppercase">
                    POUR BAGUENS
                  </span>
                </div>

                {/* Royal Portrait of Baguens Jérôme */}
                <div className="flex justify-center my-3">
                  <div className="relative w-32 h-44 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-[#e5c158] shadow-2xl gold-glow bg-black">
                    <img
                      src="/assets/aistudio/file_000000008a9481f59fc95f0c6b9cb479_2701cc93.png"
                      alt="Baguens Jérôme Le Roi"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Letter Content (From Prompt) */}
                <div className="font-playfair text-[#2a0e14] text-sm sm:text-base leading-relaxed space-y-3.5 whitespace-pre-line text-left">
                  {config.finalLetter}
                </div>

                {/* Sender Signature */}
                <div className="pt-4 text-right">
                  <p className="font-playfair italic text-sm text-[#7d1224]">
                    Avec tout mon amour pour l&apos;éternité,
                  </p>
                  <p className="font-cinzel font-bold text-base text-[#4a0815] mt-0.5">
                    {config.senderSignature}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons: Relancer les feux d'artifice & Revoir la soirée */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                soundEngine.playFirework();
                launchConfettiShower();
                createFireworkBurst();
              }}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase text-[#e5c158] bg-[#22050c] border border-[#e5c158] hover:bg-[#380915] flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plus de Feux d&apos;Artifice 🎆</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRestart}
              className="w-full sm:flex-1 py-3 px-6 rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase text-white flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #c41e3a 0%, #7d1224 100%)',
                border: '1.5px solid #e5c158',
                boxShadow: '0 8px 25px rgba(196,30,58,0.7)',
              }}
            >
              <RotateCcw className="w-4 h-4 text-[#e5c158]" />
              <span>Revoir notre soirée ❤️</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};
