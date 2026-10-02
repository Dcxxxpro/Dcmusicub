export interface BotConfig {
  apiId: string;
  apiHash: string;
  sessionString: string;
  botToken: string;
  ownerId: string;
  sudoUsers: string;
  streamQuality: '720p' | '1080p' | '480p';
  enableDualGpu: boolean;
  enableWhisper: boolean;
  keepAlivePort: number;
  githubUsername: string;
  githubRepoName: string;
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: 'owner' | 'userbot' | 'assistant_bot' | 'system' | 'sudo';
  senderName: string;
  avatarColor: string;
  timestamp: string;
  text: string;
  isCommand?: boolean;
  replyToId?: string;
  inlineButtons?: Array<Array<{ text: string; callbackData: string; action?: string }>>;
  media?: {
    type: 'audio' | 'video' | 'photo' | 'terminal';
    title?: string;
    subtitle?: string;
    duration?: string;
    thumbnail?: string;
  };
}

export interface VoiceChatState {
  isActive: boolean;
  title: string;
  artist: string;
  duration: number; // in seconds
  currentTime: number; // in seconds
  isPlaying: boolean;
  isVideo: boolean;
  quality: '720p' | '1080p' | '480p';
  volume: number; // 1-200
  gpu0Util: number; // percentage
  gpu1Util: number; // percentage
  gpu0Vram: string; // e.g. "3.2 / 16 GB"
  gpu1Vram: string; // e.g. "1.1 / 16 GB"
  encoder: string; // "h264_nvenc (CUDA)"
  queue: Array<{ title: string; artist: string; duration: string; requestedBy: string; isVideo: boolean }>;
}
