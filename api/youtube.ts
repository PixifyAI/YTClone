// Note: Using 'any' for request and response types due to environment issues
// preventing the installation of '@vercel/node' type definitions.
// The function signature is compatible with Vercel's serverless function requirements.
export default async function handler(req: any, res: any) {
  const { channelName } = req.query;
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'YouTube API key is not configured.' });
  }

  if (!channelName || typeof channelName !== 'string') {
    return res.status(400).json({ error: 'channelName parameter is required.' });
  }

  try {
    // Step 1: Search for the channel by name to get its ID
    const channelSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(channelName)}&type=channel&maxResults=1&key=${apiKey}`;
    const channelSearchResponse = await fetch(channelSearchUrl);
    const channelSearchData = await channelSearchResponse.json();

    if (!channelSearchResponse.ok || !channelSearchData.items || channelSearchData.items.length === 0) {
      console.error('YouTube API Error (Channel Search):', channelSearchData);
      return res.status(404).json({ error: `Could not find channel: ${channelName}` });
    }

    const channelId = channelSearchData.items[0].id.channelId;

    // Step 2: Use the found channelId to get the latest videos
    const videoSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=5&key=${apiKey}`;
    const videoSearchResponse = await fetch(videoSearchUrl);
    const videoSearchData = await videoSearchResponse.json();

    if (!videoSearchResponse.ok) {
      console.error('YouTube API Error (Video Search):', videoSearchData);
      return res.status(videoSearchResponse.status).json({
        error: 'Failed to fetch videos for channel.',
        details: videoSearchData.error.message
      });
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    return res.status(200).json(videoSearchData);
  } catch (error: any) {
    console.error('Internal Server Error:', error);
    return res.status(500).json({ error: 'An internal server error occurred.', details: error.message });
  }
}
