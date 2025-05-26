import { autocomplete } from 'https://cdn.jsdelivr.net/npm/@algolia/autocomplete-js/+esm';
import algoliasearch from 'https://cdn.jsdelivr.net/npm/algoliasearch@4.22.1/+esm';

const searchClient = algoliasearch('DA85FAYBEU', 'cca2b9e467771c47e8c64b7ac2acdbe0');

const indices = [
  { name: 'wp_admin_posts', label: 'Article' },
  { name: 'wp_admin_pages', label: 'Page' },
  { name: 'wp_admin_projects', label: 'Projet' },
  { name: 'wp_admin_programmes', label: 'Programme' },
  { name: 'wp_admin_communiques', label: 'Communiqué' },
  { name: 'wp_admin_equipes', label: 'Équipe' },
  // Ajoute ici d'autres index si besoin
];

autocomplete({
  container: '#autocomplete',
  placeholder: 'Rechercher...',
  getSources({ query }) {
    return indices.map(({ name, label }) => ({
      sourceId: name,
      getItems() {
        return searchClient
          .initIndex(name)
          .search(query)
          .then(({ hits }) => hits.map(hit => ({ ...hit, _type: label })));
      },
      templates: {
        header() {
          return `<span style="font-size:0.9em;color:#888">${label}s</span>`;
        },
        item({ item }) {
          return `
            <a href="${item.permalink || item.url}" style="display:block;padding:0.5em 0">
              <strong>${item.post_title || item.title}</strong>
              <span style="font-size:0.85em;color:#666;margin-left:0.5em">[${item._type}]</span>
              <div style="font-size:0.9em;color:#666">${item.post_excerpt || item.excerpt || ''}</div>
            </a>
          `;
        }
      }
    }));
  },
  onSubmit({ state }) {
    window.location.href = `/recherche?q=${encodeURIComponent(state.query)}`;
  }
}); 