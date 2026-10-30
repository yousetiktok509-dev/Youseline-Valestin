import { PartyConfig } from '../types/party';

// High-fidelity procedural SVG memories so there are NEVER broken images or 404s
const createMemorySvgData = (bgGradient: string, iconSymbol: string, title: string, subtitle: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGradient}
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fff1bd"/>
        <stop offset="50%" stop-color="#e5c158"/>
        <stop offset="100%" stop-color="#b8860b"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="800" height="600" fill="url(#grad)" rx="16"/>
    <!-- Decorative border -->
    <rect x="24" y="24" width="752" height="552" fill="none" stroke="url(#gold)" stroke-width="2" rx="12" opacity="0.45"/>
    <rect x="36" y="36" width="728" height="528" fill="none" stroke="url(#gold)" stroke-width="1" rx="8" opacity="0.25" stroke-dasharray="8 6"/>
    
    <!-- Central Icon Silhouette -->
    <g transform="translate(400, 240)" filter="url(#glow)">
      ${iconSymbol}
    </g>

    <!-- Typography -->
    <text x="400" y="440" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="bold" fill="url(#gold)">
      ${title}
    </text>
    <text x="400" y="485" text-anchor="middle" font-family="sans-serif" font-size="19" fill="#fcf8f2" opacity="0.9">
      ${subtitle}
    </text>
    <text x="400" y="525" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#e5c158" opacity="0.8" letter-spacing="3">
      B &amp; J · SOUVENIR PRÉCIEUX
    </text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const defaultPartyConfig: PartyConfig = {
  honoreeName: 'Baguens',
  honoreeFullName: 'Baguens Jérôme',
  birthdayDate: '30 Octobre',
  senderSignature: 'Ton amour ❤️',
  accessCode: '3010',
  isPasswordProtected: false, // can be toggled in admin
  
  invitationLetter: `Mon amour,

Aujourd'hui, j'ai préparé quelque chose de spécial pour toi.
Même si je ne suis pas physiquement à tes côtés, je voulais que tu vives un anniversaire différent.

Cette soirée est entièrement pour toi.
Laisse-moi t'emmener dans un endroit où chaque détail a été préparé avec amour.

Joyeux anniversaire, mon Baguens. ❤️`,

  cakeWishNote: `Que cette nouvelle année de ta vie t'apporte la santé, la paix, le bonheur et la réussite. Je t'aime. ❤️`,

  giftLoveLetter: `Mon très cher Baguens,

Depuis le tout premier jour où nos regards se sont croisés, tu as apporté une lumière incomparable dans ma vie. 

Je t'admire tellement : ton intelligence, ta détermination inébranlable dans tes projets, ton rire contagieux qui chasse tous mes doutes, et surtout cette gentillesse pure qui fait de toi un homme exceptionnel.

En ce 30 octobre, même avec la distance qui nous sépare aujourd'hui, sache que chaque battement de mon cœur résonne pour toi. Rien n'efface notre lien. Tu es ma fierté, mon confident, mon partenaire et mon plus bel amour.

Que cette nouvelle bougie illumine tes ambitions les plus grandes. Je serai toujours là à tes côtés pour t'applaudir et t'aimer.

Joyeux anniversaire mon roi, je t'aime infiniment. ❤️`,

  giftPromises: [
    {
      id: 'p1',
      title: 'Être Ton Plus Grand Soutien',
      description: 'Toujours croire en tes rêves et projets les plus audacieux, t’encourager quand tu doutes et célébrer chacune de tes réussites.',
      icon: 'HeartHandshake'
    },
    {
      id: 'p2',
      title: 'Un Amour Inconditionnel',
      description: 'T’aimer chaque jour avec passion et patience, dans les moments de joie comme dans les épreuves de la vie.',
      icon: 'Flame'
    },
    {
      id: 'p3',
      title: 'Notre Complicité Sacrée',
      description: 'Préserver nos fous rires, nos regards complices qui n’ont besoin d’aucun mot, et nos discussions infinies sous les étoiles.',
      icon: 'Sparkles'
    },
    {
      id: 'p4',
      title: 'Construire Notre Avenir',
      description: 'Bâtir main dans la main une vie sereine, riche d’aventures, de voyages inoubliables et de bonheur partagé.',
      icon: 'Compass'
    },
    {
      id: 'p5',
      title: 'Te Choisir Chaque Jour',
      description: 'Peu importe ce que le destin nous réserve, je te choisirai toujours, toi et seulement toi, mon Baguens.',
      icon: 'Crown'
    }
  ],

  finalLetter: `Mon amour,

Aujourd'hui, c'est ton jour.
J'aurais aimé être près de toi pour te serrer dans mes bras, te regarder dans les yeux et te souhaiter un joyeux anniversaire.

Mais même à distance, je voulais t'offrir un moment qui restera dans nos souvenirs.

Chaque décoration, chaque surprise et chaque petit détail de cette soirée a été pensé pour toi.

Je te souhaite une nouvelle année remplie de bonheur, de santé, de réussite et de belles opportunités.

Je souhaite voir tes rêves devenir réalité et ton sourire continuer à illuminer tes journées.

Merci d'être cette personne si importante dans ma vie.

Je t'aime, mon Baguens.
Joyeux anniversaire, mon amour. ❤️`,

  dinnerSecretNote: `Ce soir, mon cœur est assis en face du tien. Savoure chaque instant de cette soirée magique, mon roi. ❤️`,
  roseHiddenNote: `Chaque pétale de rose représente une raison pour laquelle je t'aime... et même l'univers entier ne suffirait pas à toutes les contenir. ❤️`,

  photos: [
    {
      id: 'photo-couple-graduation',
      url: '/assets/aistudio/file_00000000631c81f5978642333dc07885_6062089f.png',
      title: 'Notre Amour & Tes Réussites',
      subtitle: 'Génie Civil & Célébration à Deux',
      date: 'Moments d\'Exception',
      note: 'Regarde-nous, si beaux et si complices ! Je suis tellement fière de toi, de ton parcours et de l\'homme extraordinaire que tu es. À tes côtés, chaque réussite a une saveur magique.',
      category: 'projet'
    },
    {
      id: 'photo-roi-trone',
      url: '/assets/aistudio/file_000000008a9481f59fc95f0c6b9cb479_2701cc93.png',
      title: 'Le Roi de Mon Cœur',
      subtitle: 'Élégance royale & prestance',
      date: '30 Octobre',
      note: 'Assis sur ton trône comme le roi que tu es dans ma vie. Cette couronne te va si bien ! Tu as cette force tranquille et cette élégance naturelle qui me font tomber amoureuse de toi encore et encore.',
      category: 'amour'
    },
    {
      id: 'photo-gateau-voeu',
      url: '/assets/aistudio/file_00000000a7cc81f58ed3bdb6d1d33d73_c3e85b97.png',
      title: 'Fais Ton Plus Beau Vœu',
      subtitle: 'Devant ton gâteau d\'anniversaire',
      date: 'Joyeux Anniversaire Baguens',
      note: 'Ton regard devant ce gâteau illuminé... En ce 30 octobre, je prie pour que chaque vœu secret de ton cœur devienne réalité. Tu mérites tout le bonheur de l\'univers.',
      category: 'fête'
    },
    {
      id: 'photo-terrasse-sunset',
      url: '/assets/aistudio/file_00000000810881f5a972cec29e96b5c7_7827cb10.png',
      title: 'Douceur d\'un Soir d\'Anniversaire',
      subtitle: 'Au coucher du soleil sous les lumières',
      date: 'Détente & Bonheur',
      note: 'Ces moments de calme et de complicité où rien d\'autre ne compte. Ton sourire décontracté et ton charme unique... Merci d\'illuminer mes journées.',
      category: 'moment'
    },
    {
      id: 'photo-portrait-charme',
      url: '/assets/aistudio/file_00000000a32c81f59cf6271217883717_868e267a.png',
      title: 'Baguens Jérôme',
      subtitle: 'L\'homme qui fait battre mon cœur',
      date: '30 Octobre Pour Toujours',
      note: 'Simplement toi. Beau, sincère, ambitieux et au grand cœur. Je remercie le ciel chaque jour de t\'avoir mis sur mon chemin.',
      category: 'amour'
    }
  ],

  musicTrack: 'custom',
  customAudioUrl: '/assets/aistudio/Joyeux_anniversaire__mon__2__8fafcb2d.mp3',
  customAudioName: 'Baguens, mon amour, mon bonheur',
  enabledScenes: [1, 2, 3, 4, 5, 6, 7, 8, 9]
};

const STORAGE_KEY = 'nuit_magique_baguens_config_v1';

export const loadPartyConfig = (): PartyConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultPartyConfig;
    const parsed = JSON.parse(raw);
    // If photos are empty or contain old synthetic SVG ids, ensure Baguens' real photos are loaded
    if (!parsed.photos || parsed.photos.length === 0 || parsed.photos.some((p: any) => p.id === 'photo-1' || p.url.startsWith('data:image/svg'))) {
      parsed.photos = defaultPartyConfig.photos;
    }
    // Ensure the custom song Baguens, mon amour, mon bonheur is set if none was defined
    if (!parsed.customAudioUrl) {
      parsed.musicTrack = defaultPartyConfig.musicTrack;
      parsed.customAudioUrl = defaultPartyConfig.customAudioUrl;
      parsed.customAudioName = defaultPartyConfig.customAudioName;
    }
    return { ...defaultPartyConfig, ...parsed };
  } catch {
    return defaultPartyConfig;
  }
};

export const savePartyConfig = (config: PartyConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Could not save config to localStorage', err);
  }
};

export const resetPartyConfig = (): PartyConfig => {
  localStorage.removeItem(STORAGE_KEY);
  return defaultPartyConfig;
};
