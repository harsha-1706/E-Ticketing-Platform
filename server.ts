import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getTerminalMapsGrounding } from './src/server/geminiMaps.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API route for Maps Grounding using gemini-3.5-flash with googleMaps tool
app.post('/api/terminal-maps', async (req, res) => {
  try {
    const { terminalName, cityName, userLatLng } = req.body;
    if (!terminalName) {
      return res.status(400).json({ error: 'terminalName is required' });
    }

    const result = await getTerminalMapsGrounding(
      terminalName,
      cityName || 'India',
      userLatLng
    );

    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/terminal-maps:', err);
    return res.status(500).json({
      error: err.message || 'Internal Server Error',
    });
  }
});

// Static assets from built frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
