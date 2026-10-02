import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Key, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertTriangle,
  PlayCircle
} from 'lucide-react';

export const KaggleGuide: React.FC = () => {
  const [copiedBash, setCopiedBash] = useState(false);

  const copyBash = () => {
    navigator.clipboard.writeText(`!apt-get update -qq && apt-get install -y -qq ffmpeg\n!pip install -q pyrogram>=2.0.106 tgcrypto>=1.2.5 pytgcalls>=1.0.5 yt-dlp>=2024.08.06 aiohttp\n!python main.py`);
    setCopiedBash(true);
    setTimeout(() => setCopiedBash(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Intro */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Cpu className="w-4 h-4" />
          <span>KAGGLE CLOUD ARCHITECTURE GUIDE</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          How to Deploy on Kaggle with Dual Tesla T4 GPUs (32 GB VRAM)
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed">
          Kaggle offers 30+ hours of free Dual NVIDIA Tesla T4 GPU access per week. This guide explains how to properly configure the accelerator, manage secrets, and stream 1080p video with near-zero latency.
        </p>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-6">
        {/* Step 1 */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/20">
              1
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Create a New Notebook & Enable 2x T4 GPU</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Log in to <a href="https://kaggle.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">kaggle.com</a>, click <b>+ Create</b> → <b>New Notebook</b>.
              </p>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2 text-xs">
            <div className="font-semibold text-neutral-200">Critical Notebook Settings (Right Panel):</div>
            <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
              <li><b>Accelerator:</b> Change from None to <span className="text-emerald-400 font-mono font-bold">GPU T4 x2</span></li>
              <li><b>Internet:</b> Toggle <span className="text-emerald-400 font-mono font-bold">ON</span> (Required for Telegram MTProto and YouTube download)</li>
              <li><b>Language:</b> Python 3.10+ (Default)</li>
            </ul>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/20">
              2
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Secure Credentials with Kaggle Secrets (Optional but Recommended)</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                To keep your <code className="text-emerald-400">SESSION_STRING</code> and <code className="text-emerald-400">BOT_TOKEN</code> private even if your notebook is shared:
              </p>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 space-y-2 text-xs">
            <div className="text-neutral-300">In the top menu bar of Kaggle, click <b>Add-ons</b> → <b>Secrets</b>:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
                <span className="text-emerald-400">API_ID</span> = Your numeric API ID
              </div>
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
                <span className="text-emerald-400">API_HASH</span> = Your API Hash hex string
              </div>
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
                <span className="text-emerald-400">SESSION_STRING</span> = Pyrogram session string
              </div>
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300">
                <span className="text-emerald-400">BOT_TOKEN</span> = Token from @BotFather
              </div>
              <div className="p-2 bg-neutral-900 rounded border border-neutral-800 text-neutral-300 sm:col-span-2">
                <span className="text-emerald-400">OWNER_ID</span> = Your Telegram User ID
              </div>
            </div>
            <p className="text-neutral-500 text-[11px] pt-1">
              Our <code className="text-neutral-400">config.py</code> automatically detects Kaggle Secrets first, falling back to .env or in-code defaults.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/20">
              3
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Paste or Upload the Notebook</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Click <b>File</b> → <b>Upload Notebook</b> and select the generated <code className="text-emerald-400">kaggle_dual_t4_telegram_userbot.ipynb</code>, or copy the 1-cell script from our Deploy tab.
              </p>
            </div>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 flex items-center justify-between gap-4">
            <span className="text-xs text-neutral-400 font-mono">
              Cell runner: downloads packages, verifies 2x T4 GPUs, mounts PyTgCalls NVENC, and starts main.py.
            </span>
            <button
              onClick={copyBash}
              className="px-3 py-1.5 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-md flex items-center gap-1.5 shrink-0"
            >
              {copiedBash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedBash ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>
        </div>

        {/* Step 4: Keepalive & 12-Hour Run */}
        <div className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-500/20">
              4
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">Continuous Background Run (12 Hours)</h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Kaggle provides two execution modes: Interactive (which pauses after 40-60 minutes if the browser tab closes) and Background Commit (which runs up to 12 hours non-stop!).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg space-y-1.5">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <PlayCircle className="w-4 h-4 text-emerald-400" />
                <span>Interactive Mode</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Press <b>Run All</b>. Keeps running as long as your tab is open. Built-in HTTP server on port 8080 sends heartbeats to prevent container freezing.
              </p>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg space-y-1.5">
              <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Background Commit (Up to 12h)</span>
              </div>
              <p className="text-neutral-400 leading-relaxed">
                Click <b>Save Version</b> → Choose <b>Save & Run All (Commit)</b>. Kaggle spins up a dedicated background worker that runs for up to 12 hours even with your computer turned off!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
