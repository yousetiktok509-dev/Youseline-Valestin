import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gift, Heart, Music, BookOpen, Scroll, CheckCircle2, X, ArrowRight, Play, Pause, Upload } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig } from '../../types/party';
import { savePartyConfig } from '../../services/partyStorage';

interface Scene7Props {
  config: PartyConfig;
  onUpdateConfig: (newConfig: PartyConfig) => void;
  onNext: () => void;
}

export const Scene7GiftRoom: React.FC<Scene7Props> = ({ config, onUpdateConfig, onNext }) => {
  const [activeGiftModal, setActiveGiftModal] = useState<number | null>(null);
  const [openedGifts, setOpenedGifts] = useState<number[]>([]);
  const [albumPhotoIndex, setAlbumPhotoIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);

  const gifts = [
    {
      id: 1,
      title: "CADEAU 1",
      subtitle: "Une Lettre d'Amour",
      tag: "Écrit avec le cœur",
      icon: Scroll,
      color: "from-[#800f20] to-[#40060e]",
    },
    {
      id: 2,
      title: "CADEAU 2",
      subtitle: "Nos Plus Beaux Souvenirs",
      tag: "L'Album de notre vie",
      icon: BookOpen,
      color: "from-[#b8860b] to-[#594103]",
    },
    {
      id: 3,
      title: "CADEAU 3",
      subtitle: "Mes 5 Promesses Sincères",
      tag: "Pour notre futur",
      icon: CheckCircle2,
      color: "from-[#9e1b32] to-[#4d0b17]",
    },
    {
      id: 4,
      title: "CADEAU 4",
      subtitle: "Une Chanson Pour Toi",
      tag: "Mélodie romantique",
      icon: Music,
      color: "from-[#521327] to-[#250811]",
    },
    {
      id: 5,
      title: "CADEAU 5",
      subtitle: "Le Cadeau Secret",
      tag: "Cœur étincelant",
      icon: Heart,
      color: "from-[#c41e3a] to-[#7d1224]",
    },
  ];

  const handleOpenGift = (giftId: number) => {
    soundEngine.playChime(784 + giftId * 70, 0.3);
    if (!openedGifts.includes(giftId)) {
      setOpenedGifts((prev) => [...prev, giftId]);
    }
    setActiveGiftModal(giftId);
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    soundEngine.setCustomAudio(url);
    const updated = {
      ...config,
      musicTrack: 'custom' as const,
      customAudioUrl: url,
      customAudioName: file.name,
    };
    onUpdateConfig(updated);
    savePartyConfig(updated);
    setIsPlayingMusic(true);
  };

  const handleChangeSynthesizer = (type: 'piano' | 'harp' | 'celesta') => {
    soundEngine.setCustomAudio(undefined);
    soundEngine.setMelodyType(type);
    soundEngine.startMusic();
    const updated = {
      ...config,
      musicTrack: (`procedural-${type}` as any),
      customAudioName: undefined,
    };
    onUpdateConfig(updated);
    savePartyConfig(updated);
    setIsPlayingMusic(true);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#090205] via-[#16050e] to-[#0a0206] text-[#fcf8f2] overflow-x-hidden">
      {/* Festive luxury room backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#e5c158]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-[#9e1b32]/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-3xl mx-auto w-full text-center mt-2 mb-6">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
          ✦ SURPRISES &amp; ATTENTIONS ✦
        </span>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-cinzel font-bold text-gold-gradient tracking-wide mt-1">
          LA SALLE DES CADEAUX
        </h1>
        <p className="font-playfair text-[#f1cbd2] text-xs sm:text-sm italic mt-1.5 drop-shadow">
          Chaque boîte a été préparée avec tendresse pour célébrer ton anniversaire.
        </p>
      </div>

      {/* 5 Interactive Gifts Display */}
      <div className="relative z-10 max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 my-auto py-2">
        {gifts.map((gift) => {
          const isOpened = openedGifts.includes(gift.id);
          const IconComponent = gift.icon;

          return (
            <motion.div
              key={gift.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleOpenGift(gift.id)}
              className={`cursor-pointer rounded-2xl p-5 relative overflow-hidden transition-all duration-300 shadow-2xl border ${
                isOpened
                  ? 'border-[#e5c158] bg-gradient-to-br from-[#2f0814] to-[#160309] gold-glow'
                  : 'border-[#e5c158]/40 bg-gradient-to-br from-[#1e050d] to-[#0f0207] hover:border-[#e5c158]'
              } ${gift.id === 5 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Ribbon Graphic Overlay */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-bl from-[#e5c158]/30 to-transparent rotate-45 pointer-events-none" />

              <div className="flex items-start justify-between">
                <span className="text-[10px] font-cinzel font-bold tracking-widest text-[#e5c158] uppercase">
                  {gift.title}
                </span>
                <span
                  className={`text-[9px] font-sans px-2 py-0.5 rounded-full border ${
                    isOpened
                      ? 'bg-[#e5c158]/20 text-[#e5c158] border-[#e5c158]/50'
                      : 'bg-[#9e1b32]/40 text-[#f1cbd2] border-[#9e1b32]'
                  }`}
                >
                  {isOpened ? 'Déjà Ouvert ✓' : 'À Ouvrir 🎁'}
                </span>
              </div>

              {/* Gift Icon Box */}
              <div className="my-5 flex flex-col items-center justify-center text-center">
                <motion.div
                  animate={!isOpened ? { y: [0, -4, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
                    isOpened
                      ? 'bg-gradient-to-tr from-[#e5c158] to-[#916b12] text-[#3a0610] border-[#fff1bd] gold-glow'
                      : 'bg-gradient-to-tr from-[#9e1b32] to-[#500b17] text-[#e5c158] border-[#e5c158]/60'
                  }`}
                >
                  <IconComponent className="w-8 h-8" />
                </motion.div>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-white mt-3">
                  {gift.subtitle}
                </h3>
                <p className="text-xs text-[#f1cbd2]/80 font-playfair mt-0.5">
                  {gift.tag}
                </p>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2.5 rounded-xl font-cinzel text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all ${
                  isOpened
                    ? 'bg-[#e5c158] text-[#3a0610]'
                    : 'bg-[#7d1224] text-white border border-[#e5c158]/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isOpened ? 'Relire le cadeau' : 'Déballer ce cadeau 🎁'}</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* --- GIFT MODAL POPUPS --- */}
      <AnimatePresence>
        {activeGiftModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bordeaux-card rounded-2xl p-6 sm:p-8 shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2]"
            >
              <button
                onClick={() => setActiveGiftModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#3a0914] text-[#e5c158] flex items-center justify-center hover:bg-[#520d1c] cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* GIFT 1: UNE LETTRE D'AMOUR */}
              {activeGiftModal === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#e5c158] font-cinzel text-xs">
                    <Scroll className="w-4 h-4" />
                    <span>CADEAU 1 · LETTRE D&apos;AMOUR</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    Pour Mon Roi, Baguens Jérôme
                  </h3>

                  <div className="bg-[#fcf8f2] text-[#22070e] p-5 sm:p-6 rounded-xl border border-[#e5c158] shadow-inner font-playfair text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                    {config.giftLoveLetter}
                  </div>
                </div>
              )}

              {/* GIFT 2: NOS PHOTOS & PROJETS (ALBUM) */}
              {activeGiftModal === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#e5c158] font-cinzel text-xs">
                    <BookOpen className="w-4 h-4" />
                    <span>CADEAU 2 · NOTRE ALBUM SOUVENIR</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    Nos Plus Beaux Moments
                  </h3>

                  {config.photos.length > 0 && (
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-xl overflow-hidden border-2 border-[#e5c158] shadow-xl bg-black">
                        <img
                          src={config.photos[albumPhotoIndex % config.photos.length].url}
                          alt="Album"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="font-cinzel font-bold text-base text-[#e5c158]">
                          {config.photos[albumPhotoIndex % config.photos.length].title}
                        </h4>
                        <p className="font-playfair text-xs sm:text-sm text-[#f1cbd2] italic mt-1">
                          « {config.photos[albumPhotoIndex % config.photos.length].note} »
                        </p>
                      </div>

                      {/* Navigation Carousel dots */}
                      <div className="flex items-center justify-center gap-2 pt-2">
                        {config.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setAlbumPhotoIndex(idx)}
                            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                              albumPhotoIndex === idx
                                ? 'bg-[#e5c158] scale-125'
                                : 'bg-[#e5c158]/30 hover:bg-[#e5c158]/60'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* GIFT 3: MES 5 PROMESSES */}
              {activeGiftModal === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#e5c158] font-cinzel text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>CADEAU 3 · ENGAGEMENTS D&apos;AMOUR</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    Mes 5 Promesses Pour Toi
                  </h3>

                  <div className="space-y-3">
                    {config.giftPromises.map((p, idx) => (
                      <div
                        key={p.id}
                        className="bg-[#260610] p-4 rounded-xl border border-[#e5c158]/30 space-y-1"
                      >
                        <span className="text-[10px] font-cinzel text-[#e5c158] font-bold">
                          PROMESSE N°{idx + 1}
                        </span>
                        <h4 className="font-cinzel text-sm sm:text-base font-bold text-white">
                          {p.title}
                        </h4>
                        <p className="font-playfair text-xs sm:text-sm text-[#f1cbd2] leading-relaxed italic">
                          « {p.description} »
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GIFT 4: UNE CHANSON POUR TOI */}
              {activeGiftModal === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#e5c158] font-cinzel text-xs">
                    <Music className="w-4 h-4" />
                    <span>CADEAU 4 · LECTEUR MUSICAL DÉDIÉ</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    Une Chanson Pour Baguens
                  </h3>

                  <div className="bg-[#24060e] p-5 rounded-xl border border-[#e5c158]/40 space-y-4">
                    <div className="text-center space-y-1">
                      <p className="font-cinzel text-sm font-bold text-[#e5c158]">
                        {config.customAudioName || 'Mélodie Romantique Douce'}
                      </p>
                      <p className="text-xs text-[#f1cbd2]/70 font-sans">
                        Composée spécialement pour accompagner cette soirée
                      </p>
                    </div>

                    {/* Instrumental Synth Switcher */}
                    <div className="grid grid-cols-3 gap-2">
                      {(['piano', 'harp', 'celesta'] as const).map((instr) => (
                        <button
                          key={instr}
                          onClick={() => handleChangeSynthesizer(instr)}
                          className={`py-2 px-2 rounded-lg font-cinzel text-[11px] font-bold capitalize transition-all cursor-pointer ${
                            config.musicTrack === `procedural-${instr}`
                              ? 'bg-[#e5c158] text-[#3a0610]'
                              : 'bg-[#180309] text-[#e5c158] hover:bg-[#320a15]'
                          }`}
                        >
                          {instr}
                        </button>
                      ))}
                    </div>

                    {/* Upload custom MP3 song */}
                    <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border-2 border-dashed border-[#e5c158]/50 hover:bg-[#340b17] cursor-pointer text-xs font-cinzel text-[#e5c158] transition-all">
                      <Upload className="w-4 h-4" />
                      <span>Ajouter ma propre chanson (MP3 / Audio)</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={handleAudioUpload}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* GIFT 5: LE CADEAU SECRET (CŒUR LUMINEUX) */}
              {activeGiftModal === 5 && (
                <div className="space-y-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-[#e5c158] font-cinzel text-xs">
                    <Heart className="w-4 h-4 fill-[#e5c158]" />
                    <span>CADEAU 5 · LE SECRET ABSOLU</span>
                  </div>

                  <div className="py-6 flex justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                      className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#9e1b32] via-[#e5c158] to-[#ffd778] p-1 flex items-center justify-center shadow-2xl gold-glow"
                    >
                      <div className="w-full h-full rounded-full bg-[#520d1c] flex items-center justify-center">
                        <Heart className="w-12 h-12 text-[#ffd778] fill-[#ffd778]" />
                      </div>
                    </motion.div>
                  </div>

                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-gold-gradient">
                    Si Je Devais Recommencer...
                  </h3>

                  {/* Exact prompt quote */}
                  <div className="bg-[#24060e] p-6 rounded-2xl border-2 border-[#e5c158] gold-glow">
                    <p className="font-playfair text-base sm:text-xl text-[#fcf8f2] leading-relaxed italic">
                      « Si je pouvais choisir encore une fois la personne avec qui partager mes moments de bonheur, je te choisirais encore, mon Baguens. ❤️ »
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom CTA Button to Scene 8 */}
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
          <span>Marcher dans le Jardin des Mille Lumières 🌟</span>
          <ArrowRight className="w-4 h-4 text-[#e5c158]" />
        </motion.button>
      </div>
    </div>
  );
};
