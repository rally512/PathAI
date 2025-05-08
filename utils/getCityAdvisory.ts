// utils/getCityAdvisory.ts

import { OPENAI_API_KEY, GNEWS_API_KEY } from '../config';

export type AdvisoryLevel = 1 | 2 | 3 | 4 | 5;

export interface CityAdvisory {
  level: AdvisoryLevel;
  summary: string;
  source: string;
}

const queryVariants = (city: string) => [
  `"${city}" travel warning`,
  `"${city}" safety alert`,
  `"${city}" crime OR violence`,
  `"${city}" danger OR cartel`,
  `"${city}" unrest OR protests`,
  `"${city}" travel news`,
  `"${city}"`,
];

export async function getCityAdvisory(city: string): Promise<CityAdvisory> {
  let articles: any[] = [];

  for (const query of queryVariants(city)) {
    const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&token=${GNEWS_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.articles?.length) {
        console.log(`📰 GNews matched on: "${query}"`);
        articles = data.articles;
        break;
      }
    } catch (err) {
      console.warn(`⚠️ GNews fetch failed for query "${query}":`, err);
    }
  }

  // Use OpenAI if we found articles
  if (articles.length > 0) {
    const headlines = articles.slice(0, 5).map((a, i) =>
      `${i + 1}. ${a.title}${a.description ? ' - ' + a.description : ''}`
    ).join('\n');

    const prompt = `You are a U.S.-based travel risk analyst. Based on the following headlines, rate the overall travel safety risk for ${city} from 1 (Very Safe) to 5 (Extremely Dangerous). Start your reply with: "Safety Rating: X (Descriptor)" on the first line, followed by a 4–5 sentence U.S.-focused travel summary that avoids outdated events like COVID-19 unless still active.\n\n${headlines}`;

    try {
      const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        }),
      });

      const json = await aiResponse.json();
      console.log('🛰️ Full AI response:', JSON.stringify(json, null, 2));

      const content = json.choices?.[0]?.message?.content?.trim();

      if (content) {
        const ratingMatch = content.match(/Safety Rating:\s*(\d)/i);
        const level = ratingMatch ? Math.min(Math.max(parseInt(ratingMatch[1]), 1), 5) : 3;
        const summary = content.replace(/Safety Rating:.*\n*/i, '').trim();

        return {
          level: level as AdvisoryLevel,
          summary,
          source: 'GNews + OpenAI',
        };
      }
    } catch (err) {
      console.error('❌ OpenAI failed to process headlines:', err);
    }
  }

  // Fallback if GNews failed or had no useful data
  const fallbackPrompt = `Write a U.S.-focused travel safety summary for ${city}, clearly stating if it's safe or has risks. Avoid COVID, terrorism references unless currently active. Start with "Safety Rating: X (Descriptor)" and follow with 4–5 sentences.`;

  try {
    const fallbackResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: fallbackPrompt }],
        temperature: 0.7,
      }),
    });

    const fallbackJson = await fallbackResponse.json();
    console.log('🛰️ Fallback AI response:', JSON.stringify(fallbackJson, null, 2));

    const content = fallbackJson.choices?.[0]?.message?.content?.trim();
    const match = content?.match(/Safety Rating:\s*(\d)/i);
    const level = match ? Math.min(Math.max(parseInt(match[1]), 1), 5) : 3;
    const summary = content?.replace(/Safety Rating:.*\n*/i, '').trim();

    return {
      level: level as AdvisoryLevel,
      summary: summary || 'No recent news found. Use normal precautions.',
      source: 'OpenAI (fallback)',
    };
  } catch (error) {
    console.error('❌ Final fallback AI call failed:', error);
    return {
      level: 3,
      summary: 'No recent news found for this location. Use normal precautions.',
      source: 'OpenAI (last-resort)',
    };
  }
}
