let userFields = [];
let editMode = false;
let editUserId = null;

const apiUsers = '/api/users';
const apiFields = '/api/config/fields';

const form = document.getElementById('userForm');
const userList = document.getElementById('userList');

/* ===========================
   CHARGER LES CHAMPS DYNAMIQUES
=========================== */
const loadFormFields = async () => {
  const res = await fetch('/api/config/fields');
  userFields = await res.json();

  form.innerHTML = '';

  userFields.forEach(field => {
    const input = document.createElement('input');
    input.name = field.key;
    input.placeholder = field.label;
    input.type = field.type;
    if (field.required) input.required = true;
    form.appendChild(input);
  });

  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.textContent = 'Ajouter';
  form.appendChild(btn);
};

/* userList.appendChild(card); */

/* ===========================
   AJOUT D’UTILISATEUR
=========================== */
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {};
  new FormData(form).forEach((value, key) => {
    data[key] = value;
  });

  if (editMode) {
    // ✅ UPDATE
    await fetch(`/api/users/${editUserId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    editMode = false;
    editUserId = null;
    form.querySelector('button[type="submit"]').textContent = 'Ajouter';
  } else {
    // ✅ CREATE
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  form.reset();
  loadUsers();
});

/* ===========================
   AFFICHER LES UTILISATEURS
=========================== */

const loadUsers = async () => {
  const usersRes = await fetch('/api/users');
  const users = await usersRes.json();

  const table = document.getElementById('userTable');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');

  // ✅ EN-TÊTES
  thead.innerHTML = `
    <tr>
      ${userFields.map(f => `<th>${f.label}</th>`).join('')}
      <th>Actions</th>
    </tr>
  `;

  // ✅ LIGNES
  tbody.innerHTML = '';

  users.forEach(user => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      ${userFields.map(f => `
        <td>${user[f.key] ?? '—'}</td>
      `).join('')}
      <td>
        <button onclick="editUser(${user.id})">✏️</button>
        <button onclick="deleteUser(${user.id})">❌</button>
      </td>
    `;

    tbody.appendChild(tr);
  });
console.log('Users reçus:', users);
};

/* ===========================
   MODIFICATION
=========================== */
const editUser = async (id) => {
  const res = await fetch('/api/users');
  const users = await res.json();

  const user = users.find(u => u.id === id);
  if (!user) return;

  // Pré-remplir le formulaire selon la config
  userFields.forEach(field => {
    const input = form.querySelector(`[name="${field.key}"]`);
    if (input) {
      input.value = user[field.key] ?? '';
    }
  });

  editMode = true;
  editUserId = id;

  form.querySelector('button[type="submit"]').textContent = 'Mettre à jour';
};
/* ===========================
   SUPPRESSION
=========================== */
const deleteUser = async (id) => {
  if (!confirm('Supprimer cet utilisateur ?')) return;

  await fetch(`${apiUsers}/${id}`, { method: 'DELETE' });
  loadUsers();
};

/* ===============

const showMessage = (msg) => {
  const el = document.createElement('div');
  el.className = 'message';
  el.textContent = msg;
  document.body.prepend(el);
  setTimeout(() => el.remove(), 2000);
};





================= */

document.addEventListener('DOMContentLoaded', async () => {
  await loadFormFields(); // ⬅️ CHARGE LA CONFIG
  await loadUsers();      // ⬅️ PUIS AFFICHE LE TABLEAU
});

/* ===========================
   INIT
=========================== */
loadFormFields();

/* ===========================
   RECHERCHE UTILISATEUR
=========================== */

const rechercherUtilisateur = () => {
  const valeur = document
    .getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

  const lignes = document.querySelectorAll("#userTable tbody tr");

  lignes.forEach(ligne => {
    // 🔥 Texte complet de la ligne (toutes colonnes)
    const texteLigne = ligne.textContent.toLowerCase();

    ligne.style.display = texteLigne.includes(valeur) ? "" : "none";
  });
};

// Bouton
document.getElementById("searchBtn")
  ?.addEventListener("click", rechercherUtilisateur);

// Recherche en temps réel (option fortement recommandée)
document.getElementById("searchInput")
  ?.addEventListener("keyup", rechercherUtilisateur);




