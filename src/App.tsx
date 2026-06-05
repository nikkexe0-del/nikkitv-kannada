import { useEffect, useState } from 'react';
import { Search, Tv } from 'lucide-react';
import { Channel } from './types';
import ChannelCard from './components/ChannelCard';
import Player from './components/Player';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);

  useEffect(() => {
    async function fetchChannels() {
      try {
        const response = await fetch('/api/channels');
        if (!response.ok) {
          throw new Error('Failed to fetch channels');
        }
        const data = await response.json();
        setChannels(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load channels. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchChannels();
  }, []);

  // Sync URL state
  useEffect(() => {
    if (channels.length === 0) return;

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/id=')) {
        const id = path.substring(4);
        const channel = channels.find(c => c.id === id);
        if (channel) {
          setSelectedChannel(channel);
        } else {
          setSelectedChannel(null); // Not found
        }
      } else {
        setSelectedChannel(null);
      }
    };

    // Run on initial load and setup event listener
    handlePopState();
    window.addEventListener('popstate', handlePopState);
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, [channels]);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    window.history.pushState({}, '', `/id=${channel.id}`);
  };

  const handleClosePlayer = () => {
    setSelectedChannel(null);
    window.history.pushState({}, '', '/');
  };

  const currentIndex = selectedChannel ? channels.findIndex(c => c.id === selectedChannel.id) : -1;
  const hasNext = currentIndex >= 0 && currentIndex < channels.length - 1;
  const hasPrev = currentIndex > 0;

  const handleNext = () => {
    if (hasNext) handleSelectChannel(channels[currentIndex + 1]);
  };

  const handlePrev = () => {
    if (hasPrev) handleSelectChannel(channels[currentIndex - 1]);
  };

  // Update browser tab title based on player state
  useEffect(() => {
    if (selectedChannel) {
      document.title = `${selectedChannel.name} | nikkitv`;
    } else {
      document.title = 'nikkitv';
    }
  }, [selectedChannel]);

  const filteredChannels = channels.filter(channel => 
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 font-sans text-zinc-100 antialiased selection:bg-indigo-500/30">
      <main className="flex flex-1 flex-col">
        {selectedChannel ? (
          <Player 
            channel={selectedChannel} 
            onClose={handleClosePlayer} 
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        ) : (
          <>
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-zinc-800/50 bg-zinc-950/80 p-4 backdrop-blur-xl sm:px-8 sm:py-6">
              <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <Tv className="h-5 w-5" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                      nikkitv
                    </h1>
                  </div>

                  <div className="relative w-full sm:max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <Search className="h-4 w-4 text-zinc-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search channels or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-zinc-800 bg-zinc-900/50 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-8">
              {/* Welcome Bento Box */}
              <div className="mb-8 rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-indigo-400">Hello! 👋</h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  Welcome to <span className="font-medium text-white">nikkitv</span>. Feel free to explore the whole app—all channels and streams are completely available for you to watch and enjoy.
                </p>
              </div>

              {isLoading ? (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-indigo-500"></div>
                    <p className="font-mono text-sm text-zinc-500">Loading channels...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                    <p className="font-mono text-sm text-red-400">{error}</p>
                  </div>
                </div>
              ) : filteredChannels.length === 0 ? (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <p className="font-mono text-sm text-zinc-500">No channels found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 xl:gap-6">
                  {filteredChannels.map((channel) => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel} 
                      onSelect={handleSelectChannel} 
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-zinc-950 p-4 shrink-0 sm:px-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-zinc-400">
            Developed by <span className="font-medium text-zinc-200">Nikshep Doggalli</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500 sm:gap-6">
            <a 
              href="https://instagram.com/nikkk.exe" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:text-indigo-400"
            >
              Suggestions: @nikkk.exe
            </a>
            <span className="hidden sm:inline">&bull;</span>
            <a 
              href="https://zestyyflix.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="transition-colors hover:text-amber-400"
            >
              More at zestyyflix.vercel.app
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
