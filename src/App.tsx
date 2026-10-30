/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, Settings } from 'lucide-react';
import { PartyConfig } from './types/party';
import { loadPartyConfig } from './services/partyStorage';
import { soundEngine } from './services/soundEngine';

// Scenes
import { Scene1Invitation } from './components/scenes/Scene1Invitation';
import { Scene2VillaEntrance } from './components/scenes/Scene2VillaEntrance';
import { Scene3Ballroom } from './components/scenes/Scene3Ballroom';
import { Scene4BirthdayCake } from './components/scenes/Scene4BirthdayCake';
import { Scene5PhotoGallery } from './components/scenes/Scene5PhotoGallery';
import { Scene6RomanticDinner } from './components/scenes/Scene6RomanticDinner';
import { Scene7GiftRoom } from './components/scenes/Scene7GiftRoom';
import { Scene8ThousandLightsGarden } from './components/scenes/Scene8ThousandLightsGarden';
import { Scene9GrandFinale } from './components/scenes/Scene9GrandFinale';

// Overlays & Admin
import { PasscodeLock } from './components/PasscodeLock';
import { NavigationDock } from './components/NavigationDock';
import { AdminPanel } from './components/AdminPanel';
import { ShareModal } from './components/ShareModal';
import { RomanticAudioHeart } from './components/RomanticAudioHeart';
import { Send } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<PartyConfig>(loadPartyConfig);
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(!config.isPasswordProtected);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Initialize the custom song for Baguens on mount
  useEffect(() => {
    if (config.customAudioUrl) {
      soundEngine.setCustomAudio(config.customAudioUrl, config.customAudioName || 'Baguens, mon amour, mon bonheur');
    }
  }, [config.customAudioUrl, config.customAudioName]);

  // Dynamically adapt music volume to the current scene:
  // - Scene 4 (Gâteau) reduces volume slightly so candle flickers & breath blowing are clear
  // - Scene 9 (Surprise Finale) increases volume for the fireworks & love letter crescendo
  // - Other scenes remain at comfortable romantic volume
  useEffect(() => {
    soundEngine.adaptToScene(currentScene);
  }, [currentScene]);

  useEffect(() => {
    // If config changes whether password is required
    if (!config.isPasswordProtected) {
      setIsUnlocked(true);
    }
  }, [config.isPasswordProtected]);

  const handleSelectScene = (sceneId: number) => {
    soundEngine.playChime(700 + sceneId * 30, 0.2);
    setCurrentScene(sceneId);
  };

  const handleNextScene = () => {
    if (currentScene < 9) {
      setCurrentScene((prev) => prev + 1);
    }
  };

  return (
    <div className="relative min-h-[100dvh] w-full bg-[#080205] text-[#fcf8f2] select-none overflow-x-hidden font-sans">
      {/* Optional Passcode Gate */}
      {!isUnlocked && (
        <PasscodeLock
          correctCode={config.accessCode}
          honoreeName={config.honoreeName}
          onUnlock={() => setIsUnlocked(true)}
        />
      )}

      {/* Discrete Top Bar: Branding & Fast Access to Admin */}
      <header className="fixed top-0 inset-x-0 z-30 flex items-center justify-between px-3 sm:px-4 py-2.5 bg-gradient-to-b from-black/70 to-transparent pointer-events-none pr-14 sm:pr-16">
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-gold-gradient truncate max-w-[150px] sm:max-w-none">
            {config.honoreeName.toUpperCase()} · 30 OCTOBRE
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          {/* Main Direct Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#9e1b32] to-[#6b0d1e] hover:from-[#b5203b] hover:to-[#851126] border border-[#e5c158] text-[10px] sm:text-[11px] font-cinzel font-bold text-white shadow-lg transition-all cursor-pointer gold-glow-subtle"
            title="Obtenir le lien à envoyer à Baguens"
          >
            <Send className="w-3 h-3 text-[#e5c158]" />
            <span className="hidden xs:inline">Envoyer à Baguens 💌</span>
            <span className="xs:hidden">Partager 💌</span>
          </button>

          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full bg-[#2a0610]/70 hover:bg-[#3f0918] border border-[#e5c158]/30 text-[10px] font-cinzel text-[#e5c158] transition-colors cursor-pointer"
            title="Espace de personnalisation"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden md:inline">Personnaliser</span>
          </button>
        </div>
      </header>

      {/* Elegant Floating Musical Heart Button in Top-Right Corner */}
      <RomanticAudioHeart config={config} />

      {/* Main Scene Transitions */}
      <main className="relative w-full min-h-[100dvh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full min-h-[100dvh]"
          >
            {currentScene === 1 && (
              <Scene1Invitation
                config={config}
                onNext={() => setCurrentScene(2)}
              />
            )}

            {currentScene === 2 && (
              <Scene2VillaEntrance
                config={config}
                onNext={() => setCurrentScene(3)}
              />
            )}

            {currentScene === 3 && (
              <Scene3Ballroom
                config={config}
                onNext={() => setCurrentScene(4)}
              />
            )}

            {currentScene === 4 && (
              <Scene4BirthdayCake
                config={config}
                onNext={() => setCurrentScene(5)}
              />
            )}

            {currentScene === 5 && (
              <Scene5PhotoGallery
                config={config}
                onUpdateConfig={setConfig}
                onNext={() => setCurrentScene(6)}
              />
            )}

            {currentScene === 6 && (
              <Scene6RomanticDinner
                config={config}
                onNext={() => setCurrentScene(7)}
              />
            )}

            {currentScene === 7 && (
              <Scene7GiftRoom
                config={config}
                onUpdateConfig={setConfig}
                onNext={() => setCurrentScene(8)}
              />
            )}

            {currentScene === 8 && (
              <Scene8ThousandLightsGarden
                config={config}
                onNext={() => setCurrentScene(9)}
              />
            )}

            {currentScene === 9 && (
              <Scene9GrandFinale
                config={config}
                onRestart={() => setCurrentScene(1)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Collapsible Bottom Navigation Dock */}
      {isUnlocked && (
        <NavigationDock
          currentScene={currentScene}
          totalScenes={9}
          onSelectScene={handleSelectScene}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
        />
      )}

      {/* Personalization / Admin Modal */}
      <AdminPanel
        config={config}
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onSave={(newCfg) => setConfig(newCfg)}
        onJumpToScene={(sId) => setCurrentScene(sId)}
        onOpenShareModal={() => {
          setIsAdminOpen(false);
          setIsShareOpen(true);
        }}
      />

      {/* Direct Share Link Modal */}
      <ShareModal
        config={config}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
