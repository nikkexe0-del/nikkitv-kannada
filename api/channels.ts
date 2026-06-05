import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_CHANNELS = [
  'Suvarna HD',
  'Suvarna',
  'Suvarna Plus',
  'TV9 Karnataka',
  'Zee Kannada',
  'Zee Kannada HD',
  'Public TV',
  'Colors Kannada HD',
  'Colors Kannada SD',
  'Colors Super',
  'Star Sports 1 Kannada',
  'Star Sports 1 HD',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/babumani1/jiotv2/refs/heads/main/primary.json',
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch channels' });
    }

    const raw = await response.json();

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
          (allowed) => ch.name.trim().toLowerCase() === allowed.toLowerCase()
        )
      );

    res.setHeader('Cache-Control', 's-maxage=300');
    res.json(data);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
}
