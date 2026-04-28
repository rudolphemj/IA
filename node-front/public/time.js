function updateDateTime() {
  const now = new Date();

  const date = now.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const time = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  document.getElementById('date').textContent = date;
  document.getElementById('time').textContent = time;
}

// affichage immédiat
updateDateTime();

// mise à jour toutes les secondes
setInterval(updateDateTime, 1000);

