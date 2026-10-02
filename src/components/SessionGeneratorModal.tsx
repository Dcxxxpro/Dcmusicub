import React, { useState } from 'react';
import { X, Copy, Check, Terminal, ShieldCheck, Key } from 'lucide-react';

interface SessionGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiId: string;
  apiHash: string;
}

export const SessionGeneratorModal: React.FC<SessionGeneratorModalProps> = ({
  isOpen,
  onClose,
  apiId,
  apiHash,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const pythonScript = `pip install pyrogram tgcrypto

python -c '
import asyncio
from pyrogram import Client

api_id = ${apiId || 'int(input("Enter API_ID: "))'}
api_hash = "${apiHash || 'input(\\"Enter API_HASH: \\")'}"

async def main():
    async with Client("session_generator", api_id=api_id, api_hash=api_hash, in_memory=True) as app:
        session = await app.export_session_string()
        print("\\n\\n================ YOUR PYROGRAM STRING SESSION ================\\n")
        print(session)
        print("\\n=============================================================\\n")

asyncio.run(main())
'`;

  const copyScript = () => {
    navigator.clipboard.writeText(pythonScript);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-white font-semibold text-base">
            <Key className="w-4 h-4 text-emerald-400" />
            <span>How to Generate a Pyrogram String Session</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          A String Session allows the Telegram Userbot to log into your account securely without saving session files to disk. You can generate it locally in 10 seconds with Python or inside any terminal (Termux / Linux / Mac / Windows / Repl.it).
        </p>

        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-neutral-400">Terminal Command:</span>
            <button
              onClick={copyScript}
              className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          <pre className="text-xs font-mono text-emerald-400/90 whitespace-pre-wrap overflow-x-auto p-2 bg-neutral-900/60 rounded border border-neutral-800/80">
            {pythonScript}
          </pre>
        </div>

        <div className="text-xs text-neutral-400 space-y-1.5">
          <div className="font-medium text-neutral-200">Steps:</div>
          <ol className="list-decimal list-inside space-y-1 text-neutral-400">
            <li>Run the command above in your terminal or on a temporary Repl / Kaggle cell.</li>
            <li>Telegram will send you an official login code to your Telegram app.</li>
            <li>Enter your code (and two-factor password if enabled).</li>
            <li>Copy the generated string starting with <code className="text-emerald-400">BQFNJ...</code> and paste it into the <b>SESSION_STRING</b> input field!</li>
          </ol>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
          >
            I Have My Session String
          </button>
        </div>
      </div>
    </div>
  );
};
