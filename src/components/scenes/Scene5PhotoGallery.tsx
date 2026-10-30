import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, X, Upload, ArrowRight, Calendar, Tag } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';
import { PartyConfig, MemoryPhoto } from '../../types/party';
import { savePartyConfig } from '../../services/partyStorage';

interface Scene5Props {
  config: PartyConfig;
  onUpdateConfig: (newConfig: PartyConfig) => void;
  onNext: () => void;
}

export const Scene5PhotoGallery: React.FC<Scene5Props> = ({ config, onUpdateConfig, onNext }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'voyage' | 'projet' | 'moment' | 'amour'>('all');
  const [heartSparks, setHeartSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const filteredPhotos = activeFilter === 'all'
    ? config.photos
    : config.photos.filter((p) => p.category === activeFilter);

  const handleOpenPhoto = (photo: MemoryPhoto) => {
    soundEngine.playChime(784, 0.25);
    setSelectedPhoto(photo);
  };

  const handleSendHeart = (e: React.MouseEvent) => {
    soundEngine.playChime(1046, 0.3);
    const rect = e.currentTarget.getBoundingClientRect();
    const newSpark = {
      id: Date.now() + Math.random(),
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setHeartSparks((prev) => [...prev, newSpark]);
    setTimeout(() => {
      setHeartSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
    }, 1200);
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: MemoryPhoto = {
        id: `custom-photo-${Date.now()}`,
        url: dataUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        subtitle: 'Photo ajoutée avec amour',
        date: 'Nouveau souvenir',
        note: `Un moment précieux gravé dans mon cœur avec toi, mon Baguens d'amour. ❤️`,
        category: 'moment',
      };

      const updated = {
        ...config,
        photos: [newPhoto, ...config.photos],
      };
      onUpdateConfig(updated);
      savePartyConfig(updated);
      soundEngine.playChime(880, 0.3);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-gradient-to-b from-[#11050a] via-[#1a0810] to-[#0d0307] text-[#fcf8f2] overflow-x-hidden">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-[#9e1b32]/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#e5c158]/10 blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="relative z-10 max-w-4xl mx-auto w-full text-center mt-2 mb-6">
        <span className="text-[10px] sm:text-xs font-cinzel tracking-[0.35em] text-[#e5c158] uppercase">
          ✦ NOTRE HISTOIRE EN IMAGES ✦
        </span>
        <h1 className="text-xl sm:text-3xl md:text-4xl font-cinzel font-bold text-gold-gradient tracking-wide mt-1">
          LA GALERIE DE NOS SOUVENIRS
        </h1>
        <p className="font-playfair text-[#f1cbd2] text-sm sm:text-base italic mt-2 drop-shadow">
          « Chaque souvenir avec toi occupe une place dans mon cœur. »
        </p>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-4">
          {[
            { id: 'all', label: 'Tous nos souvenirs' },
            { id: 'voyage', label: 'Voyages & Aventures' },
            { id: 'projet', label: 'Tes Projets' },
            { id: 'moment', label: 'Nos Fous Rires' },
            { id: 'amour', label: 'Mots Doux' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-cinzel transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-[#e5c158] text-[#3a0610] font-bold shadow-md'
                  : 'bg-[#260912]/70 text-[#f1cbd2] hover:bg-[#3d0e1d] border border-[#e5c158]/25'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Grid in Ornate Gold Frames */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 mb-8">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOpenPhoto(photo)}
            className="group cursor-pointer rounded-xl p-2 sm:p-2.5 bordeaux-card transition-all duration-300 shadow-xl hover:border-[#e5c158] hover:gold-glow"
          >
            {/* Ornate Golden Frame Rim */}
            <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden border-2 border-[#e5c158]/70 shadow-inner bg-[#1e0710]">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Heart icon on top corner */}
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#7d1224]/80 flex items-center justify-center border border-[#e5c158]/50">
                <Heart className="w-3 h-3 text-[#e5c158] fill-[#e5c158]" />
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-2 inset-x-2 text-left">
                <p className="font-cinzel text-xs font-bold text-white truncate drop-shadow-md">
                  {photo.title}
                </p>
                <span className="text-[10px] font-sans text-[#e5c158]/90 block truncate">
                  {photo.date}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Upload Slot for real couple photos */}
        <motion.label
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer rounded-xl p-2 sm:p-2.5 border-2 border-dashed border-[#e5c158]/60 bg-[#240812]/50 hover:bg-[#340b1a]/60 flex flex-col items-center justify-center text-center aspect-[4/3] transition-all group"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhoto}
          />
          <div className="w-10 h-10 rounded-full bg-[#e5c158]/20 group-hover:bg-[#e5c158]/30 flex items-center justify-center text-[#e5c158] mb-2 transition-colors">
            <Upload className="w-5 h-5" />
          </div>
          <span className="font-cinzel text-xs font-bold text-[#e5c158]">
            + Importer Nos Photos
          </span>
          <span className="text-[10px] text-[#f1cbd2]/70 font-sans mt-0.5">
            Ajoute tes vraies photos ici
          </span>
        </motion.label>
      </div>

      {/* Expanded Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-lg bordeaux-card rounded-2xl p-5 sm:p-6 shadow-2xl border-2 border-[#e5c158] gold-glow overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#3a0914] text-[#e5c158] flex items-center justify-center hover:bg-[#520d1c] transition-colors cursor-pointer z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Photo Display in Gold Frame */}
              <div className="rounded-xl overflow-hidden border-2 border-[#e5c158] shadow-2xl aspect-[4/3] bg-[#16050b] mb-4">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Memory Details */}
              <div className="text-left space-y-2">
                <div className="flex items-center justify-between text-xs text-[#e5c158]">
                  <span className="flex items-center gap-1 font-cinzel">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedPhoto.date}
                  </span>
                  <span className="capitalize font-sans text-[#f1cbd2]/80">
                    {selectedPhoto.category}
                  </span>
                </div>

                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
                  {selectedPhoto.title}
                </h3>

                <p className="font-playfair text-sm sm:text-base text-[#fcf8f2] leading-relaxed italic border-l-2 border-[#e5c158] pl-3 py-1">
                  « {selectedPhoto.note} »
                </p>

                {/* Love reaction button */}
                <div className="pt-3 flex justify-between items-center border-t border-[#e5c158]/20">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendHeart}
                    className="py-2 px-4 rounded-xl font-cinzel text-xs font-semibold text-white bg-[#9e1b32] hover:bg-[#b5203b] flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current text-white" />
                    <span>T&apos;aimer encore plus ❤️</span>
                  </motion.button>

                  <span className="text-[11px] font-cinzel text-[#e5c158]/70">
                    Pour Baguens Jérôme
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Animated Hearts */}
      {heartSparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ opacity: 1, scale: 0.5, y: 0 }}
          animate={{ opacity: 0, scale: 1.6, y: -90 }}
          transition={{ duration: 1 }}
          style={{ position: 'fixed', left: spark.x, top: spark.y, zIndex: 100 }}
          className="pointer-events-none"
        >
          <Heart className="w-6 h-6 text-[#ff3366] fill-[#ff3366] drop-shadow-[0_0_10px_#ff3366]" />
        </motion.div>
      ))}

      {/* Bottom Navigation CTA */}
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
          <span>Passer au dîner romantique 🍷</span>
          <ArrowRight className="w-4 h-4 text-[#e5c158]" />
        </motion.button>
      </div>
    </div>
  );
};
