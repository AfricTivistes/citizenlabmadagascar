import algoliasearch from 'https://cdn.jsdelivr.net/npm/algoliasearch@4.22.1/+esm';

const searchClient = algoliasearch('DA85FAYBEU', 'cca2b9e467771c47e8c64b7ac2acdbe0');
const indices = [
  { name: 'wp_admin_posts', label: 'Article' },
  { name: 'wp_admin_pages', label: 'Page' },
  { name: 'wp_admin_projects', label: 'Projet' },
  { name: 'wp_admin_programmes', label: 'Programme' },
  { name: 'wp_admin_communiques', label: 'Communiqué' },
  { name: 'wp_admin_equipes', label: 'Équipe' },
];

const params = new URLSearchParams(window.location.search);
const q = params.get('q') || '';

async function searchAll() {
  if (!q) return;
  let allResults = [];
  for (const { name, label } of indices) {
    const index = searchClient.initIndex(name);
    const { hits } = await index.search(q);
    allResults = allResults.concat(hits.map(hit => ({ ...hit, _type: label })));
  }
  return allResults;
}

searchAll().then(results => {
  const container = document.getElementById('search-results');
  if (!results || results.length === 0) {
    container.innerHTML = '<p>Aucun résultat trouvé.</p>';
    return;
  }
  container.innerHTML = results.map(item => `
    <div style="margin-bottom:2em">
      <a href="${item.permalink || item.url}">
        <h2>${item.post_title || item.title}</h2>
      </a>
      <span style="font-size:0.9em;color:#666">[${item._type}]</span>
      <div>${item.post_excerpt || item.excerpt || ''}</div>
    </div>
  `).join('');
}); 