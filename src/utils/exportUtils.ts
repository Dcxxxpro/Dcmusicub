import JSZip from 'jszip';
import { BotConfig } from '../types';
import { getUserbotCodebase, getKaggleNotebookJson } from '../data/userbotCodebase';

export const downloadKaggleNotebook = (config: BotConfig) => {
  const jsonContent = getKaggleNotebookJson(config);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kaggle_dual_t4_telegram_userbot.ipynb';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadFullCodebaseZip = async (config: BotConfig) => {
  const zip = new JSZip();
  const files = getUserbotCodebase(config);

  // Add individual files
  files.forEach(file => {
    zip.file(file.path, file.content);
  });

  // Add .env example
  const envContent = [
    `# Telegram Userbot Credentials`,
    `API_ID=${config.apiId || 'YOUR_API_ID'}`,
    `API_HASH=${config.apiHash || 'YOUR_API_HASH'}`,
    `SESSION_STRING=${config.sessionString || 'YOUR_SESSION_STRING'}`,
    `BOT_TOKEN=${config.botToken || 'YOUR_BOT_TOKEN'}`,
    `OWNER_ID=${config.ownerId || '123456789'}`,
    `SUDO_USERS=${config.sudoUsers || ''}`,
    `STREAM_QUALITY=${config.streamQuality}`,
    `ENABLE_DUAL_GPU=${config.enableDualGpu ? 'True' : 'False'}`,
    `PORT=${config.keepAlivePort}`
  ].join('\n');
  zip.file('.env.example', envContent);

  // Add the ready notebook inside zip as well
  zip.file('kaggle_notebook.ipynb', getKaggleNotebookJson(config));

  // Add README.md
  const readmeContent = [
    `# Kaggle 2x Tesla T4 Telegram Userbot Engine`,
    ``,
    `Production-grade Telegram Userbot engineered for deployment on Kaggle's dual NVIDIA Tesla T4 GPU cloud instances.`,
    ``,
    `## Features`,
    `- **Dual Tesla T4 Acceleration**: GPU 0 for PyTgCalls 1080p/720p NVENC video transcoding, GPU 1 for yt-dlp remuxing & Whisper AI.`,
    `- **YouTube Voice Chat Video/Audio Player**: Stream video & high-bitrate audio directly into Telegram Voice Chats with live queue & volume.`,
    `- **Interactive Inline Buttons**: Companion bot handler providing interactive playback buttons, volume controls, GPU telemetry monitors, and admin panels.`,
    `- **Sudo Access & Security**: Full execution control from your main ID (.sh, .eval, .addsudo, .sudolist, .restart).`,
    `- **Anti-Idle Keepalive**: Built-in HTTP server prevents Kaggle background timeout.`,
    ``,
    `## Deployment Instructions in Kaggle`,
    `1. Go to kaggle.com -> Create New Notebook.`,
    `2. In the right sidebar:`,
    `   - Accelerator: Select **GPU T4 x2**`,
    `   - Internet: Toggle **On**`,
    `3. Upload or paste the code into notebook cells, or upload kaggle_notebook.ipynb directly!`,
    `4. Run all cells.`
  ].join('\n');
  zip.file('README.md', readmeContent);

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kaggle_dual_t4_telegram_userbot.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const getSingleCellKaggleScript = (config: BotConfig): string => {
  const files = getUserbotCodebase(config);
  const bashScript = [
    `# ==============================================================================`,
    `# 🚀 KAGGLE 2X T4 TELEGRAM USERBOT: 1-CLICK COPY-PASTE NOTEBOOK CELL`,
    `# Prerequisites: Accelerator = 'GPU T4 x2', Internet = ON`,
    `# ==============================================================================`,
    `import os, sys, subprocess`,
    ``,
    `print("⚡ Step 1: Checking Dual Tesla T4 GPUs...")`,
    `subprocess.run(["nvidia-smi"])`,
    ``,
    `print("⚡ Step 2: Installing Dependencies & FFmpeg...")`,
    `subprocess.run(["apt-get", "update", "-qq"])`,
    `subprocess.run(["apt-get", "install", "-y", "-qq", "ffmpeg", "curl"])`,
    `subprocess.run([sys.executable, "-m", "pip", "install", "-q", "pyrogram>=2.0.106", "tgcrypto>=1.2.5", "pytgcalls==1.0.5", "yt-dlp>=2024.08.06", "aiohttp>=3.9.5", "psutil"])`,
    ``,
    `print("⚡ Step 3: Writing Userbot Source Code Files...")`,
  ];

  files.forEach(f => {
    bashScript.push(`os.makedirs(os.path.dirname("${f.path}") or ".", exist_ok=True)`);
    // Escape string for raw python multiline
    const escaped = f.content.replace(/\\/g, '\\\\').replace(/'''/g, "\\'\\'\\'");
    bashScript.push(`with open("${f.path}", "w") as f:\n    f.write('''${escaped}''')`);
  });

  bashScript.push(`print("⚡ Step 4: Starting Dual-T4 Userbot & PyTgCalls...")`);
  bashScript.push(`subprocess.run([sys.executable, "main.py"])`);

  return bashScript.join('\n');
};
