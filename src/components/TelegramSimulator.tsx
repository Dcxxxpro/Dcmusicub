import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Square, 
  Volume2, 
  VolumeX, 
  Video, 
  Music, 
  Cpu, 
  Send, 
  Terminal, 
  CheckCheck,
  RefreshCw,
  Sliders,
  Sparkles,
  Users
} from 'lucide-react';
import { ChatMessage, VoiceChatState, BotConfig } from '../types';

interface TelegramSimulatorProps {
  config: BotConfig;
}

export const TelegramSimulator: React.FC<TelegramSimulatorProps> = ({ config }) => {
  // Voice Chat State
  const [vcState, setVcState] = useState<VoiceChatState>({
    isActive: true,
    title: 'The Weeknd - Blinding Lights (Official Video)',
    artist: 'The Weeknd',
    duration: 260,
    currentTime: 78,
    isPlaying: true,
    isVideo: true,
    quality: '1080p',
    volume: 100,
    gpu0Util: 18,
    gpu1Util: 6,
    gpu0Vram: '3.4 / 16.0 GB',
    gpu1Vram: '1.2 / 16.0 GB',
    encoder: 'h264_nvenc (CUDA)',
    queue: [
      { title: 'Queen - Bohemian Rhapsody', artist: 'Queen', duration: '5:55', requestedBy: 'Owner (Alex)', isVideo: true },
      { title: 'Daft Punk - Get Lucky', artist: 'Daft Punk', duration: '4:08', requestedBy: 'Sudo User (Dave)', isVideo: false },
    ]
  });

  // Simulated Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'owner',
      senderName: 'Master Alex (Owner)',
      avatarColor: 'bg-emerald-600',
      timestamp: '18:24',
      text: '.vplay The Weeknd Blinding Lights',
      isCommand: true
    },
    {
      id: 'm2',
      sender: 'assistant_bot',
      senderName: 'Assistant Bot [Companion]',
      avatarColor: 'bg-sky-600',
      timestamp: '18:24',
      text: `🎬 **Now Streaming on Voice Chat**\n\n🎵 **Title:** **The Weeknd - Blinding Lights (Official Video)**\n👤 **Uploader:** \`The Weeknd\`\n⏱ **Duration:** \`04:20\`\n🎥 **Stream Mode:** \`1080p Video (h264_nvenc)\`\n⚡ **Acceleration:** \`Dual Tesla T4 (GPU 0: NVENC / GPU 1: I/O)\`\n🎛 **Controls:** Use interactive inline buttons below:`,
      inlineButtons: [
        [
          { text: '⏸ Pause', callbackData: 'vc_pause', action: 'toggle_play' },
          { text: '⏭ Skip', callbackData: 'vc_skip', action: 'skip' },
          { text: '⏹ Stop', callbackData: 'vc_stop', action: 'stop' }
        ],
        [
          { text: '🔉 Vol -', callbackData: 'vc_voldown', action: 'vol_down' },
          { text: '🔊 Vol +', callbackData: 'vc_volup', action: 'vol_up' },
          { text: '📺 Mode: Video', callbackData: 'vc_mode', action: 'toggle_mode' }
        ],
        [
          { text: '⚡ 2x T4 GPU Stats', callbackData: 'gpu_stats_refresh', action: 'gpu_stats' },
          { text: '📜 Queue (2)', callbackData: 'vc_queue', action: 'show_queue' }
        ]
      ]
    },
    {
      id: 'm3',
      sender: 'owner',
      senderName: 'Master Alex (Owner)',
      avatarColor: 'bg-emerald-600',
      timestamp: '18:25',
      text: '.gpu',
      isCommand: true
    },
    {
      id: 'm4',
      sender: 'assistant_bot',
      senderName: 'Assistant Bot [Companion]',
      avatarColor: 'bg-sky-600',
      timestamp: '18:25',
      text: `⚡ **Kaggle 2x NVIDIA Tesla T4 Telemetry**\n\n**[🎯 GPU 0 (PyTgCalls NVENC Transcoder)]**\n• **Hardware:** \`Tesla T4\`\n• **Core Load:** \`18%\` | **VRAM Load:** \`21%\`\n• **Memory:** \`3.42 GB / 15.99 GB\` \`[██░░░░░░░░]\`\n• **Thermals:** \`48°C\` | **Power:** \`41.2 W\`\n\n**[⚙️ GPU 1 (yt-dlp, Whisper AI & I/O)]**\n• **Hardware:** \`Tesla T4\`\n• **Core Load:** \`6%\` | **VRAM Load:** \`8%\`\n• **Memory:** \`1.24 GB / 15.99 GB\` \`[█░░░░░░░░░]\`\n• **Thermals:** \`44°C\` | **Power:** \`28.5 W\`\n\n💡 *Hardware acceleration active: zero CPU throttling during 1080p VC streams.*`,
      inlineButtons: [
        [
          { text: '🔄 Refresh Telemetry', callbackData: 'gpu_stats_refresh', action: 'gpu_stats' },
          { text: '🗑 Close', callbackData: 'close_panel', action: 'close' }
        ]
      ]
    }
  ]);

  const [inputCommand, setInputCommand] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Timer simulation for playback bar
  useEffect(() => {
    if (!vcState.isPlaying || !vcState.isActive) return;
    const interval = setInterval(() => {
      setVcState(prev => ({
        ...prev,
        currentTime: prev.currentTime < prev.duration ? prev.currentTime + 1 : 0
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [vcState.isPlaying, vcState.isActive, vcState.duration]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Execute interactive callback actions from inline buttons
  const handleInlineAction = (action?: string, callbackData?: string) => {
    if (!action) return;

    if (action === 'toggle_play') {
      const nextPlayState = !vcState.isPlaying;
      setVcState(prev => ({ ...prev, isPlaying: nextPlayState }));
      showToast(nextPlayState ? '▶️ Stream Resumed' : '⏸ Stream Paused');

      // Update button text in chat message
      setMessages(prev => prev.map(msg => {
        if (msg.inlineButtons) {
          const updatedButtons = msg.inlineButtons.map(row => 
            row.map(btn => {
              if (btn.action === 'toggle_play') {
                return { ...btn, text: nextPlayState ? '⏸ Pause' : '▶️ Resume' };
              }
              return btn;
            })
          );
          return { ...msg, inlineButtons: updatedButtons };
        }
        return msg;
      }));
    } else if (action === 'skip') {
      if (vcState.queue.length > 0) {
        const nextTrack = vcState.queue[0];
        const remainingQueue = vcState.queue.slice(1);
        setVcState(prev => ({
          ...prev,
          title: nextTrack.title,
          artist: nextTrack.artist,
          duration: 280,
          currentTime: 0,
          isVideo: nextTrack.isVideo,
          queue: remainingQueue
        }));
        showToast(`⏭ Skipped to: ${nextTrack.title}`);
        
        // Add skip announcement
        const newMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          sender: 'assistant_bot',
          senderName: 'Assistant Bot [Companion]',
          avatarColor: 'bg-sky-600',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `⏭ **Skipped! Now Playing:** \`${nextTrack.title}\`\n⚡ *NVENC Transcoding on Tesla T4*`
        };
        setMessages(prev => [...prev, newMsg]);
      } else {
        showToast('Queue is empty!');
      }
    } else if (action === 'stop') {
      setVcState(prev => ({ ...prev, isActive: false, isPlaying: false }));
      showToast('⏹ Stream Stopped & Left Voice Chat');
    } else if (action === 'vol_up') {
      setVcState(prev => ({ ...prev, volume: Math.min(200, prev.volume + 15) }));
      showToast(`🔊 Volume: ${Math.min(200, vcState.volume + 15)}%`);
    } else if (action === 'vol_down') {
      setVcState(prev => ({ ...prev, volume: Math.max(10, prev.volume - 15) }));
      showToast(`🔉 Volume: ${Math.max(10, vcState.volume - 15)}%`);
    } else if (action === 'toggle_mode') {
      const nextIsVideo = !vcState.isVideo;
      setVcState(prev => ({ ...prev, isVideo: nextIsVideo }));
      showToast(nextIsVideo ? '🎥 Switched to 1080p Video Mode' : '🎵 Switched to 320kbps Audio Mode');
    } else if (action === 'gpu_stats') {
      const g0 = Math.floor(Math.random() * 8) + 16;
      const g1 = Math.floor(Math.random() * 5) + 5;
      setVcState(prev => ({ ...prev, gpu0Util: g0, gpu1Util: g1 }));
      showToast('⚡ Dual Tesla T4 telemetry refreshed!');
    } else if (action === 'show_queue') {
      const queueList = vcState.queue.map((item, idx) => `• #${idx + 1}: \`${item.title}\` (${item.duration})`).join('\n') || 'Queue is currently empty.';
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant_bot',
        senderName: 'Assistant Bot [Companion]',
        avatarColor: 'bg-sky-600',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `📜 **Upcoming Voice Chat Queue:**\n\n${queueList}`
      };
      setMessages(prev => [...prev, newMsg]);
    } else if (action === 'close') {
      showToast('Panel closed');
    }
  };

  // Handle command submission in chat
  const handleSendCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputCommand.trim()) return;

    const cmd = inputCommand.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user command
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'owner',
      senderName: 'Master Alex (Owner)',
      avatarColor: 'bg-emerald-600',
      timestamp: timeStr,
      text: cmd,
      isCommand: true
    };

    setMessages(prev => [...prev, userMsg]);
    setInputCommand('');

    // Simulate Bot response based on command
    setTimeout(() => {
      let botResponse: ChatMessage | null = null;
      const lower = cmd.toLowerCase();

      if (lower.startsWith('.vplay') || lower.startsWith('.play')) {
        const isVid = lower.startsWith('.vplay');
        const songName = cmd.split(' ').slice(1).join(' ') || 'Daft Punk - Instant Crush';
        
        setVcState(prev => ({
          ...prev,
          isActive: true,
          isPlaying: true,
          isVideo: isVid,
          title: songName,
          currentTime: 0,
          duration: 310
        }));

        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant_bot',
          senderName: 'Assistant Bot [Companion]',
          avatarColor: 'bg-sky-600',
          timestamp: timeStr,
          text: `🎬 **Now Streaming on Voice Chat**\n\n🎵 **Title:** **${songName}**\n👤 **Uploader:** \`YouTube VEVO\`\n⏱ **Duration:** \`05:10\`\n🎥 **Stream Mode:** \`${isVid ? '1080p Video (h264_nvenc)' : '320kbps Opus Audio'}\`\n⚡ **Acceleration:** \`Dual Tesla T4 (GPU 0: NVENC)\`\n🎛 **Controls:** Interactive buttons ready:`,
          inlineButtons: [
            [
              { text: '⏸ Pause', callbackData: 'vc_pause', action: 'toggle_play' },
              { text: '⏭ Skip', callbackData: 'vc_skip', action: 'skip' },
              { text: '⏹ Stop', callbackData: 'vc_stop', action: 'stop' }
            ],
            [
              { text: '🔉 Vol -', callbackData: 'vc_voldown', action: 'vol_down' },
              { text: '🔊 Vol +', callbackData: 'vc_volup', action: 'vol_up' },
              { text: isVid ? '📺 Mode: Video' : '🎵 Mode: Audio', callbackData: 'vc_mode', action: 'toggle_mode' }
            ],
            [
              { text: '⚡ 2x T4 GPU Stats', callbackData: 'gpu_stats_refresh', action: 'gpu_stats' },
              { text: '📜 Queue', callbackData: 'vc_queue', action: 'show_queue' }
            ]
          ]
        };
      } else if (lower === '.gpu' || lower === '.nvidia' || lower === '.t4') {
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant_bot',
          senderName: 'Assistant Bot [Companion]',
          avatarColor: 'bg-sky-600',
          timestamp: timeStr,
          text: `⚡ **Kaggle 2x NVIDIA Tesla T4 Telemetry**\n\n**[🎯 GPU 0 (PyTgCalls NVENC Transcoder)]**\n• **Hardware:** \`Tesla T4\`\n• **Core Load:** \`${vcState.gpu0Util}%\` | **VRAM Load:** \`22%\`\n• **Memory:** \`${vcState.gpu0Vram}\`\n• **Thermals:** \`49°C\` | **Power:** \`42.8 W\`\n\n**[⚙️ GPU 1 (yt-dlp, Whisper AI & I/O)]**\n• **Hardware:** \`Tesla T4\`\n• **Core Load:** \`${vcState.gpu1Util}%\` | **VRAM Load:** \`8%\`\n• **Memory:** \`${vcState.gpu1Vram}\`\n• **Thermals:** \`44°C\` | **Power:** \`29.1 W\`\n\n💡 *Hardware acceleration active: zero CPU throttling during 1080p VC streams.*`,
          inlineButtons: [
            [
              { text: '🔄 Refresh Telemetry', callbackData: 'gpu_stats_refresh', action: 'gpu_stats' },
              { text: '🗑 Close', callbackData: 'close_panel', action: 'close' }
            ]
          ]
        };
      } else if (lower.startsWith('.eval')) {
        const codeExpr = cmd.slice(5).trim() || '2**32';
        let evalResult = '';
        try {
          // Safe mathematical demo eval
          evalResult = String(Function(`"use strict"; return (${codeExpr})`)());
        } catch {
          evalResult = `Result: ${codeExpr} [Executed asynchronously on Python 3.10 runtime]`;
        }
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'userbot',
          senderName: 'Master Alex (Userbot)',
          avatarColor: 'bg-emerald-600',
          timestamp: timeStr,
          text: `🐍 **Async Python Evaluation** (⏱ \`1.42ms\`)\n\n📥 **Input:**\n\`\`\`python\n${codeExpr}\n\`\`\`\n📤 **Output:**\n\`\`\`python\n${evalResult}\n\`\`\``
        };
      } else if (lower.startsWith('.sh')) {
        const shellCmd = cmd.slice(3).trim() || 'nvidia-smi -L';
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'userbot',
          senderName: 'Master Alex (Userbot)',
          avatarColor: 'bg-emerald-600',
          timestamp: timeStr,
          text: `💻 **Command:** \`${shellCmd}\`\n⏱ **Time:** \`14.2ms\`\n\n\`\`\`bash\nGPU 0: Tesla T4 (UUID: GPU-47a32b...)\nGPU 1: Tesla T4 (UUID: GPU-88c91a...)\nCUDA Version: 12.2 | Driver: 535.104.05\n\`\`\``
        };
      } else if (lower === '.sudolist') {
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'userbot',
          senderName: 'Master Alex (Userbot)',
          avatarColor: 'bg-emerald-600',
          timestamp: timeStr,
          text: `🛡 **Authorized Sudo Administrators:**\n\n• \`${config.ownerId || '123456789'}\` 👑 (Owner)\n• \`987654321\` 🛡 (Sudo)\n• \`555123456\` 🛡 (Sudo)`
        };
      } else if (lower.startsWith('.song')) {
        const title = cmd.slice(5).trim() || 'Starboy';
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'userbot',
          senderName: 'Master Alex (Userbot)',
          avatarColor: 'bg-emerald-600',
          timestamp: timeStr,
          text: `🎵 **Uploaded 320kbps MP3:** \`${title}.mp3\`\n⚡ *Downloaded at 94 MB/s via Kaggle Gigabit link*`
        };
      } else if (lower === '.help') {
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant_bot',
          senderName: 'Assistant Bot [Companion]',
          avatarColor: 'bg-sky-600',
          timestamp: timeStr,
          text: `📖 **Kaggle Dual-T4 Userbot Commands:**\n\n` +
                `**🎬 Voice Chat Streaming:**\n` +
                `• \`.vplay <query/url>\` - Stream 1080p/720p Video (NVENC)\n` +
                `• \`.play <query/url>\` - Stream 320kbps Opus Audio\n` +
                `• \`.pause\` / \`.resume\` - Toggle playback\n` +
                `• \`.skip\` - Skip to next track in queue\n` +
                `• \`.stop\` - End stream and leave voice chat\n` +
                `• \`.volume <1-200>\` - Adjust call volume\n\n` +
                `**⚡ Hardware & Sudo:**\n` +
                `• \`.gpu\` - Dual Tesla T4 real-time telemetry\n` +
                `• \`.eval <code>\` - Run Python asynchronously\n` +
                `• \`.sh <cmd>\` - Execute bash shell in Kaggle\n` +
                `• \`.addsudo <id>\` / \`.sudolist\` - Manage sudos\n\n` +
                `**🛠 Moderation & Media:**\n` +
                `• \`.ban\`, \`.mute\`, \`.kick\`, \`.purge\`\n` +
                `• \`.song <title>\` - Download 320kbps MP3\n` +
                `• \`.video <title>\` - Download MP4 with NVENC`
        };
      } else {
        botResponse = {
          id: `resp-${Date.now()}`,
          sender: 'userbot',
          senderName: 'Master Alex (Userbot)',
          avatarColor: 'bg-emerald-600',
          timestamp: timeStr,
          text: `⚡ Executed command: \`${cmd}\`. Type \`.help\` to see all features.`
        };
      }

      if (botResponse) {
        setMessages(prev => [...prev, botResponse!]);
      }
    }, 450);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 border border-emerald-500/50 text-emerald-300 text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simulator Window */}
      <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl flex flex-col h-[750px]">
        {/* Telegram Chat Header */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
                TG
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-neutral-900 rounded-full" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white flex items-center gap-2">
                <span>Production Supergroup</span>
                <span className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono">
                  1,480 members
                </span>
              </div>
              <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Dual-T4 Userbot & Assistant Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleInlineAction('gpu_stats')}
              className="px-2.5 py-1 text-xs font-mono text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-md flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>T4 Load: {vcState.gpu0Util}% / {vcState.gpu1Util}%</span>
            </button>
          </div>
        </div>

        {/* Pinned Voice Chat Interactive Stream Bar */}
        {vcState.isActive && (
          <div className="bg-neutral-900/95 border-b border-neutral-800/80 px-5 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg ${vcState.isVideo ? 'bg-indigo-950 text-indigo-400 border border-indigo-800/60' : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'}`}>
                {vcState.isVideo ? <Video className="w-4 h-4" /> : <Music className="w-4 h-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate max-w-xs md:max-w-md">
                    {vcState.title}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/40 rounded px-1">
                    {vcState.isVideo ? '1080p NVENC' : '320kbps OPUS'}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-neutral-400 mt-1">
                  <span className="font-mono text-[11px] tabular-nums">
                    {formatSeconds(vcState.currentTime)} / {formatSeconds(vcState.duration)}
                  </span>
                  <div className="w-32 sm:w-48 bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${(vcState.currentTime / vcState.duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-neutral-500 hidden sm:inline">Vol: {vcState.volume}%</span>
                </div>
              </div>
            </div>

            {/* Quick mini controls */}
            <div className="flex items-center gap-1.5 self-end md:self-auto">
              <button
                onClick={() => handleInlineAction('toggle_play')}
                title={vcState.isPlaying ? 'Pause' : 'Resume'}
                className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                {vcState.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleInlineAction('skip')}
                title="Skip Track"
                className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleInlineAction('toggle_mode')}
                title="Toggle Video / Audio Mode"
                className="p-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
              >
                {vcState.isVideo ? <Video className="w-3.5 h-3.5 text-indigo-400" /> : <Music className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
              <button
                onClick={() => handleInlineAction('stop')}
                title="Stop Stream"
                className="p-1.5 rounded-md bg-neutral-800 hover:bg-red-950 text-neutral-300 hover:text-red-400 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-neutral-950 to-neutral-900/60">
          {messages.map((msg) => {
            const isMe = msg.sender === 'owner';
            const isBot = msg.sender === 'assistant_bot';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-2xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full ${msg.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0 shadow`}>
                  {msg.senderName.slice(0, 2).toUpperCase()}
                </div>

                <div className="space-y-1 max-w-[85%] sm:max-w-[75%]">
                  <div className={`flex items-center gap-2 text-xs ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-neutral-300">{msg.senderName}</span>
                    <span className="text-neutral-500 font-mono text-[10px]">{msg.timestamp}</span>
                  </div>

                  {/* Message Bubble */}
                  <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-md ${
                    isMe 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : isBot 
                        ? 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none' 
                        : 'bg-neutral-850 border border-neutral-800 text-neutral-200 rounded-tl-none'
                  }`}>
                    <div className="whitespace-pre-wrap font-sans">
                      {msg.text.split('\n').map((line, i) => {
                        // Quick formatting preview
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <div key={i} className="font-bold text-white my-0.5">{line.replace(/\*\*/g, '')}</div>;
                        }
                        if (line.includes('```')) {
                          return <pre key={i} className="p-2 my-1 rounded bg-black/50 font-mono text-xs overflow-x-auto text-emerald-300 border border-neutral-800">{line.replace(/```[a-z]*/g, '')}</pre>;
                        }
                        return <div key={i} className="my-0.5">{line}</div>;
                      })}
                    </div>

                    {/* Interactive Telegram Inline Buttons */}
                    {msg.inlineButtons && msg.inlineButtons.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5">
                        {msg.inlineButtons.map((row, rowIdx) => (
                          <div key={rowIdx} className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                            {row.map((btn, btnIdx) => (
                              <button
                                key={btnIdx}
                                onClick={() => handleInlineAction(btn.action, btn.callbackData)}
                                className="px-2.5 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800/90 hover:bg-neutral-700 active:bg-emerald-900 border border-neutral-700/70 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center truncate"
                              >
                                <span>{btn.text}</span>
                              </button>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Command Suggestions */}
        <div className="bg-neutral-900/60 border-t border-neutral-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-neutral-500 shrink-0 font-mono">Quick Test:</span>
          {[
            { label: '.vplay Bohemian Rhapsody', cmd: '.vplay Bohemian Rhapsody' },
            { label: '.play Starboy', cmd: '.play Starboy' },
            { label: '.gpu', cmd: '.gpu' },
            { label: '.eval 2**32', cmd: '.eval 2**32' },
            { label: '.sh nvidia-smi', cmd: '.sh nvidia-smi' },
            { label: '.sudolist', cmd: '.sudolist' },
            { label: '.help', cmd: '.help' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputCommand(item.cmd);
              }}
              className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded font-mono text-[11px] whitespace-nowrap border border-neutral-700/60 transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Telegram Chat Input Bar */}
        <form onSubmit={handleSendCommand} className="bg-neutral-900 border-t border-neutral-800 p-3 sm:p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Send command (e.g. .vplay Song Name, .gpu, .eval 100*5, .help)..."
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-neutral-950 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <button
            type="submit"
            className="p-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
