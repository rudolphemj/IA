const axios = require("axios");

// 🔑 ta clé API ici
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

// 📅 date = maintenant - 30 jours
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

async function getShattaVideos() {
  const url = "https://www.googleapis.com/youtube/v3/search";

  try {
    const response = await axios.get(url, {
      params: {
        part: "snippet",
        q: "shatta clip officiel",
        type: "video",
	videoCategoryId: "10", 
        order: "date",
        maxResults: 20,
        publishedAfter: getDate30DaysAgo(),
        key: API_KEY
      }
    });

    const videos = response.data.items;

    console.log("✅ Nouveaux clips shatta (30 derniers jours):\n");

    videos.forEach((video, index) => {
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const date = video.snippet.publishedAt;
      const videoId = video.id.videoId;

      console.log(`${index + 1}. ${title}`);
      console.log(`   Chaîne: ${channel}`);
      console.log(`   Date: ${date}`);
      console.log(`   URL: https://www.youtube.com/watch?v=${videoId}\n`);
    });

  } catch (error) {
    console.error("❌ Erreur:", error.response?.data || error.message);
  }
}

getShattaVideos();
