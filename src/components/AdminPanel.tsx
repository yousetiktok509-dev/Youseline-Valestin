import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, RefreshCw, Upload, Trash2, Heart, Music, Lock, Layers, Download, Check, Send, Copy, MessageCircle, Smartphone, Share2, QrCode, Play, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { PartyConfig, MemoryPhoto } from '../types/party';
import { savePartyConfig, resetPartyConfig } from '../services/partyStorage';
import { soundEngine } from '../services/soundEngine';

interface AdminPanelProps {
  config: PartyConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newConfig: PartyConfig) => void;
  onJumpToScene: (sceneId: number) => void;
  onOpenShareModal?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  config,
  isOpen,
  onClose,
  onSave,
  onJumpToScene,
  onOpenShareModal,
}) => {
  const [formData, setFormData] = useState<PartyConfig>({ ...config });
  const [activeTab, setActiveTab] = useState<'share' | 'letters' | 'photos' | 'music' | 'security' | 'scenes'>('share');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const sharedUrl = 'https://ais-pre-cyeadqnowxw3h2yckmftyz-524466489796.us-west1.run.app';

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    savePartyConfig(formData);
    soundEngine.playChime(880, 0.3);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser tous les textes et photos aux valeurs par défaut de Baguens ?")) {
      const reset = resetPartyConfig();
      setFormData(reset);
      onSave(reset);
    }
  };

  const handleUploadPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: MemoryPhoto = {
        id: `photo-${Date.now()}`,
        url: dataUrl,
        title: file.name.replace(/\.[^/.]+$/, ''),
        subtitle: 'Photo personnalisée',
        date: 'Nouveau souvenir',
        note: 'Un moment inoubliable avec mon Baguens d\'amour.',
        category: 'moment',
      };
      setFormData((prev) => ({
        ...prev,
        photos: [newPhoto, ...prev.photos],
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anniversaire_baguens_config.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        setFormData(parsed);
        onSave(parsed);
        savePartyConfig(parsed);
        alert("Configuration importée avec succès !");
      } catch {
        alert("Fichier JSON invalide.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bordeaux-card rounded-2xl shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#e5c158]/30 bg-[#250711]">
          <div>
            <span className="text-[10px] font-cinzel text-[#e5c158] tracking-widest uppercase">
              ✦ ESPACE CRÉATRICE ✦
            </span>
            <h2 className="text-lg sm:text-xl font-cinzel font-bold text-gold-gradient">
              Personnalisation de la Fête de Baguens
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#3d0a18] text-[#e5c158] hover:bg-[#590e23] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#1b050c] border-b border-[#e5c158]/20 overflow-x-auto">
          {[
            { id: 'share', label: 'Envoyer à Baguens 💌', icon: Send },
            { id: 'letters', label: 'Lettres & Mots', icon: Heart },
            { id: 'photos', label: 'Photos & Souvenirs', icon: Upload },
            { id: 'music', label: 'Musique & Sons', icon: Music },
            { id: 'security', label: 'Code Privé', icon: Lock },
            { id: 'scenes', label: 'Scènes & Aperçu', icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-cinzel whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#e5c158] text-[#3a0610] font-bold shadow-md'
                    : 'text-[#f1cbd2] hover:bg-[#340915]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
          {/* TAB 0: ENVOYER À BAGUENS */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#380713] to-[#20050c] border-2 border-[#e5c158]/70 gold-glow space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-xs font-bold text-[#e5c158] uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    Lien direct pour Baguens
                  </span>
                  <span className="text-[10px] text-[#f1cbd2]/80 font-sans">
                    Accessible sur mobile &amp; ordinateur
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-[#120308] border border-[#e5c158]/50 rounded-lg p-2">
                  <input
                    type="text"
                    readOnly
                    value={sharedUrl}
                    className="flex-1 bg-transparent text-xs text-[#fff1bd] font-mono select-all focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(sharedUrl);
                      soundEngine.playChime(880, 0.3);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    className="py-1.5 px-3 rounded bg-[#e5c158] hover:bg-[#ffd978] text-[#3a0610] font-cinzel font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-md"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>

                {formData.isPasswordProtected && (
                  <div className="text-xs text-[#e5c158] bg-[#2a0610] p-2 rounded-lg border border-[#e5c158]/30 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      Code secret requis pour ouvrir la fête : <strong>{formData.accessCode}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Sharing buttons */}
              <div>
                <span className="text-xs font-cinzel text-[#e5c158] font-bold block mb-2">
                  Envoyer directement le message d&apos;invitation :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `Mon amour, aujourd'hui est ton jour... J'ai préparé une fête d'anniversaire magique pour toi. Ouvre ce lien sur ton téléphone et mets tes écouteurs : ${sharedUrl} ${
                        formData.isPasswordProtected ? `(Code : ${formData.accessCode}) ` : ''
                      }❤️🎂 Joyeux anniversaire mon roi !`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/60 text-white flex items-center justify-center gap-2 font-cinzel text-xs font-bold transition-all shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    <span>Envoyer sur WhatsApp</span>
                  </a>

                  <a
                    href={`sms:?&body=${encodeURIComponent(
                      `Mon amour, ouvre ton invitation d'anniversaire ici : ${sharedUrl} ${
                        formData.isPasswordProtected ? `(Code : ${formData.accessCode}) ` : ''
                      }❤️ Joyeux anniversaire !`
                    )}`}
                    className="py-2.5 px-3 rounded-xl bg-[#007AFF]/20 hover:bg-[#007AFF]/30 border border-[#007AFF]/60 text-white flex items-center justify-center gap-2 font-cinzel text-xs font-bold transition-all shadow-md"
                  >
                    <Smartphone className="w-4 h-4 text-[#007AFF]" />
                    <span>Envoyer par SMS / iMessage</span>
                  </a>
                </div>
              </div>

              {/* Message preview */}
              <div className="bg-[#1a040b] p-3.5 rounded-xl border border-[#e5c158]/30 space-y-2">
                <span className="text-xs font-cinzel text-[#e5c158] font-bold block">
                  Exemple de message à envoyer :
                </span>
                <p className="font-playfair text-xs sm:text-sm text-[#fcf8f2] italic leading-relaxed">
                  « Mon amour, aujourd&apos;hui est ton jour... Même avec la distance, je voulais que tu vives un anniversaire magique et inoubliable. Mets tes écouteurs, allume le son et découvre la surprise que j&apos;ai préparée pour toi ici : {sharedUrl} {formData.isPasswordProtected ? `(Code : ${formData.accessCode}) ` : ''}❤️🎂 Joyeux anniversaire mon roi ! »
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Mon amour, aujourd'hui est ton jour... Même avec la distance, je voulais que tu vives un anniversaire magique et inoubliable. Mets tes écouteurs, allume le son et découvre la surprise que j'ai préparée pour toi ici : ${sharedUrl} ${
                        formData.isPasswordProtected ? `(Code : ${formData.accessCode}) ` : ''
                      }❤️🎂 Joyeux anniversaire mon roi !`
                    );
                    soundEngine.playChime(880, 0.3);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2500);
                  }}
                  className="w-full py-2 rounded-lg bg-[#2a0610] hover:bg-[#3d0916] text-[#e5c158] border border-[#e5c158]/40 font-cinzel text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copier le texte complet avec le lien</span>
                </button>
              </div>

              {/* Netlify Free Deployment Box */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1d050d] to-[#2e0915] border-2 border-[#e5c158]/60 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-cinzel text-xs font-bold text-[#e5c158] uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="w-4 h-4" />
                    Publication Gratuite sur Netlify
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Dossier dist prêt
                  </span>
                </div>

                <p className="text-xs text-[#f1cbd2]/90 leading-relaxed font-sans">
                  Pour héberger la surprise gratuitement sur votre propre lien Netlify sans utiliser Google Cloud Run :
                </p>

                <div className="space-y-2 text-xs text-[#fcf8f2] font-sans bg-[#120308] p-3 rounded-lg border border-[#e5c158]/30">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#e5c158] text-[#3a0610] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                    <span>Télécharge le dossier de production zippé contenant le site compilé, les photos et la musique.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#e5c158] text-[#3a0610] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                    <span>Dézippe <strong>dist.zip</strong> sur ton téléphone ou ordinateur pour obtenir le dossier <strong>dist</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#e5c158] text-[#3a0610] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                    <span>Va sur <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-[#e5c158] underline font-bold">app.netlify.com/drop</a> et glisse-dépose le dossier <strong>dist</strong>. Ton site est en ligne en 10 secondes !</span>
                  </div>
                </div>

                <a
                  href="/dist.zip"
                  download="dist.zip"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e5c158] via-[#ffd978] to-[#c29623] hover:from-[#f0cf68] hover:to-[#d4a833] text-[#3a0610] font-cinzel font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger dist.zip pour Netlify</span>
                </a>
              </div>
            </div>
          )}
          {activeTab === 'letters' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                  Prénom &amp; Nom du Fêté
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.honoreeName}
                    onChange={(e) => setFormData({ ...formData, honoreeName: e.target.value })}
                    className="bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-2.5 text-xs text-white"
                    placeholder="Baguens"
                  />
                  <input
                    type="text"
                    value={formData.honoreeFullName}
                    onChange={(e) => setFormData({ ...formData, honoreeFullName: e.target.value })}
                    className="bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-2.5 text-xs text-white"
                    placeholder="Baguens Jérôme"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                  1. Lettre de l&apos;Invitation (Scène 1)
                </label>
                <textarea
                  rows={4}
                  value={formData.invitationLetter}
                  onChange={(e) => setFormData({ ...formData, invitationLetter: e.target.value })}
                  className="w-full bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                  2. Vœu des Bougies du Gâteau (Scène 4)
                </label>
                <textarea
                  rows={2}
                  value={formData.cakeWishNote}
                  onChange={(e) => setFormData({ ...formData, cakeWishNote: e.target.value })}
                  className="w-full bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                  3. Lettre d&apos;Amour du Cadeau 1 (Scène 7)
                </label>
                <textarea
                  rows={5}
                  value={formData.giftLoveLetter}
                  onChange={(e) => setFormData({ ...formData, giftLoveLetter: e.target.value })}
                  className="w-full bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3 text-xs text-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                  4. La Lettre Finale Émouvante (Scène 9)
                </label>
                <textarea
                  rows={6}
                  value={formData.finalLetter}
                  onChange={(e) => setFormData({ ...formData, finalLetter: e.target.value })}
                  className="w-full bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3 text-xs text-white leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-cinzel text-[#e5c158] font-bold">
                  Vos Photos de Couple ({formData.photos.length} photos)
                </span>
                <label className="cursor-pointer bg-[#9e1b32] text-white px-3 py-1.5 rounded-xl text-xs font-cinzel flex items-center gap-1.5 hover:bg-[#bd223e] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ajouter une photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadPhoto}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative rounded-xl border border-[#e5c158]/40 bg-[#19040b] p-2 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-black mb-2">
                      <img src={p.url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={p.title}
                        onChange={(e) => {
                          const updated = formData.photos.map((ph) =>
                            ph.id === p.id ? { ...ph, title: e.target.value } : ph
                          );
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="w-full bg-transparent text-xs font-bold text-white border-b border-[#e5c158]/30 pb-0.5"
                      />
                      <input
                        type="text"
                        value={p.note}
                        onChange={(e) => {
                          const updated = formData.photos.map((ph) =>
                            ph.id === p.id ? { ...ph, note: e.target.value } : ph
                          );
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="w-full bg-transparent text-[11px] text-[#f1cbd2] italic"
                      />
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(p.id)}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#7d1224] text-white flex items-center justify-center hover:bg-red-600 cursor-pointer shadow-md"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: AJOUTER NOTRE CHANSON ❤️ */}
          {activeTab === 'music' && (
            <div className="space-y-5">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#380713] via-[#20050c] to-[#140308] border-2 border-[#e5c158] gold-glow space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-cinzel text-[#e5c158] tracking-widest uppercase block">
                      ✦ CHANSON PERSONNALISÉE OFFICIELLE ✦
                    </span>
                    <h3 className="text-base sm:text-lg font-cinzel font-bold text-gold-gradient mt-0.5">
                      Ajouter notre chanson ❤️
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-cinzel font-bold bg-[#e5c158]/20 text-[#e5c158] border border-[#e5c158]/50">
                    MP3 Actif
                  </span>
                </div>

                {/* Current Song Card */}
                <div className="bg-[#120308] border border-[#e5c158]/40 rounded-xl p-3.5 space-y-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9e1b32] text-[#fff1bd] border border-[#e5c158] flex items-center justify-center shrink-0 shadow-md">
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white truncate">
                        {formData.customAudioName || 'Baguens, mon amour, mon bonheur'}
                      </h4>
                      <p className="text-[10px] text-[#f1cbd2]/70 font-sans truncate">
                        {formData.customAudioUrl ? 'Fichier audio MP3 intégré avec amour' : 'Mélodie romantique'}
                      </p>
                    </div>
                  </div>

                  {/* Audio Controls for Preview */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#e5c158]/20">
                    <button
                      onClick={() => {
                        soundEngine.togglePlayPause();
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#e5c158] hover:bg-[#ffd978] text-[#3a0610] font-cinzel font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Écouter l&apos;aperçu</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.restartMusic();
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#2a0610] hover:bg-[#3f0918] text-[#e5c158] border border-[#e5c158]/40 font-cinzel text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Recommencer la chanson au début"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Recommencer</span>
                    </button>

                    <button
                      onClick={() => {
                        soundEngine.startMusic(false);
                        alert("Test de lecture sur mobile activé ! La musique joue en continu.");
                      }}
                      className="py-1.5 px-3 rounded-lg bg-[#19040b] hover:bg-[#2e0714] text-[#f1cbd2] border border-[#e5c158]/30 font-cinzel text-xs flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
                      title="Tester la lecture sur téléphone"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-[#e5c158]" />
                      <span>Tester sur téléphone</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons: Import / Replace / Restore */}
                <div className="space-y-2">
                  <label className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-[#e5c158]/60 hover:bg-[#2d0713] cursor-pointer text-xs font-cinzel text-[#e5c158] font-bold flex items-center justify-center gap-2 transition-all shadow-md text-center">
                    <Upload className="w-4 h-4 text-[#e5c158]" />
                    <span>Importer ou Remplacer mon fichier MP3</span>
                    <input
                      type="file"
                      accept="audio/*,.mp3,.m4a,.wav"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        const songName = file.name.replace(/\.[^/.]+$/, '');
                        soundEngine.setCustomAudio(url, songName);
                        setFormData({
                          ...formData,
                          musicTrack: 'custom',
                          customAudioUrl: url,
                          customAudioName: songName,
                        });
                        alert(`Chanson "${file.name}" importée avec succès ! Clique sur Enregistrer pour confirmer.`);
                      }}
                    />
                  </label>

                  {/* Reset to Original Uploaded Song */}
                  <button
                    onClick={() => {
                      const origUrl = '/assets/aistudio/Joyeux_anniversaire__mon__2__8fafcb2d.mp3';
                      const origName = 'Baguens, mon amour, mon bonheur';
                      soundEngine.setCustomAudio(origUrl, origName);
                      setFormData({
                        ...formData,
                        musicTrack: 'custom',
                        customAudioUrl: origUrl,
                        customAudioName: origName,
                      });
                      soundEngine.restartMusic();
                      alert('Chanson « Baguens, mon amour, mon bonheur » rétablie avec succès !');
                    }}
                    className="w-full py-2 px-3 rounded-lg bg-[#2a0610]/70 hover:bg-[#3a0816] text-[#e5c158] border border-[#e5c158]/30 text-xs font-cinzel flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Rétablir « Baguens, mon amour, mon bonheur »</span>
                  </button>
                </div>
              </div>

              {/* Instrument Synthesizer Alternatives (optional) */}
              <div className="p-3 rounded-xl bg-[#1b050c] border border-[#e5c158]/30 space-y-2">
                <span className="text-xs font-cinzel text-[#e5c158] font-bold block">
                  Autre ambiance sonore :
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'piano', label: 'Piano Romantique' },
                    { id: 'harp', label: 'Harpe Dorée' },
                    { id: 'celesta', label: 'Célesta Scintillant' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        soundEngine.setMelodyType(m.id as any);
                        soundEngine.setCustomAudio(undefined);
                        soundEngine.startMusic(false);
                        setFormData({
                          ...formData,
                          musicTrack: `procedural-${m.id}` as any,
                          customAudioName: undefined,
                        });
                      }}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        formData.musicTrack === `procedural-${m.id}`
                          ? 'border-[#e5c158] bg-[#3a0815] text-[#e5c158] font-bold'
                          : 'border-[#e5c158]/20 bg-[#120308] text-[#f1cbd2]/80 hover:bg-[#250610]'
                      }`}
                    >
                      <span className="font-cinzel text-[11px] block">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SÉCURITÉ */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#1b050c] border border-[#e5c158]/30">
                <div>
                  <span className="font-cinzel text-xs font-bold text-white block">
                    Protection par Code d&apos;Accès Secret
                  </span>
                  <span className="text-[11px] text-[#f1cbd2]/70 font-sans">
                    Demander un code pour pouvoir ouvrir la fête
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isPasswordProtected}
                  onChange={(e) => setFormData({ ...formData, isPasswordProtected: e.target.checked })}
                  className="w-5 h-5 accent-[#e5c158] cursor-pointer"
                />
              </div>

              {formData.isPasswordProtected && (
                <div>
                  <label className="block text-xs font-cinzel text-[#e5c158] mb-1 font-bold">
                    Code Secret (ex: 3010 pour 30 Octobre)
                  </label>
                  <input
                    type="text"
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                    className="w-full bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3 text-sm text-center font-cinzel text-white tracking-[0.3em]"
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SCÈNES & EXPORT */}
          {activeTab === 'scenes' && (
            <div className="space-y-4">
              <span className="text-xs font-cinzel text-[#e5c158] font-bold block">
                Prévisualiser une scène directement :
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, name: "1. Invitation" },
                  { id: 2, name: "2. Villa" },
                  { id: 3, name: "3. Salle" },
                  { id: 4, name: "4. Gâteau" },
                  { id: 5, name: "5. Galerie" },
                  { id: 6, name: "6. Dîner" },
                  { id: 7, name: "7. Cadeaux" },
                  { id: 8, name: "8. Jardin" },
                  { id: 9, name: "9. Finale" },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onJumpToScene(s.id);
                      onClose();
                    }}
                    className="py-2 px-2.5 rounded-lg bg-[#260710] hover:bg-[#3d0b1a] border border-[#e5c158]/30 text-xs font-cinzel text-white transition-all cursor-pointer"
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-[#e5c158]/20 flex flex-wrap gap-2">
                <button
                  onClick={handleExportJson}
                  className="py-2 px-3 rounded-xl bg-[#1b050c] text-[#e5c158] border border-[#e5c158]/40 text-xs font-cinzel flex items-center gap-1.5 hover:bg-[#2b0813] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter la configuration JSON</span>
                </button>

                <label className="py-2 px-3 rounded-xl bg-[#1b050c] text-[#e5c158] border border-[#e5c158]/40 text-xs font-cinzel flex items-center gap-1.5 hover:bg-[#2b0813] cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importer un fichier JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJson}
                  />
                </label>

                <button
                  onClick={handleReset}
                  className="py-2 px-3 rounded-xl bg-[#3a0610] text-[#ff8899] border border-red-500/30 text-xs font-cinzel flex items-center gap-1.5 hover:bg-red-900/40 cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Réinitialiser</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 bg-[#250711] border-t border-[#e5c158]/30">
          {savedSuccess ? (
            <span className="text-xs text-green-400 font-cinzel flex items-center gap-1">
              <Check className="w-4 h-4" />
              Modifications enregistrées avec amour !
            </span>
          ) : (
            <span className="text-[11px] text-[#f1cbd2]/60 font-sans">
              Tous les changements sont sauvegardés immédiatement
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl font-cinzel text-xs font-semibold text-[#f1cbd2] bg-transparent hover:bg-white/5 cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleSave}
              className="py-2 px-5 rounded-xl font-cinzel text-xs font-bold text-white bg-[#9e1b32] hover:bg-[#be2340] border border-[#e5c158] flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-[#e5c158]" />
              <span>Enregistrer</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
