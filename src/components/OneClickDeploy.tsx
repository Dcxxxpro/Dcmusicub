import React, { useState } from 'react';
import { 
  Rocket, 
  Github, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Cpu, 
  ShieldCheck, 
  FileCode2,
  Sparkles,
  ArrowRight,
  Layers,
  Flame,
  Key,
  Info,
  Smartphone,
  ClipboardPaste
} from 'lucide-react';
import { BotConfig } from '../types';
import { downloadKaggleNotebook, downloadFullCodebaseZip, getSingleCellKaggleScript } from '../utils/exportUtils';

interface OneClickDeployProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
}

export const OneClickDeploy: React.FC<OneClickDeployProps> = ({ config, setConfig }) => {
  const [copiedCell, setCopiedCell] = useState(false);
  const [copiedGitCmd, setCopiedGitCmd] = useState(false);
  const [copiedKaggleClone, setCopiedKaggleClone] = useState(false);
  const [rawEnvText, setRawEnvText] = useState('');
  const [envParseSuccess, setEnvParseSuccess] = useState(false);
  const [showRawPaste, setShowRawPaste] = useState(false);

  const ghUser = config.githubUsername.trim() || 'YOUR_GITHUB_USERNAME';
  const ghRepo = config.githubRepoName.trim() || 'telegram-dual-t4-userbot';

  const hasCredentials = Boolean(config.apiId && config.apiHash && (config.sessionString || config.botToken));
  const hasSession = Boolean(config.sessionString && config.sessionString.length > 20);

  const gitPushCommand = `# 1. Extract downloaded ZIP or initialize inside project folder
git init -b main
git add .
git commit -m "feat: initialize Kaggle Dual-T4 Telegram userbot with PyTgCalls NVENC"

# 2. Link your GitHub repository and push
git remote add origin https://github.com/${ghUser}/${ghRepo}.git
git push -u origin main`;

  const kaggleCloneScript = `!git clone https://github.com/${ghUser}/${ghRepo}.git userbot && cd userbot && bash setup.sh && python main.py`;

  const handleCopyCell = () => {
    navigator.clipboard.writeText(getSingleCellKaggleScript(config));
    setCopiedCell(true);
    setTimeout(() => setCopiedCell(false), 2200);
  };

  const handleCopyGit = () => {
    navigator.clipboard.writeText(gitPushCommand);
    setCopiedGitCmd(true);
    setTimeout(() => setCopiedGitCmd(false), 2200);
  };

  const handleCopyKaggleClone = () => {
    navigator.clipboard.writeText(kaggleCloneScript);
    setCopiedKaggleClone(true);
    setTimeout(() => setCopiedKaggleClone(false), 2200);
  };

  // Helper to parse bulk pasted env/config variables
  const handleParseRawEnv = () => {
    if (!rawEnvText.trim()) return;

    const newConfig = { ...config };
    const lines = rawEnvText.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;

      const equalIdx = trimmed.indexOf('=');
      if (equalIdx === -1) return;

      const key = trimmed.slice(0, equalIdx).trim().toUpperCase();
      let val = trimmed.slice(equalIdx + 1).trim();
      // Remove enclosing quotes
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      if (key === 'API_ID') newConfig.apiId = val;
      if (key === 'API_HASH') newConfig.apiHash = val;
      if (key === 'SESSION_STRING' || key === 'STRING_SESSION') newConfig.sessionString = val;
      if (key === 'BOT_TOKEN') newConfig.botToken = val;
      if (key === 'OWNER_ID') newConfig.ownerId = val;
      if (key === 'SUDO_USERS') newConfig.sudoUsers = val;
    });

    setConfig(newConfig);
    setEnvParseSuccess(true);
    setTimeout(() => setEnvParseSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 mb-2">
              <Rocket className="w-3.5 h-3.5" />
              <span>1-CLICK DEPLOYMENT & GITHUB REPO SUITE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Deploy to Kaggle & Publish to GitHub
            </h1>
            <p className="mt-2 text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Deploy in Kaggle with 2x NVIDIA Tesla T4 GPU acceleration in 60 seconds, or push the entire codebase to your GitHub repository with customized configuration.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://www.kaggle.com/code/new"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <Rocket className="w-4 h-4" />
              <span>Open Kaggle Notebook</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Login Explanation Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5 text-white font-semibold text-base">
            <Key className="w-4.5 h-4.5 text-emerald-400" />
            <span>How Your Userbot Logs In (Two Easy Methods)</span>
          </div>

          <div className="text-xs font-mono">
            {hasSession ? (
              <span className="text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                ✔ Session String Embedded (Instant 1-Click Login)
              </span>
            ) : (
              <span className="text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-0.5 rounded">
                ⚡ Interactive Phone Login in Kaggle (No Prior Setup Required)
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          {/* Method 1: Interactive Phone Number Login */}
          <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-200">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Method 1: Interactive Phone Login in Kaggle (Zero Setup)</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              If you haven't entered credentials below, that's completely fine! When you run the 1-click script in Kaggle, Pyrogram will simply prompt:
            </p>
            <div className="bg-neutral-900 p-2.5 rounded font-mono text-[11px] text-emerald-300 border border-neutral-800">
              Enter phone number (with country code): +123456789<br/>
              Enter confirmation code: 12345
            </div>
            <p className="text-neutral-500 text-[11px]">
              Once you enter the code, you are logged in. The bot will automatically print your Session String and assign your Telegram ID as master Owner.
            </p>
          </div>

          {/* Method 2: Paste Credentials Here */}
          <div className="bg-neutral-950 border border-neutral-800/80 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2 font-semibold text-neutral-200">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Method 2: Paste Credentials Below (Pre-Configured)</span>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Paste your variables in the inputs below (or use the Bulk Paste box). The 1-click runner code automatically embeds your values, so Kaggle boots directly with zero prompts!
            </p>
            <button
              onClick={() => setShowRawPaste(!showRawPaste)}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-medium flex items-center gap-1 pt-1"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>{showRawPaste ? 'Hide Bulk Paste Box' : 'Quick Paste All Variables at Once (.env style)'}</span>
            </button>
          </div>
        </div>

        {/* Bulk Paste Box (Collapsible) */}
        {showRawPaste && (
          <div className="pt-3 border-t border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Paste your variables block:</span>
              <button
                onClick={handleParseRawEnv}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold rounded text-xs transition-colors"
              >
                {envParseSuccess ? '✔ Applied to Config!' : 'Parse & Apply to Config'}
              </button>
            </div>
            <textarea
              rows={4}
              placeholder={`API_ID=2040123\nAPI_HASH=b4a1b0239cf2e88a09b43491efc02341\nSESSION_STRING=BQFNJ...\nBOT_TOKEN=7123456789:AAHq_...\nOWNER_ID=123456789`}
              value={rawEnvText}
              onChange={(e) => setRawEnvText(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        )}

        {/* Live Variable Inputs (Direct on this tab) */}
        <div className="pt-3 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1 font-medium">API_ID</label>
            <input
              type="text"
              placeholder="e.g. 2040123"
              value={config.apiId}
              onChange={(e) => setConfig({ ...config, apiId: e.target.value })}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">API_HASH</label>
            <input
              type="text"
              placeholder="e.g. b4a1b0239cf2e88a09b43491efc02341"
              value={config.apiHash}
              onChange={(e) => setConfig({ ...config, apiHash: e.target.value })}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">BOT_TOKEN (from @BotFather)</label>
            <input
              type="text"
              placeholder="7123456789:AAHq_..."
              value={config.botToken}
              onChange={(e) => setConfig({ ...config, botToken: e.target.value })}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-neutral-400 mb-1 font-medium">
              SESSION_STRING (Leave empty for interactive Kaggle login)
            </label>
            <input
              type="text"
              placeholder="BQFNJ... (optional)"
              value={config.sessionString}
              onChange={(e) => setConfig({ ...config, sessionString: e.target.value })}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500 truncate"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-medium">OWNER_ID (Auto-detected if empty)</label>
            <input
              type="text"
              placeholder="e.g. 123456789"
              value={config.ownerId}
              onChange={(e) => setConfig({ ...config, ownerId: e.target.value })}
              className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* GitHub Repository Personalization Bar */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Github className="w-4 h-4 text-emerald-400" />
            <span>GitHub Repository Settings</span>
          </div>
          <span className="text-xs text-neutral-500">Auto-updates all Git scripts and README badges below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">Your GitHub Username</label>
            <input
              type="text"
              placeholder="e.g. torvalds or your-username"
              value={config.githubUsername}
              onChange={(e) => setConfig({ ...config, githubUsername: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-neutral-400 mb-1.5 font-medium">Repository Name</label>
            <input
              type="text"
              placeholder="telegram-dual-t4-userbot"
              value={config.githubRepoName}
              onChange={(e) => setConfig({ ...config, githubRepoName: e.target.value })}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2 Main Deployment Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method 1: The Fastest 1-Cell Kaggle Runner */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-base font-bold text-white">Instant 1-Cell Kaggle Runner</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
                ⚡ Fastest Method
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              No Git commands needed. This single Python cell downloads dependencies, tests both Tesla T4 GPUs, installs FFmpeg with NVENC, extracts all plugins, and starts your userbot immediately.
            </p>

            {/* Instruction Steps */}
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3 text-xs space-y-2">
              <div className="text-neutral-300 font-medium">3-Step Execution:</div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-400 text-[11px]">
                <li>Click <b>Open Kaggle Notebook</b> (or go to <a href="https://kaggle.com/code/new" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">kaggle.com/code/new</a>).</li>
                <li>In Kaggle right sidebar: Select <b>GPU T4 x2</b> & toggle <b>Internet ON</b>.</li>
                <li>Copy the runner below, paste into Cell 1, and press <b>Shift + Enter</b>!</li>
              </ol>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleCopyCell}
              className="w-full py-2.5 px-4 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {copiedCell ? (
                <>
                  <Check className="w-4 h-4 text-neutral-950" />
                  <span>Copied 1-Cell Runner Script!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy 1-Cell Runner Script</span>
                </>
              )}
            </button>

            <button
              onClick={() => downloadKaggleNotebook(config)}
              className="w-full py-2 px-4 text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Or Download kaggle_notebook.ipynb file</span>
            </button>
          </div>
        </div>

        {/* Method 2: Push to GitHub & Clone in Kaggle */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-md bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-base font-bold text-white">Upload to GitHub & 1-Line Clone</h3>
              </div>
              <span className="text-[11px] font-mono text-sky-400 bg-sky-950/80 border border-sky-800/60 px-2 py-0.5 rounded">
                Full Repository
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Publish your complete codebase to GitHub with complete <code>.gitignore</code>, <code>README.md</code> with "Open in Kaggle" badges, and modular plugins.
            </p>

            {/* Quick Git Terminal Code */}
            <div className="bg-neutral-950 border border-neutral-800/80 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300 font-mono text-[11px]">Push Commands:</span>
                <button
                  onClick={handleCopyGit}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedGitCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedGitCmd ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-neutral-300 whitespace-pre-wrap bg-neutral-900/60 p-2 rounded border border-neutral-800/70 overflow-x-auto">
                {gitPushCommand}
              </pre>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => downloadFullCodebaseZip(config)}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Ready-to-Push GitHub Repo (.ZIP)</span>
            </button>

            {/* 1-Line Kaggle Clone */}
            <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="truncate font-mono text-[11px] text-neutral-400">
                {kaggleCloneScript}
              </div>
              <button
                onClick={handleCopyKaggleClone}
                className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-white rounded shrink-0 border border-neutral-700 flex items-center gap-1"
              >
                {copiedKaggleClone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKaggleClone ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Kaggle 12-Hour Anti-Idle Run Strategy */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2 text-white font-semibold text-sm">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>How to Keep the Userbot Running for 12 Hours Non-Stop in Kaggle</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg space-y-1.5">
            <div className="text-neutral-200 font-semibold">1. Use "Save & Run All (Commit)"</div>
            <p className="text-neutral-400 leading-relaxed">
              Do not leave only the interactive tab open. In Kaggle, click <b>Save Version</b> → select <b>Save & Run All (Commit)</b>. This runs your userbot in an isolated 12-hour container even after you close your computer.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg space-y-1.5">
            <div className="text-neutral-200 font-semibold">2. Built-in Keepalive Server</div>
            <p className="text-neutral-400 leading-relaxed">
              Our <code>main.py</code> starts an HTTP keepalive daemon on port 8080 that prevents Kaggle's container sleep detector from terminating the process.
            </p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-lg space-y-1.5">
            <div className="text-neutral-200 font-semibold">3. Fast Auto-Restart</div>
            <p className="text-neutral-400 leading-relaxed">
              If Kaggle's 12-hour maximum runtime completes, simply click <b>Run</b> again, or schedule a daily commit to refresh the session instantly!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
