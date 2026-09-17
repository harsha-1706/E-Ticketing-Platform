import { GoogleGenAI } from '@google/genai';

export interface MapsGroundingResult {
  text: string;
  groundingChunks: any[];
}

export async function getTerminalMapsGrounding(
  terminalName: string,
  cityName: string,
  userLatLng?: { latitude: number; longitude: number }
): Promise<MapsGroundingResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Provide practical, real-time traveler guidance for passengers departing or arriving at "${terminalName}" in ${cityName}.
Include:
1. Exact location, key landmarks, and approach roads
2. Passenger waiting areas, amenities, ticket bays, and restrooms
3. Local transit connectivity (metro station connections, local bus bays, auto/cab pickup points)
4. Recommended passenger arrival buffer time and tips.`;

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (userLatLng && userLatLng.latitude && userLatLng.longitude) {
    config.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: userLatLng.latitude,
          longitude: userLatLng.longitude,
        },
      },
    };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: prompt,
    config,
  });

  const text = response.text || 'No information returned.';
  const groundingChunks =
    response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  return {
    text,
    groundingChunks,
  };
}
