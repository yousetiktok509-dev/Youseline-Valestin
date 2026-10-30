export interface MemoryPhoto {
  id: string;
  url: string;
  title: string;
  subtitle: string;
  date: string;
  note: string;
  category: 'voyage' | 'amour' | 'fête' | 'projet' | 'moment';
}

export interface LovePromise {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface PartyConfig {
  honoreeName: string;
  honoreeFullName: string;
  birthdayDate: string; // "30 Octobre"
  senderSignature: string; // "Ton amour"
  accessCode: string; // optional passcode
  isPasswordProtected: boolean;
  
  // Custom letters
  invitationLetter: string;
  cakeWishNote: string;
  giftLoveLetter: string;
  giftPromises: LovePromise[];
  finalLetter: string;
  dinnerSecretNote: string;
  roseHiddenNote: string;
  
  // Photos
  photos: MemoryPhoto[];

  // Custom audio
  musicTrack: 'procedural-piano' | 'procedural-harp' | 'procedural-celesta' | 'custom';
  customAudioUrl?: string;
  customAudioName?: string;

  // Scene toggles
  enabledScenes: number[];
}

export type SceneId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
