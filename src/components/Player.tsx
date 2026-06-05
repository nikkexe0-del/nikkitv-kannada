import { Channel } from '../types';
import { ArrowLeft, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PlayerProps {
  channel: Channel;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export default function Player({ channel, onClose, onPrev, onNext, hasPrev, hasNext }: PlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  
  const iframeSrc = `https://joplay.lrl45.workers.dev/${channel.id}`;

  const toggleFullscreen = () => {
    const playerElement = document.getElementById('video-player-container');
    if (!playerElement) return;

    if (!document.fullscreenElement) {
      playerElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col bg-zinc-950">
      {/* Header */}
      {!isFullscreen && (
        <div className="flex items-center justify-between shrink-0 border-b border-zinc-800 bg-zinc-900/80 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex flex-col">
              <h2 className="font-sans text-lg font-semibold text-zinc-100">{channel.name}</h2>
              <span className="font-mono text-xs text-zinc-400">{channel.category}</span>
            </div>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div 
        id="video-player-container" 
        className="group relative flex flex-1 items-center justify-center bg-black min-h-[40vh] sm:min-h-0"
      >
        <iframe
          src={iframeSrc}
          className="absolute inset-0 h-full w-full border-none outline-none"
          allow="autoplay; fullscreen; encrypted-media"
          allowFullScreen
        ></iframe>
        
        {/* NIKSHEP Watermark */}
        <div
          className="pointer-events-none absolute top-3 right-3 z-40 select-none"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: '0.85rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.72)',
            background: 'rgba(0,0,0,0.32)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            padding: '4px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          NIKSHEP
        </div>

        {/* Warning Bento Box */}
        {showWarning && !isFullscreen && (
          <div className="absolute left-1/2 top-4 z-50 w-[90%] max-w-sm -translate-x-1/2 rounded-2xl border border-zinc-700/50 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-sans font-semibold text-amber-500">Notice</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                  Use Chrome and don't click on the player as it is full of redirects.
                </p>
              </div>
              <button
                onClick={() => setShowWarning(false)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-white"
                aria-label="Close warning"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Fullscreen Toggle Overlay (Shows on Hover) */}
        {!isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="absolute bottom-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-black/80"
            title="Fullscreen"
          >
            <Maximize2 className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Player Footer Controls */}
      {!isFullscreen && (
        <div className="flex items-center justify-between shrink-0 border-t border-zinc-800 bg-zinc-900/80 px-4 py-3 sm:px-6">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700 disabled:pointer-events-none disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
