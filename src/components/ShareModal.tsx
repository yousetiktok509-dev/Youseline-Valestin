import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Send,
  MessageCircle,
  Share2,
  Sparkles,
  Heart,
  Lock,
  Smartphone,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { PartyConfig } from '../types/party';
import { soundEngine } from '../services/soundEngine';

interface ShareModalProps {
  config: PartyConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ config, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<number>(0);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  // The permanent public shared URL for Baguens (unauthenticated, no Google login required)
  const getPublicUrl = (): string => {
    if (typeof window !== 'undefined' && window.location?.origin) {
      const origin = window.location.origin;
      // If opened inside AI Studio dev environment (ais-dev-...), convert to public link (ais-pre-...)
      if (origin.includes('ais-dev-')) {
        return origin.replace('ais-dev-', 'ais-pre-');
      }
      if (origin.includes('run.app') && !origin.includes('localhost')) {
        return origin;
      }
    }
    return 'https://ais-pre-cyeadqnowxw3h2yckmftyz-524466489796.us-west1.run.app';
  };

  const sharedUrl = getPublicUrl();

  const templates = [
    {
      title: 'Romantique & Mystérieux (Recommandé)',
      text: `Mon amour, aujourd'hui est ton jour... Même avec la distance, je voulais que tu vives un anniversaire magique et inoubliable. Mets tes écouteurs, allume le son et découvre la surprise que j'ai préparée pour toi ici : ${sharedUrl} ${
        config.isPasswordProtected ? `(Code secret : ${config.accessCode}) ` : ''
      }❤️🎂 Joyeux anniversaire mon roi !`,
    },
    {
      title: 'Chaleureux & Festif',
      text: `Joyeux anniversaire mon Baguens d'amour ! 🎉 Ta fête d'anniversaire virtuelle commence dès maintenant. Ouvre ton invitation privée sur ton téléphone : ${sharedUrl} ${
        config.isPasswordProtected ? `(Code : ${config.accessCode}) ` : ''
      }🥂✨ Je t'aime tellement !`,
    },
    {
      title: 'Poétique & Émouvant',
      text: `Pour l'homme le plus exceptionnel de ma vie... Une nuit magique a été imaginée pour toi avec tout mon amour : ${sharedUrl} ${
        config.isPasswordProtected ? `(Code d'accès : ${config.accessCode}) ` : ''
      }❤️ 30 Octobre pour toujours.`,
    },
  ];

  const currentMessage = templates[selectedTemplate].text;

  const handleCopyLinkOnly = () => {
    navigator.clipboard.writeText(sharedUrl);
    soundEngine.playChime(880, 0.3);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyFullMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    soundEngine.playChime(880, 0.3);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Une Nuit Magique pour ${config.honoreeName} ❤️`,
          text: currentMessage,
          url: sharedUrl,
        });
      } catch {
        // Share cancelled or unavailable
      }
    } else {
      handleCopyFullMessage();
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentMessage)}`;
  const smsUrl = `sms:?&body=${encodeURIComponent(currentMessage)}`;

  // Quick procedural QR SVG generator for the URL
  const qrSvgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=e5c158&bgcolor=1f050c&data=${encodeURIComponent(
    sharedUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bordeaux-card rounded-2xl shadow-2xl border-2 border-[#e5c158] gold-glow text-[#fcf8f2] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#e5c158]/30 bg-[#250711]">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#e5c158]/20 flex items-center justify-center text-[#e5c158] border border-[#e5c158]/40">
              <Send className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-cinzel text-[#e5c158] tracking-widest uppercase block">
                ✦ LIEN D&apos;INVITATION OFFICIEL ✦
              </span>
              <h2 className="text-base sm:text-lg font-cinzel font-bold text-gold-gradient">
                Envoyer la Surprise à {config.honoreeName} ❤️
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#3d0a18] text-[#e5c158] hover:bg-[#590e23] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm">
          {/* Main Link Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-cinzel text-[#e5c158] font-bold flex items-center gap-1.5">
                <span>Lien officiel pour Baguens</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✓ 100% Public · Sans compte Google
                </span>
              </label>
              <span className="text-[10px] font-sans text-[#f1cbd2]/70 font-normal hidden sm:inline">
                Accessible sur iPhone &amp; Android
              </span>
            </div>

            <div className="flex items-center gap-2 bg-[#19040b] border-2 border-[#e5c158]/60 rounded-xl p-2 sm:p-2.5">
              <div className="flex-1 font-mono text-xs sm:text-sm text-[#fff1bd] truncate px-1 select-all">
                {sharedUrl}
              </div>

              <button
                onClick={handleCopyLinkOnly}
                className="py-1.5 px-3 rounded-lg bg-[#e5c158] text-[#3a0610] font-cinzel font-bold text-xs flex items-center gap-1.5 hover:bg-[#ffd978] transition-colors cursor-pointer shrink-0 shadow-md"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
              <a
                href={sharedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#e5c158] hover:text-[#fff1bd] underline font-cinzel text-[11px]"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Tester le lien dans un nouvel onglet</span>
              </a>
              <span className="text-[10px] text-[#f1cbd2]/60">
                Aucune installation ni mot de passe requis
              </span>
            </div>

            {config.isPasswordProtected && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#e5c158] bg-[#2a0610] px-3 py-1.5 rounded-lg border border-[#e5c158]/30">
                <Lock className="w-3.5 h-3.5" />
                <span>
                  Code secret requis pour ouvrir la fête : <strong className="text-white tracking-widest">{config.accessCode}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Direct 1-Click Send Buttons */}
          <div>
            <label className="block text-xs font-cinzel text-[#e5c158] font-bold mb-2">
              Envoyer directement en 1 clic
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/60 text-white flex items-center justify-center gap-2 font-cinzel text-xs font-bold transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </a>

              {/* SMS / iMessage */}
              <a
                href={smsUrl}
                className="py-2.5 px-3 rounded-xl bg-[#007AFF]/20 hover:bg-[#007AFF]/30 border border-[#007AFF]/60 text-white flex items-center justify-center gap-2 font-cinzel text-xs font-bold transition-all shadow-md"
              >
                <Smartphone className="w-4 h-4 text-[#007AFF]" />
                <span>SMS / iMessage</span>
              </a>

              {/* Native Mobile Share Sheet */}
              <button
                onClick={handleNativeShare}
                className="py-2.5 px-3 rounded-xl bg-[#9e1b32] hover:bg-[#be2340] border border-[#e5c158]/60 text-white flex items-center justify-center gap-2 font-cinzel text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-[#e5c158]" />
                <span>Partager via...</span>
              </button>
            </div>
          </div>

          {/* Pre-written Romantic Messages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-cinzel text-[#e5c158] font-bold">
                Message d&apos;accompagnement pour Baguens
              </label>
              <span className="text-[11px] text-[#f1cbd2]/70">Choisis le style :</span>
            </div>

            {/* Template selector pills */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplate(idx)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-cinzel transition-all cursor-pointer ${
                    selectedTemplate === idx
                      ? 'bg-[#e5c158] text-[#3a0610] font-bold shadow-sm'
                      : 'bg-[#1e050c] text-[#f1cbd2] hover:bg-[#320815] border border-[#e5c158]/30'
                  }`}
                >
                  {tpl.title.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Message preview box */}
            <div className="relative bg-[#19040b] border border-[#e5c158]/40 rounded-xl p-3.5 text-xs text-[#fcf8f2] font-playfair leading-relaxed italic">
              « {currentMessage} »

              <button
                onClick={handleCopyFullMessage}
                className="mt-3 w-full py-2 rounded-lg bg-[#2a0610] hover:bg-[#3f0918] border border-[#e5c158]/50 text-[#e5c158] font-cinzel font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Message copié dans le presse-papier !' : 'Copier tout le message avec le lien'}</span>
              </button>
            </div>
          </div>

          {/* QR Code toggle */}
          <div className="pt-2 border-t border-[#e5c158]/20 flex items-center justify-between">
            <button
              onClick={() => setShowQr(!showQr)}
              className="text-xs font-cinzel text-[#e5c158] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQr ? 'Masquer le QR Code' : 'Afficher le QR Code pour scanner'}</span>
            </button>

            <a
              href={sharedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-cinzel text-[#f1cbd2]/80 hover:text-white flex items-center gap-1"
            >
              <span>Tester le lien dans un nouvel onglet</span>
              <ExternalLink className="w-3 h-3 text-[#e5c158]" />
            </a>
          </div>

          {/* QR Code Display */}
          {showQr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-center justify-center p-4 bg-[#1f050c] rounded-xl border border-[#e5c158]/40 text-center"
            >
              <div className="p-2 bg-[#1f050c] rounded-xl border-2 border-[#e5c158] shadow-lg">
                <img
                  src={qrSvgUrl}
                  alt="QR Code Anniversaire Baguens"
                  className="w-40 h-40 object-contain rounded-lg"
                />
              </div>
              <span className="font-cinzel text-xs text-[#e5c158] font-bold mt-2.5">
                Scanne avec la caméra du téléphone
              </span>
              <span className="text-[10px] text-[#f1cbd2]/70 font-sans">
                Ouvre directement l&apos;expérience sur son smartphone
              </span>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#250711] border-t border-[#e5c158]/30 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-playfair text-[#f1cbd2]/70 italic">
            <Heart className="w-3.5 h-3.5 text-[#e5c158] fill-[#e5c158]" />
            <span>Prêt pour un anniversaire inoubliable !</span>
          </div>

          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl font-cinzel text-xs font-bold text-white bg-[#9e1b32] hover:bg-[#bd223e] border border-[#e5c158] shadow-md cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
};
