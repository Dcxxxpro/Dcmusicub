import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FolderTree, 
  Terminal, 
  Cpu, 
  Tv, 
  ShieldCheck,
  Search
} from 'lucide-react';
import { BotConfig, CodeFile } from '../types';
import { getUserbotCodebase } from '../data/userbotCodebase';
import { downloadFullCodebaseZip } from '../utils/exportUtils';

interface CodebaseExplorerProps {
  config: BotConfig;
}

export const CodebaseExplorer: React.FC<CodebaseExplorerProps> = ({ config }) => {
  const files = getUserbotCodebase(config);
  const [selectedFilePath, setSelectedFilePath] = useState<string>(files[0].path);
  const [copiedFile, setCopiedFile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentFile = files.find(f => f.path === selectedFilePath) || files[0];

  const handleCopyCurrentFile = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>Project File Hierarchy & Source Code</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Complete production-ready Python codebase with 2x NVIDIA T4 CUDA acceleration, PyTgCalls streaming, and companion inline keyboard bot.
          </p>
        </div>

        <button
          onClick={() => downloadFullCodebaseZip(config)}
          className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export All Files (.ZIP)</span>
        </button>
      </div>

      {/* Main Split View: File Sidebar & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: File Tree */}
        <div className="lg:col-span-1 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 space-y-3 flex flex-col h-[700px]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-950 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = file.path === currentFile.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                    isSelected 
                      ? 'bg-emerald-500/15 text-emerald-400 font-medium border border-emerald-500/30' 
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-neutral-300'}`} />
                    <span className="truncate font-mono">{file.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex justify-between">
            <span>{files.length} modules</span>
            <span>Python 3.10 · Pyrogram v2</span>
          </div>
        </div>

        {/* Right 3 Cols: Code Viewer & Architectural Explanation */}
        <div className="lg:col-span-3 bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[700px]">
          {/* Header of code viewer */}
          <div className="bg-neutral-900 border-b border-neutral-800 px-5 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">{currentFile.path}</span>
                <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded">
                  {currentFile.language}
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate mt-0.5">{currentFile.description}</p>
            </div>

            <button
              onClick={handleCopyCurrentFile}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors shrink-0"
            >
              {copiedFile ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          {/* Code content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-300 leading-relaxed bg-neutral-950">
            <pre className="whitespace-pre">
              {currentFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row">
                  <span className="table-cell pr-4 text-neutral-600 select-none text-right w-10 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
