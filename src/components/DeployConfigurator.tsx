import React, { useState } from 'react';
import { BotConfig } from '../types';
import { 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Key, 
  ShieldAlert, 
  Tv, 
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import { downloadKaggleNotebook, downloadFullCodebaseZip, getSingleCellKaggleScript } from '../utils/exportUtils';

interface DeployConfiguratorProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  onOpenSessionModal: () => void;
  onLaunchSimulator: () => void;
}

export const DeployConfigurator: React.FC<DeployConfiguratorProps> = ({
  config,
  setConfig,
  onOpenSessionModal,
  onLaunchSimulator
}) => {
  const [copiedCell, setCopiedCell] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleCopyCell = () => {
    const script = getSingleCellKaggleScript(config);
    navigator.clipboard.writeText(script);
    setCopiedCell(true);
    setTimeout(() => setCopiedCell(false), 2200);
  };

  const handleFillDemoValues = () => {
    setConfig({
      apiId: '2040123',
      apiHash: 'b4a1b0239cf2e88a09b43491efc02341',
      sessionString: 'BQFNJ...demo_pyrogram_session_string...',
      botToken: '7123456789:AAHq_demo_bot_token_from_botfather',
      ownerId: '123456789',
      sudoUsers: '987654321, 555123456',
      streamQuality: '720p',
      enableDualGpu: true,
      enableWhisper: true,
      keepAlivePort: 8080,
      githubUsername: 'dcpro25005',
      githubRepoName: 'telegram-dual-t4-userbot',
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-6 md:p-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>NVIDIA TESLA T4 x2 · DUAL-ACCELERATION ARCHITECTURE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-balance">
              Telegram Userbot for Kaggle 2x T4 GPU
            </h1>
            <p className="mt-2 text-sm md:text-base text-neutral-400 leading-relaxed">
              Engineered for PyTgCalls YouTube video & audio streaming in group voice chats with hardware NVENC transcoding. Includes full sudo remote control, companion bot for interactive inline keyboards, and anti-idle daemon.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleFillDemoValues}
              className="px-3.5 py-2 text-xs font-medium text-neutral-300 bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors"
            >
              Fill Sample Values
            </button>
            <button
              onClick={onLaunchSimulator}
              className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Test in Simulator</span>
              <span className="text-xs">→</span>
            </button>
          </div>
        </div>

        {/* Feature Badges Grid */}
        <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-neutral-500 font-medium">GPU 0 (cuda:0)</div>
            <div className="text-neutral-200 font-semibold mt-0.5">PyTgCalls NVENC Transcoder</div>
          </div>
          <div>
            <div className="text-neutral-500 font-medium">GPU 1 (cuda:1)</div>
            <div className="text-neutral-200 font-semibold mt-0.5">yt-dlp I/O & Whisper AI</div>
          </div>
          <div>
            <div className="text-neutral-500 font-medium">Buttons & UI</div>
            <div className="text-neutral-200 font-semibold mt-0.5">Companion Inline Bot Engine</div>
          </div>
          <div>
            <div className="text-neutral-500 font-medium">Remote Control</div>
            <div className="text-neutral-200 font-semibold mt-0.5">Owner & Multi-Sudo Terminal</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Config Form & Quick Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Configurator */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Telegram Core Credentials */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Key className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Telegram Account Credentials</h2>
              </div>
              <a
                href="https://my.telegram.org"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>my.telegram.org</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  API_ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2040123"
                  value={config.apiId}
                  onChange={(e) => setConfig({ ...config, apiId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  API_HASH
                </label>
                <input
                  type="text"
                  placeholder="e.g. b4a1b0239cf2e88a09b43491efc02341"
                  value={config.apiHash}
                  onChange={(e) => setConfig({ ...config, apiHash: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Pyrogram String Session */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-400">
                  SESSION_STRING (Userbot Pyrogram Client)
                </label>
                <button
                  type="button"
                  onClick={onOpenSessionModal}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  Need a Session String?
                </button>
              </div>
              <textarea
                rows={2}
                placeholder="Paste your Pyrogram v2 string session (BQFNJ...)"
                value={config.sessionString}
                onChange={(e) => setConfig({ ...config, sessionString: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono resize-none"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Allows your user account to join Voice Chats and execute user commands (`.vplay`, `.gpu`, `.eval`).
              </p>
            </div>

            {/* Assistant Bot Token for Inline Buttons */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-neutral-400">
                  BOT_TOKEN (Assistant Bot for Inline Keyboards)
                </label>
                <a
                  href="https://t.me/BotFather"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>@BotFather</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="text"
                placeholder="e.g. 7123456789:AAHq_demo_bot_token"
                value={config.botToken}
                onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Enables beautiful Telegram inline buttons (`[ ⏸ Pause ] [ ⏭ Skip ] [ 🔊 Vol ]`) and interactive menus on voice chat messages.
              </p>
            </div>
          </div>

          {/* Section 2: Ownership & Sudo Permissions */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">Owner & Sudo User Authorization</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  OWNER_ID (Master Telegram User ID)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456789"
                  value={config.ownerId}
                  onChange={(e) => setConfig({ ...config, ownerId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Your primary Telegram user ID. Only the owner can evaluate code and grant new sudos.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  SUDO_USERS (Comma-separated IDs)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 987654321, 555123456"
                  value={config.sudoUsers}
                  onChange={(e) => setConfig({ ...config, sudoUsers: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="mt-1 text-xs text-neutral-500">
                  Friends or secondary accounts allowed to trigger `.play`, `.vplay`, `.skip`, and `.gpu`.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Dual T4 GPU Transcoding Settings */}
          <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Dual Tesla T4 Transcoding Engine</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-neutral-400 hover:text-white"
              >
                {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Default Stream Quality
                </label>
                <select
                  value={config.streamQuality}
                  onChange={(e) => setConfig({ ...config, streamQuality: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="1080p">1080p (FHD - 1920x1080 @ 30fps) - Recommended on T4</option>
                  <option value="720p">720p (HD - 1280x720 @ 30fps) - Balanced & Smooth</option>
                  <option value="480p">480p (SD - 854x480 @ 30fps) - Minimal Bandwidth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1.5">
                  Anti-Idle Keepalive Web Port
                </label>
                <input
                  type="number"
                  value={config.keepAlivePort}
                  onChange={(e) => setConfig({ ...config, keepAlivePort: Number(e.target.value) || 8080 })}
                  className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {showAdvanced && (
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-xs font-medium text-neutral-200">Dual GPU Split Assignment</div>
                    <div className="text-xs text-neutral-500">GPU 0 for real-time video streaming, GPU 1 for yt-dlp & background tasks</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableDualGpu}
                    onChange={(e) => setConfig({ ...config, enableDualGpu: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>

                <div className="flex items-center justify-between py-1">
                  <div>
                    <div className="text-xs font-medium text-neutral-200">Whisper Voice-to-Text Model on GPU 1</div>
                    <div className="text-xs text-neutral-500">Transcribe voice messages to text with OpenAI Whisper using CUDA on second T4</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.enableWhisper}
                    onChange={(e) => setConfig({ ...config, enableWhisper: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Quick Deploy Action & 1-Cell Kaggle Runner */}
        <div className="space-y-6">
          {/* Quick Launch Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Deploy to Kaggle</span>
            </h3>

            <p className="text-xs text-neutral-400 leading-relaxed">
              You can deploy this in two ways: upload the pre-built Jupyter Notebook (<code className="text-emerald-400">.ipynb</code>), or copy the 1-cell python script straight into a Kaggle Notebook!
            </p>

            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => downloadKaggleNotebook(config)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Kaggle Notebook (.ipynb)</span>
              </button>

              <button
                onClick={() => downloadFullCodebaseZip(config)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4 text-neutral-950" />
                <span>Download Complete Project (ZIP)</span>
              </button>
            </div>
          </div>

          {/* 1-Click Copy Cell Script */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>1-Cell Kaggle Runner</span>
              </div>
              <button
                onClick={handleCopyCell}
                className="px-2.5 py-1 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded flex items-center gap-1.5 transition-colors"
              >
                {copiedCell ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Create a new Kaggle notebook with <span className="text-neutral-200 font-mono">GPU T4 x2</span>, paste this code into the first cell, and hit <b>Shift + Enter</b>!
            </p>

            <div className="relative rounded-lg bg-neutral-950 border border-neutral-800/80 p-3 font-mono text-[11px] text-neutral-300 max-h-48 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{getSingleCellKaggleScript(config).slice(0, 480)}... [Full script includes all 8 plugins]</pre>
            </div>
          </div>

          {/* Kaggle Requirement Checklist */}
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 text-xs space-y-2">
            <div className="font-medium text-neutral-300">Kaggle Setup Checklist:</div>
            <ul className="space-y-1.5 text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Settings → Accelerator: <b>GPU T4 x2</b></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Settings → Internet: <b>Always ON</b></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Environment: Ubuntu 22.04 LTS (Python 3.10)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✔</span>
                <span>Background Execution: <b>Save & Run All (Commit)</b> gives up to 12 hours run</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
