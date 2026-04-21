// ===== ÉTAT GLOBAL =====
let phases = [];
let currentPhaseIndex = 0;
let remainingSeconds = 0;
let timerInterval = null;
let isPaused = false;

// ===== DOM =====
const stageEl = document.getElementById("stage");
const timerEl = document.getElementById("timer");
const offerEl = document.getElementById("offer");
const tCompanyEl = document.getElementById("tCompany");
const tCandidateEl = document.getElementById("tCandidate");
const tQuestionsEl = document.getElementById("tQuestions");

// ===== VOIX =====
function speak(text) {
  if (!text) return;
  speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 1;
  u.pitch = 1;

  speechSynthesis.speak(u);
}

// ===== TEXTES IA =====
function getPhaseAnnouncement(name) {
  if (name === "Présentation entreprise")
    return "La présentation de l’entreprise commence.";
  if (name === "Présentation candidat")
    return "Merci. Vous pouvez maintenant vous présenter.";
  if (name === "Questions")
    return "Nous passons maintenant à la phase de questions.";
  return "";
}

function generateCompanyPresentation(offerText) {
  return `
Bonjour et bienvenue.

Merci de participer à cet entretien.

Avant de commencer, je vais vous dire quelques mots sur l’entreprise
et le contexte de ce recrutement.

L’entreprise évolue dans un environnement dynamique, où l’innovation,
la collaboration et la recherche de performance occupent une place importante.

Aujourd’hui, elle renforce ses équipes afin d’accompagner son développement
et de répondre à de nouveaux enjeux organisationnels et métier.

À ce poste, l’objectif n’est pas seulement de maîtriser des compétences techniques,
mais aussi de s’inscrire dans une équipe, de faire preuve d’autonomie,
de capacité d’adaptation et d’engagement.

Nous attendons avant tout une personne motivée,
curieuse, et capable de comprendre les enjeux globaux de l’entreprise
au-delà de la simple description du poste.

Nous allons maintenant vous laisser vous présenter.
`;
}

function generateCompanyPresentationDynamic(companyName, infoSnippet) {
  return `
Avant de commencer cet entretien, quelques mots sur l’entreprise.

${companyName} est une organisation reconnue dans son domaine.
${infoSnippet}

L’entreprise évolue aujourd’hui dans un contexte de transformation
et cherche à renforcer ses équipes pour accompagner sa croissance
et relever ses nouveaux défis.

Nous allons maintenant vous laisser vous présenter.
`;
}

function generateFallbackPresentation() {
  return `
Avant de commencer, quelques mots sur l’entreprise.

Il s’agit d’une organisation évoluant dans un environnement dynamique,
où l’adaptation, l’engagement et la collaboration sont des éléments clés.

L’entreprise recrute afin de renforcer ses équipes
et de répondre à de nouveaux enjeux de développement.

Nous allons maintenant vous laisser vous présenter.
`;
}

async function getCompanyPresentationFromServer() {
  const res = await fetch('/company-presentation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ offerText: offerEl.value })
  });

  const data = await res.json();
  return data.text;
}

// ===== ENTRETIEN =====
function startInterview() {
  stopInterview();

  phases = [
    { name: "Présentation entreprise", duration: Number(tCompanyEl.value) },
    { name: "Présentation candidat", duration: Number(tCandidateEl.value) },
    { name: "Questions", duration: Number(tQuestionsEl.value) },
  ];

  currentPhaseIndex = 0;
  startPhase();
}

function startPhase() {


  if (currentPhaseIndex >= phases.length) {
    stageEl.innerText = "✅ Entretien terminé";
    timerEl.innerText = "00:00";
    speak("L’entretien est maintenant terminé. Merci.");
    return;
  }

  const phase = phases[currentPhaseIndex];
  remainingSeconds = phase.duration;

  stageEl.innerText = phase.name;
  updateTimer();

  // 🎙️ Annonce de phase
  speak(getPhaseAnnouncement(phase.name));

  // 🎙️ Parole IA entreprise
  if (phase.name === "Présentation entreprise") {
    speak(generateCompanyPresentation(offerEl.value));
  }

  timerInterval = setInterval(tick, 1000);
}

function tick() {
  if (isPaused) return;

  remainingSeconds--;
  updateTimer();

  if (remainingSeconds <= 0) {
    clearInterval(timerInterval);
    speechSynthesis.cancel(); // coupe la voix à la fin du temps
    currentPhaseIndex++;
    startPhase();
  }
}

// ===== CONTROLES =====
function pauseResume() {
  isPaused = !isPaused;

  if (isPaused) {
    speechSynthesis.pause();
    stageEl.innerText = "⏸️ Pause";
  } else {
    speechSynthesis.resume();
    stageEl.innerText = phases[currentPhaseIndex].name;
  }
}

function stopInterview() {
  clearInterval(timerInterval);
  timerInterval = null;
  speechSynthesis.cancel();

  isPaused = false;
  remainingSeconds = 0;
  currentPhaseIndex = 0;

  stageEl.innerText = "⏹️ Entretien arrêté";
  timerEl.innerText = "00:00";
}

// ===== UI =====
function updateTimer() {
  const min = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const sec = String(remainingSeconds % 60).padStart(2, "0");
  timerEl.innerText = `${min}:${sec}`;
}