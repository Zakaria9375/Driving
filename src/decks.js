import raw from './signs.raw.json';
import { english } from './english';
import { germanyCards } from './germany';

const latviaSigns = raw.map(sign => {
  const [url] = sign.images;
  if (!url) throw new Error(`Missing image for sign ${sign.id}`);
  const extension = new URL(url).pathname.split('.').at(-1)?.toLowerCase();
  if (!extension) throw new Error(`Missing image extension for sign ${sign.id}`);
  return { ...sign, ...english(sign), nativeName: sign.nameLv, kind: 'sign', image: `/signs/${sign.id}-0.${extension}` };
});

export const decks = {
  latvia: {
    id: 'latvia', country: 'Latvia', adjective: 'Latvian', nativeLanguage: 'lv',
    nativeLabel: 'Latvian', subtitle: 'Latvian road signs', libraryLabel: 'Sign library',
    storageKey: 'cels-progress-v1', items: latviaSigns, itemLabel: 'signs',
    categories: ['All signs', 'Warning', 'Priority', 'Prohibitory', 'Mandatory', 'Traffic regulations', 'Services', 'Directions & information', 'Supplementary plates'],
    source: 'https://likumi.lv/ta/id/274865-celu-satiksmes-noteikumi',
    introduction: 'Look at the sign, recall its meaning, then turn the card.',
    libraryIntroduction: 'Explore all 320 official signs. Choose one to practice.',
    footer: 'Official sign images from Likumi.lv · English study summaries · Catalogue checked 14 October 2026',
  },
  germany: {
    id: 'germany', country: 'Germany', adjective: 'German', nativeLanguage: 'de',
    nativeLabel: 'German', subtitle: 'Germany · differences', libraryLabel: 'Signs & rules',
    storageKey: 'cels-germany-progress-v1', items: germanyCards, itemLabel: 'cards',
    categories: ['All cards', 'German signs', 'Supplementary plates', 'Driving rules'],
    source: 'https://www.gesetze-im-internet.de/stvo_2013/',
    introduction: 'Learn the signs and driving rules that change when you drive in Germany.',
    libraryIntroduction: 'A focused collection of German differences, with sign images and practical scenarios.',
    footer: 'Selected differences, not the full German catalogue · Official StVO images · Sources checked 14 October 2026',
  },
};
