const axios = require("axios");

// 🔑 ta clé API ici
const API_KEY = "AIzaSyDse3U5_XSJmqcPW2XvVC0d7gFdcdEH7uo";

// 📅 date = maintenant - 30 jours
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

// ✅ convertir durée ISO8601 → secondes
function parseDuration(duration) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const parts = duration.match(regex);

  const hours = parseInt(parts[1] || 0);
  const minutes = parseInt(parts[2] || 0);
  const seconds = parseInt(parts[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

async function getShattaVideos() {
  try {
    // ✅ 1. Recherche des vidéos
    const searchRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: "Nken",
          type: "video",
          order: "date",
          maxResults: 20,
          publishedAfter: getDate30DaysAgo(),
          key: API_KEY
        }
      }
    );

    const videos = searchRes.data.items;

    // ✅ récupérer les IDs
    const ids = videos.map(v => v.id.videoId).join(",");

    // ✅ 2. Récupérer les durées
    const detailsRes = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "contentDetails",
          id: ids,
          key: API_KEY
        }
      }
    );

    const details = detailsRes.data.items;

    // ✅ créer un map id -> durée
    const durationMap = {};
    details.forEach(video => {
      durationMap[video.id] = parseDuration(
        video.contentDetails.duration
      );
    });

    // ✅ filtrer > 2 minutes
    const filteredVideos = videos.filter(video => {
      const duration = durationMap[video.id.videoId] || 0;
      return duration >= 120;
    });

    console.log("✅ Clips shatta (> 2 minutes) :\n");

    filteredVideos.forEach((video, index) => {
      const title = video.snippet.title;
      const channel = video.snippet.channelTitle;
      const date = video.snippet.publishedAt;
      const videoId = video.id.videoId;
      const duration = durationMap[videoId];

      console.log(`${index + 1}. ${title}`);
      console.log(`   Chaîne: ${channel}`);
      console.log(`   Date: ${date}`);
      console.log(`   Durée: ${Math.floor(duration / 60)}m ${duration % 60}s`);
      console.log(`   URL: https://www.youtube.com/watch?v=${videoId}\n`);
    });

  } catch (error) {
    console.error("❌ Erreur:", error.response?.data || error.message);
  }
}

// 🚀 exécution
getShattaVideos();
