/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { OneClickDeploy } from './components/OneClickDeploy';
import { DeployConfigurator } from './components/DeployConfigurator';
import { TelegramSimulator } from './components/TelegramSimulator';
import { CodebaseExplorer } from './components/CodebaseExplorer';
import { KaggleGuide } from './components/KaggleGuide';
import { SessionGeneratorModal } from './components/SessionGeneratorModal';
import { BotConfig } from './types';
import { getDefaultConfig } from './data/userbotCodebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'deploy' | 'config' | 'simulator' | 'codebase' | 'guide'>('deploy');
  const [config, setConfig] = useState<BotConfig>(getDefaultConfig());
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        config={config}
        onOpenSessionModal={() => setIsSessionModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'deploy' && (
          <OneClickDeploy
            config={config}
            setConfig={setConfig}
          />
        )}

        {activeTab === 'config' && (
          <DeployConfigurator
            config={config}
            setConfig={setConfig}
            onOpenSessionModal={() => setIsSessionModalOpen(true)}
            onLaunchSimulator={() => setActiveTab('simulator')}
          />
        )}

        {activeTab === 'simulator' && (
          <TelegramSimulator config={config} />
        )}

        {activeTab === 'codebase' && (
          <CodebaseExplorer config={config} />
        )}

        {activeTab === 'guide' && (
          <KaggleGuide />
        )}
      </main>

      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-neutral-400 font-medium">Kaggle Dual Tesla T4 Architecture</span>
            <span className="text-neutral-600">·</span>
            <span>PyTgCalls + Pyrogram v2</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-emerald-400 transition-colors"
            >
              Hardware Guide
            </button>
            <button
              onClick={() => setActiveTab('codebase')}
              className="hover:text-emerald-400 transition-colors"
            >
              Source Code
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="hover:text-emerald-400 transition-colors"
            >
              Interactive Simulator
            </button>
          </div>
        </div>
      </footer>

      <SessionGeneratorModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        apiId={config.apiId}
        apiHash={config.apiHash}
      />
    </div>
  );
}
