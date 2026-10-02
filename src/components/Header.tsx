import React from 'react';
import { Download, Sparkles, Terminal, FileCode2 } from 'lucide-react';
import { BotConfig } from '../types';
import { downloadKaggleNotebook, downloadFullCodebaseZip } from '../utils/exportUtils';

interface HeaderProps {
  activeTab: 'deploy' | 'config' | 'simulator' | 'codebase' | 'guide';
  setActiveTab: (tab: 'deploy' | 'config' | 'simulator' | 'codebase' | 'guide') => void;
  config: BotConfig;
  onOpenSessionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  config,
  onOpenSessionModal
}) => {
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setActiveTab('deploy'); }}
            className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Kaggle Dual-T4 Userbot</span>
          </a>
          <span className="hidden sm:inline-flex text-xs font-mono text-neutral-400 border border-neutral-800 rounded px-1.5 py-0.5">
            2x Tesla T4 · NVENC
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
          <button
            onClick={() => setActiveTab('deploy')}
            className={`transition-colors hover:text-white ${
              activeTab === 'deploy' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
            }`}
          >
            1-Click Deploy & GitHub
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`transition-colors hover:text-white ${
              activeTab === 'config' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
            }`}
          >
            Credentials & Config
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`transition-colors hover:text-white ${
              activeTab === 'simulator' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
            }`}
          >
            Live Simulator
          </button>
          <button
            onClick={() => setActiveTab('codebase')}
            className={`transition-colors hover:text-white ${
              activeTab === 'codebase' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
            }`}
          >
            Codebase & Plugins
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`transition-colors hover:text-white ${
              activeTab === 'guide' ? 'text-emerald-400 border-b-2 border-emerald-400 pb-0.5' : ''
            }`}
          >
            Hardware Guide
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => downloadKaggleNotebook(config)}
            title="Download ready-to-run Kaggle Notebook (.ipynb)"
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-neutral-800 border border-neutral-700 rounded-lg hover:bg-neutral-700 hover:border-neutral-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>.ipynb</span>
          </button>

          <button
            onClick={() => downloadFullCodebaseZip(config)}
            title="Download complete zip package with all python files"
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-950 bg-emerald-400 font-semibold rounded-lg hover:bg-emerald-300 transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
          >
            <FileCode2 className="w-3.5 h-3.5 text-neutral-950" />
            <span>Download ZIP</span>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-neutral-800 py-2 bg-neutral-900/60 text-xs text-neutral-400">
        <button
          onClick={() => setActiveTab('deploy')}
          className={`px-2 py-1 ${activeTab === 'deploy' ? 'text-emerald-400 font-medium' : ''}`}
        >
          Deploy
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-2 py-1 ${activeTab === 'config' ? 'text-emerald-400 font-medium' : ''}`}
        >
          Config
        </button>
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-2 py-1 ${activeTab === 'simulator' ? 'text-emerald-400 font-medium' : ''}`}
        >
          Simulator
        </button>
        <button
          onClick={() => setActiveTab('codebase')}
          className={`px-2 py-1 ${activeTab === 'codebase' ? 'text-emerald-400 font-medium' : ''}`}
        >
          Codebase
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-2 py-1 ${activeTab === 'guide' ? 'text-emerald-400 font-medium' : ''}`}
        >
          Guide
        </button>
      </div>
    </header>
  );
};
