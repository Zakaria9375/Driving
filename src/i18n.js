export const messages = {
'Ceļš, open flashcards': 'Ceļš, Lernkarten öffnen',
'Study collection': 'Lernsammlung', 'Study country': 'Land zum Lernen',
'Latvia · 320 signs': 'Lettland · 320 Zeichen', 'Germany · differences': 'Deutschland · Unterschiede',
'Main navigation': 'Hauptnavigation', 'Flashcards': 'Lernkarten', 'Study by category': 'Nach Kategorie lernen',
'Progress is saved separately for each country.': 'Der Lernfortschritt wird für jedes Land getrennt gespeichert.',
'Practice': 'Üben', 'Library': 'Sammlung',
'Different roads. Know what changes.': 'Andere Straßen. Die Unterschiede kennen.',
'A little practice. A safer journey.': 'Ein wenig üben. Sicherer unterwegs.',
'Get to know every sign.': 'Lerne jedes Zeichen kennen.',
'Learning progress': 'Lernfortschritt', 'Cards marked known': 'Als bekannt markierte Karten',
'Reset progress': 'Fortschritt zurücksetzen', 'Clear progress': 'Fortschritt löschen', 'Keep progress': 'Fortschritt behalten',
'Browser storage is unavailable. Your progress will last only for this visit.': 'Der Browserspeicher ist nicht verfügbar. Dein Fortschritt bleibt nur für diesen Besuch erhalten.',
'Practice selection': 'Übungsauswahl', 'Still learning': 'Noch zu lernen', 'Practice again': 'Erneut üben',
'Search name or number': 'Name oder Nummer suchen', 'Search signs by name or number': 'Zeichen nach Name oder Nummer suchen',
'Shuffle': 'Mischen', 'All caught up in this category.': 'In dieser Kategorie ist alles gelernt.',
'Mark a card “Practice again” to collect it here.': 'Markiere eine Karte mit „Erneut üben“, damit sie hier erscheint.',
'Try another category or return to the full collection.': 'Wähle eine andere Kategorie oder die gesamte Sammlung.',
'Driving scenario': 'Fahrsituation', 'Supplementary plate': 'Zusatzzeichen',
'Hide the meaning': 'Bedeutung ausblenden', 'Reveal the meaning': 'Bedeutung anzeigen',
'Image unavailable. Reload the page to try again.': 'Bild nicht verfügbar. Lade die Seite erneut, um es noch einmal zu versuchen.',
'What changes in Germany': 'Was sich in Deutschland ändert', 'Official sources': 'Amtliche Quellen',
'Read the official regulations': 'Amtliche Vorschriften lesen', 'Additional official rule': 'Weitere amtliche Regelung',
'Latvian comparison source': 'Lettische Vergleichsquelle', 'What would you do?': 'Was würdest du tun?',
'What does this sign mean?': 'Was bedeutet dieses Zeichen?',
'Take a moment to recall before revealing.': 'Überlege kurz, bevor du die Antwort aufdeckst.',
'✓ Marked known': '✓ Als bekannt markiert', '↻ Practice again': '↻ Erneut üben', 'Not rated yet': 'Noch nicht bewertet',
'Hide answer': 'Antwort ausblenden', 'Reveal answer': 'Antwort anzeigen', 'Reveal meaning': 'Bedeutung anzeigen',
'Space': 'Leertaste', 'I know this': 'Das weiß ich', 'Previous sign': 'Vorheriges Zeichen', 'Next sign': 'Nächstes Zeichen',
'Card': 'Karte', 'of': 'von', 'browse': 'blättern', 'reveal': 'aufdecken',
'Rate honestly. Repetition makes it stick.': 'Bewerte ehrlich. Wiederholung festigt das Wissen.',
'Rule': 'Regel', 'Plate': 'Zusatz', '✓ Known': '✓ Bekannt', '↻ Review': '↻ Wiederholen',
'Cards shuffled.': 'Karten gemischt.',
'Latvia': 'Lettland', 'Germany': 'Deutschland', 'Latvian': 'Lettisch', 'German': 'Deutsch',
'Latvian road signs': 'Lettische Verkehrszeichen', 'Sign library': 'Zeichensammlung', 'Signs & rules': 'Zeichen & Regeln',
'signs': 'Zeichen', 'cards': 'Karten',
'All signs': 'Alle Zeichen', 'Warning': 'Gefahrzeichen', 'Priority': 'Vorfahrt', 'Prohibitory': 'Verbotszeichen',
'Mandatory': 'Gebotszeichen', 'Traffic regulations': 'Verkehrsregelung', 'Services': 'Service',
'Directions & information': 'Wegweisung & Information', 'Supplementary plates': 'Zusatzzeichen',
'All cards': 'Alle Karten', 'German signs': 'Deutsche Zeichen', 'Driving rules': 'Verkehrsregeln',
'Look at the sign, recall its meaning, then turn the card.': 'Schau dir das Zeichen an, erinnere dich an seine Bedeutung und decke dann die Karte auf.',
'Explore all 320 official signs. Choose one to practice.': 'Entdecke alle 320 amtlichen Zeichen. Wähle eines zum Üben.',
'Learn the signs and driving rules that change when you drive in Germany.': 'Lerne die Zeichen und Verkehrsregeln, die beim Fahren in Deutschland anders sind.',
'A focused collection of German differences, with sign images and practical scenarios.': 'Eine gezielte Sammlung deutscher Unterschiede mit Verkehrszeichen und praktischen Fahrsituationen.',
'Official sign images from Likumi.lv · English study summaries · Catalogue checked 14 October 2026': 'Amtliche Zeichenbilder von Likumi.lv · Deutsche Lernzusammenfassungen · Katalog geprüft am 14. Oktober 2026',
'Selected differences, not the full German catalogue · Official StVO images · Sources checked 14 October 2026': 'Ausgewählte Unterschiede, kein vollständiger deutscher Katalog · Amtliche StVO-Bilder · Quellen geprüft am 14. Oktober 2026',
};
export function translate(text, language) { return language === 'de' ? messages[text] ?? text : text; }
export function localizeDeck(deck, language) {
  if (language === 'en') return deck;
  const translated = { ...deck, items: deck.items.map(card => ({ ...card, ...card.de, searchText: `${card.name} ${card.prompt || ''}` })) };
  for (const key of ['country', 'adjective', 'nativeLabel', 'subtitle', 'libraryLabel', 'itemLabel', 'introduction', 'libraryIntroduction', 'footer']) translated[key] = translate(deck[key], language);
  translated.categories = deck.categories.map(label => translate(label, language));
  return translated;
}
export function loadLanguage() {
  try { return localStorage.getItem('cels-language-v1') === 'de' ? 'de' : 'en'; }
  catch { return 'en'; }
}
