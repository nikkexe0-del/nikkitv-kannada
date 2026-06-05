import { Channel } from '../types';
import { Play } from 'lucide-react';

interface ChannelCardProps {
  channel: Channel;
  onSelect: (channel: Channel) => void;
}

export default function ChannelCard({ channel, onSelect }: ChannelCardProps) {
  return (
    <button
      onClick={() => onSelect(channel)}
      className="group relative flex flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-900/50 p-4 text-left transition-all hover:bg-zinc-800 hover:ring-2 hover:ring-indigo-500/50"
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-zinc-950 p-4">
        <img
          src={channel.logo || 'https://via.placeholder.com/150/18181b/ffffff?text=No+Logo'}
          alt={channel.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150/18181b/ffffff?text=No+Logo';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/30">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col truncate">
        <span className="truncate font-sans text-sm font-medium text-zinc-100">
          {channel.name}
        </span>
        <span className="truncate font-mono text-xs text-zinc-500">
          {channel.category}
        </span>
      </div>
    </button>
  );
}
