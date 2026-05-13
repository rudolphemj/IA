const express = require("express");
const axios = require("axios");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// 🔑 Mets TA vraie clé API ici
const API_KEY = "TA_CLE_API";

// 📁 Dossier download
const DOWNLOAD_DIR = path.join(__dirname, "downloads");
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

// 📌 Sert ton frontend
app.use(express.static("public"));


// ✅ Fonction date -30 jours
function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split(".")[0] + "Z";
}


// ✅ API vidéos YouTube

