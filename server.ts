import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import https from 'https';
import http from 'http';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy the channels JSON
  app.get('/api/channels', async (req, res) => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/babumani1/jiotv2/refs/heads/main/primary.json', {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch channels' });
      }
      
      const raw = await response.json();

      const ALLOWED_CHANNELS = [
        'SUVARNA HD',
        'TV9 KANNADA',
        'ZEE KANNADA',
        'PUBLIC TV',
        'COLORS KANNADA HD',
        'COLORS SUPER',
        'SUVARNA PLUS',
        'SUVARNA',
        'ZEE KANNADA HD',
        'STAR SPORTS 1 KANNADA',
        'STAR SPORTS 1 HD',
      ];

      // Remap new JSON shape to the app's Channel shape
      const data = raw
        .map((ch: any) => ({
          id: ch.id,
          name: ch.name,
          logo: ch.logo,
          category: ch.group,
          status: ch.status,
        }))
        .filter((ch: any) =>
          ALLOWED_CHANNELS.some(
            allowed => ch.name.trim().toUpperCase() === allowed.toUpperCase()
          )
        );
      res.json(data);
    } catch (error) {
      console.error('Error fetching channels:', error);
      res.status(500).json({ error: 'Failed to fetch channels' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // For Express 4.x
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
