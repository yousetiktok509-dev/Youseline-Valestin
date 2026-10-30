import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Settings, ChevronDown, ChevronUp, MapPin, Send } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';

interface NavigationDockProps {
  currentScene: number;
  totalScenes: number;
  onSelectScene: (scene: number) => void;
  onOpenAdmin: () => void;
  onOpenShare?: () => void;
}

export const NavigationDock: React.FC<NavigationDockProps> = ({
  currentScene,
  totalScenes,
  onSelectScene,
  onOpenAdmin,
  onOpenShare,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(soundEngine.getIsMuted());
  const [showSceneMenu, setShowSceneMenu] = useState(false);

  const sceneLabels = [
    { id: 1, name: "L'Invitation Mystérieuse", icon: "💌" },
    { id: 2, name: "L'Entrée de la Villa", icon: "🏰" },
    { id: 3, name: "La Grande Salle", icon: "🎉" },
    { id: 4, name: "Le Gâteau d'Anniversaire", icon: "🎂" },
    { id: 5, name: "La Galerie de Souvenirs", icon: "🖼️" },
    { id: 6, name: "Le Dîner Romantique", icon: "🍷" },
    { id: 7, name: "La Salle des Cadeaux", icon: "🎁" },
    { id: 8, name: "Le Jardin des Lumières", icon: "🌟" },
    { id: 9, name: "La Surprise Finale", icon: "🎆" },
  ];

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
  };

  const handlePrev = () => {
    if (currentScene > 1) {
      soundEngine.playChime(660, 0.2);
      onSelectScene(currentScene - 1);
    }
  };

  const handleNext = () => {
    if (currentScene < totalScenes) {
      soundEngine.playChime(784, 0.2);
      onSelectScene(currentScene + 1);
    }
  };

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-auto max-w-[95vw] pointer-events-auto">
      {/* Collapse / Expand Toggle Button */}
      <div className="flex justify-center mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-[#2a0610]/90 backdrop-blur-md text-[#e5c158] hover:text-white px-3 py-0.5 rounded-t-lg border-t border-x border-[#e5c158]/40 text-[10px] font-cinzel font-semibold flex items-center gap-1 shadow-md cursor-pointer transition-colors"
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3 h-3" />
              <span>Afficher les contrôles</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              <span>Mode Immersion</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Bar */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bordeaux-card rounded-2xl px-3 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2 sm:gap-4 shadow-2xl border border-[#e5c158]/50 gold-glow backdrop-blur-md"
          >
            {/* Previous Scene Button */}
            <button
              onClick={handlePrev}
              disabled={currentScene <= 1}
              className="w-8 h-8 rounded-xl bg-[#3d0915] text-[#e5c158] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#570d1e] flex items-center justify-center transition-colors cursor-pointer"
              title="Scène précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scene Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowSceneMenu(!showSceneMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1f050c] text-white border border-[#e5c158]/40 hover:border-[#e5c158] transition-colors cursor-pointer text-xs font-cinzel whitespace-nowrap"
              >
                <span>{sceneLabels[currentScene - 1]?.icon}</span>
                <span className="font-bold text-[#e5c158]">
                  {currentScene}/{totalScenes}
                </span>
                <span className="hidden sm:inline text-[#fcf8f2] text-[11px] truncate max-w-[140px]">
                  · {sceneLabels[currentScene - 1]?.name}
                </span>
                <MapPin className="w-3 h-3 text-[#e5c158]/70 ml-0.5" />
              </button>

              {/* Scene Dropdown Jump Menu */}
              {showSceneMenu && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-[#1f050c] border-2 border-[#e5c158] rounded-xl p-2 shadow-2xl space-y-1 z-50 max-h-64 overflow-y-auto">
                  <span className="text-[10px] font-cinzel text-[#e5c158] px-2 py-1 block tracking-wider uppercase">
                    Changer de scène
                  </span>
                  {sceneLabels.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectScene(s.id);
                        setShowSceneMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-cinzel flex items-center gap-2 transition-colors cursor-pointer ${
                        currentScene === s.id
                          ? 'bg-[#e5c158] text-[#3a0610] font-bold'
                          : 'text-[#f1cbd2] hover:bg-[#3d0915]'
                      }`}
                    >
                      <span>{s.icon}</span>
                      <span className="truncate">{s.id}. {s.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Next Scene Button */}
            <button
              onClick={handleNext}
              disabled={currentScene >= totalScenes}
              className="w-8 h-8 rounded-xl bg-[#3d0915] text-[#e5c158] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#570d1e] flex items-center justify-center transition-colors cursor-pointer"
              title="Scène suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-[#e5c158]/30 mx-0.5" />

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className="w-8 h-8 rounded-xl bg-[#2a0610] text-[#e5c158] hover:bg-[#400918] flex items-center justify-center transition-colors cursor-pointer"
              title={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Admin / Personalization Gear Button */}
            <button
              onClick={onOpenAdmin}
              className="w-8 h-8 rounded-xl bg-[#2a0610] text-[#e5c158] hover:bg-[#400918] flex items-center justify-center transition-colors cursor-pointer"
              title="Personnaliser les photos et messages"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Direct Share Link Button */}
            {onOpenShare && (
              <button
                onClick={onOpenShare}
                className="w-8 h-8 rounded-xl bg-[#7d1224] text-[#fff] hover:bg-[#9e1b32] border border-[#e5c158]/60 flex items-center justify-center transition-colors cursor-pointer"
                title="Envoyer le lien à Baguens"
              >
                <Send className="w-4 h-4 text-[#e5c158]" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
