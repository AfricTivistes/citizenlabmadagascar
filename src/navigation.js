import { getPermalink, getBlogPermalink } from '~/utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'CitizenLab',
      links: [
        {
          text: 'A Propos',
          href: getPermalink('/a-propos'),
        },
        {
          text: 'Equipe',
          href: getPermalink('/equipe'),
        },
      ],
    },
    {
      text: 'Actualités',
      href: getBlogPermalink(),
      links: [

        {
          text: 'Campagnes',
          href: getPermalink('campagnes', 'category'),
        },
        {
          text: 'Podcasts',
          href: getPermalink('podcast', 'category'),
        },
        {
          text: 'Vidéos',
          href: getPermalink('videos', 'category'),
        },

      ],
    },
    {
      text: 'Blog',
      href: getPermalink('blog', 'category')
    },
    {
      text: 'Formations',
      href: getPermalink('formations', 'category')
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
    
  ],
};

export const footerData = {
  links: [
    {
      title: 'CitizenLab',
      links: [
        {
          text: 'A Propos', href: getPermalink('/a-propos') },
        { text: 'Equipe', href: getPermalink('/equipe') },
      ],
    },
    {
      title: 'Actualités',
      links: [
        { text: "Actualités", href: getBlogPermalink() },
        { text: "Blog", href: getPermalink('blog', 'category') },
        { text: 'Campagnes', href:'#' },
        { text: 'Podcasts', href: getPermalink('podcast', 'category') },
        { text: 'Vidéos', href: getPermalink('videos', 'category') },
        { text: 'Formations', href: getPermalink('formations', 'category') },
      ],
    },

    {
      title: "Nous Contacter",
      links:[
        { text: "citizenlabmadagascar@africtivistes.org", href:'mailto:citizenlabmadagascar@africtivistes.org ' },
        { text: "+261 37 646 16 64", href: 'tel:+261376461664'},
        {text: " Lot IVP 7 Bis Ankadifotsy Befelatanana, Antananarivo, 101 Madagascar ", href: '#'}
      ]
    }
  ],
  secondaryLinks: [
    { text: 'Termes et Conditions', href: getPermalink('/termes-et-conditions') },
    //{ text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { icon: 'tabler:brand-x', href: 'https://twitter.com/MadagascarCitizenlab' },
    { icon: 'tabler:brand-instagram', href: 'https://www.instagram.com/citizenlabmadagascar/' },
    { icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/profile.php?id=61553614994311' },
    { icon: 'tabler:brand-linkedin', href: 'https://www.linkedin.com/company/citizen-lab-madagascar/about/' },
    { icon: 'tabler:brand-github', href: 'https://github.com/AfricTivistes/citizenlabmadagascar' },
  ],
  footNote: `
  <a href="https://www.africtivistes.com" target= '_blank'>
  <img src="https://update.africtivistes.org/wp-content/uploads/2023/10/Logo-Africtivistes.png" alt="AfricTivistes" class="h-8" />
  </a>
    <a target= '_blank' class="text-green-600 hover:underline dark:text-gray-200" href="https://www.africtivistes.com"> AfricTivistes</a> · All rights reserved.
  `,
};
