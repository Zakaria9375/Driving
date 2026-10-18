import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { decks } from './decks';
import './styles.css';
import { loadLanguage, localizeDeck, translate } from './i18n';

function loadProgress(config) {
  try {
    const saved = JSON.parse(localStorage.getItem(config.storageKey));
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(config.items.filter(s => ['known', 'review'].includes(saved[s.id])).map(s => [s.id, saved[s.id]]));
  } catch { return {}; }
}
function shuffled(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
function Icon({ name, ...props }) {
  const paths = {
    cards: <><rect x="5" y="6" width="14" height="15" rx="2"/><path d="M9 3h10a3 3 0 0 1 3 3v11"/></>,
    library: <><path d="M4 4h6v16H4zM14 4h6v16h-6zM7 8h0M17 8h0"/></>,
    arrow: <path d="m9 5 7 7-7 7"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    shuffle: <><path d="M3 5h3c5 0 6 14 12 14h3m-4-4 4 4-4 4M3 19h3c2 0 3-2 4-4m4-6c1-2 2-4 4-4h3m-4-4 4 4-4 4"/></>,
    repeat: <><path d="M20 7H7a4 4 0 0 0-4 4v1m13-9 4 4-4 4M4 17h13a4 4 0 0 0 4-4v-1m-13 9-4-4 4-4"/></>,
    search: <><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
function App() {
  const [country, setCountry] = useState('latvia');
  const [language, setLanguage] = useState(loadLanguage);
  const config = useMemo(() => localizeDeck(decks[country], language), [country, language]);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'de' ? 'Ceļš · Verkehrszeichen lernen' : 'Ceļš · Driving practice';
  }, [language]);
  function changeLanguage(value) {
    setLanguage(value);
    try { localStorage.setItem('cels-language-v1', value); } catch { /* Selection still works for this visit. */ }
  }
  return <StudyApp key={country} config={config} language={language} onLanguageChange={changeLanguage} onCountryChange={setCountry}/>;
}
function StudyApp({ config, language, onLanguageChange, onCountryChange }) {
  const t = text => translate(text, language);
  const { items: signs, categories, source: SOURCE, storageKey: STORAGE } = config;
  const [view, setView] = useState('practice');
  const [category, setCategory] = useState(0);
  const [scope, setScope] = useState('all');
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(() => signs.map(s => s.id));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(() => loadProgress(config));
  const [storageWarning, setStorageWarning] = useState(false);
  const [resetAsked, setResetAsked] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [imageError, setImageError] = useState(false);
  const deck = useMemo(() => {
    const lookup = new Map(signs.map(s => [s.id, s]));
    const search = query.trim().toLowerCase();
    return order.map(id => lookup.get(id)).filter(s => (!category || s.category === category) &&
      (scope === 'all' || (scope === 'review' ? progress[s.id] === 'review' : progress[s.id] !== 'known')) &&
      (!search || `${s.id} ${s.name} ${s.nativeName} ${s.prompt || ''} ${s.de?.name || ''} ${s.de?.prompt || ''} ${s.searchText || ''}`.toLowerCase().includes(search)));
  }, [category, scope, progress, query, order, signs]);
  const currentIndex = deck.length ? Math.min(index, deck.length - 1) : 0;
  const card = deck[currentIndex];
  const known = signs.filter(s => progress[s.id] === 'known').length;
  const review = signs.filter(s => progress[s.id] === 'review').length;
  const percent = Math.round(known / signs.length * 100);
  function updateProgress(nextProgress) {
    setProgress(nextProgress);
    try { localStorage.setItem(STORAGE, JSON.stringify(nextProgress)); }
    catch { setStorageWarning(true); }
  }

  function resetCard() { setIndex(0); setRevealed(false); setImageError(false); setAnnouncement(''); }
  function move(delta) {
    if (!deck.length) return;
    setIndex((currentIndex + delta + deck.length) % deck.length);
    setRevealed(false); setImageError(false); setAnnouncement('');
  }
  function rate(status) {
    if (!card || (status !== 'known' && !revealed)) return;
    updateProgress({ ...progress, [card.id]: status });
    const leavesDeck = scope === 'review' && status !== 'review' || scope === 'unlearned' && status === 'known';
    setIndex(leavesDeck ? Math.min(currentIndex, Math.max(0, deck.length - 2)) : (currentIndex + 1) % deck.length);
    setRevealed(false); setImageError(false);
    setAnnouncement(language === 'de' ? `Karte ${card.id} als ${status === 'known' ? 'bekannt' : 'erneut zu üben'} markiert.` : `Card ${card.id} marked ${status === 'known' ? 'known' : 'for another practice'}.`);
  }
  useEffect(() => {
    function onKey(event) {
      if (view !== 'practice' || event.ctrlKey || event.metaKey || event.altKey || event.repeat || ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'].includes(event.target.tagName)) return;
      if (event.code === 'Space' && card) { event.preventDefault(); setRevealed(value => !value); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === '1') rate('review');
      if (event.key === '2') rate('known');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function changeCategory(value) { setCategory(value); resetCard(); }
  function shuffleDeck() { setOrder(previous => shuffled(previous)); resetCard(); setAnnouncement(t('Cards shuffled.')); }
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setView('practice')} aria-label={t("Ceļš, open flashcards")}><span className="brand-mark">↗</span><span>Ceļš<small>{config.subtitle}</small></span></button>
      <label className="country-switch"><span>{t("Study collection")}</span><select aria-label={t("Study country")} value={config.id} onChange={e => onCountryChange(e.target.value)}><option value="latvia">{t("Latvia · 320 signs")}</option><option value="germany">{t("Germany · differences")}</option></select></label>
      <nav aria-label={t("Main navigation")}>
        <button className={view === 'practice' ? 'nav-button selected' : 'nav-button'} onClick={() => setView('practice')}><Icon name="cards"/>{t("Flashcards")}</button>
        <button className={view === 'library' ? 'nav-button selected' : 'nav-button'} onClick={() => setView('library')}><Icon name="library"/>{config.libraryLabel}<span>{signs.length}</span></button>
      </nav>
      <div className="category-heading">{t("Study by category")}</div>
      <div className="category-list">{categories.map((label, value) => <button key={label} className={category === value ? 'category active' : 'category'} onClick={() => changeCategory(value)} aria-pressed={category === value}><span>{label}</span><span>{value ? signs.filter(s => s.category === value).length : signs.length}</span></button>)}</div>
      <div className="sidebar-bottom"><p>{t("Progress is saved separately for each country.")}</p><a href={SOURCE} target="_blank" rel="noreferrer">{language === 'de' ? `Amtliche Vorschriften: ${config.country}` : `Official ${config.adjective} regulations`} ↗</a></div>
    </aside>
    <main>
      <header className="page-header"><div><div className="breadcrumb">{config.country} <span>/</span> {view === 'practice' ? t('Practice') : t('Library')}</div><h1>{config.id === 'germany' ? t('Different roads. Know what changes.') : view === 'practice' ? t('A little practice. A safer journey.') : t('Get to know every sign.')}</h1><p>{view === 'practice' ? config.introduction : config.libraryIntroduction}</p></div><label className="language-switch"><span>{language === 'de' ? 'Sprache' : 'Language'}</span><select aria-label="Language / Sprache" value={language} onChange={e => { onLanguageChange(e.target.value); setAnnouncement(''); }}><option value="en" lang="en">English</option><option value="de" lang="de">Deutsch</option></select></label></header>
      <section className="progress-section" aria-label={t("Learning progress")}><div><strong>{known} <span>/ {signs.length} {config.itemLabel} {language === 'de' ? 'gelernt' : 'learned'}</span></strong><span className="progress-percent">{percent}%</span></div><progress value={known} max={signs.length} aria-label={t("Cards marked known")}/><div className="progress-caption"><span>{review} {language === 'de' ? 'erneut zu üben' : 'to practice again'}</span><button onClick={() => setResetAsked(value => !value)}>{t("Reset progress")}</button></div>{resetAsked ? <div className="reset-confirm">{language === 'de' ? `Nur gespeicherte Bewertungen für ${config.country} löschen?` : `Clear saved ratings for ${config.country} only?`} <button onClick={() => { updateProgress({}); resetCard(); setResetAsked(false); }}>{t("Clear progress")}</button><button onClick={() => setResetAsked(false)}>{t("Keep progress")}</button></div> : null}</section>
      {storageWarning ? <p className="notice" role="status">{t("Browser storage is unavailable. Your progress will last only for this visit.")}</p> : null}
      <div className="toolbar"><div className="scope-tabs" aria-label={t("Practice selection")}>{[['all', categories[0]], ['unlearned', t('Still learning')], ['review', t('Practice again')]].map(([value, label]) => <button key={value} aria-pressed={scope === value} className={scope === value ? 'active' : ''} onClick={() => { setScope(value); resetCard(); }}>{label}</button>)}</div><label className="search"><Icon name="search"/><input type="search" placeholder={t("Search name or number")} aria-label={t("Search signs by name or number")} value={query} onChange={e => { setQuery(e.target.value); resetCard(); }}/></label></div>
      <div className="deck-heading"><div><span className="category-dot"/>{categories[category]} <span className="count">{deck.length} {t('cards')}</span></div>{view === 'practice' ? <button className="shuffle" onClick={shuffleDeck} disabled={deck.length < 2}><Icon name="shuffle"/>{t("Shuffle")}</button> : null}</div>
      {deck.length === 0 ? <section className="empty"><Icon name="check" width="36" height="36"/><h2>{scope === 'unlearned' && !query ? t('All caught up in this category.') : scope === 'review' && !query ? (language === 'de' ? `Noch keine ${config.itemLabel} zum erneuten Üben.` : `No ${config.itemLabel} to practice again yet.`) : (language === 'de' ? `Keine passenden ${config.itemLabel}.` : `No matching ${config.itemLabel}.`)}</h2><p>{scope === 'review' ? t('Mark a card “Practice again” to collect it here.') : t('Try another category or return to the full collection.')}</p><button className="primary" onClick={() => { setScope('all'); setCategory(0); setQuery(''); resetCard(); }}>{language === 'de' ? 'Alle anzeigen:' : 'Show all'} {config.itemLabel}</button></section> : view === 'practice' ? <>
        <section className={`flashcard ${revealed ? 'is-revealed' : ''}`} aria-label={(language === 'de' ? `Lernkarte ${currentIndex + 1} von ${deck.length}` : `Flashcard ${currentIndex + 1} of ${deck.length}`)}>
          <div className="card-meta"><span>{categories[card.category]}</span><span>{card.kind === 'rule' ? t('Driving scenario') : card.signNumber ? `${language === 'de' ? 'Zeichen' : 'Sign'} ${card.signNumber}` : config.id === 'latvia' ? `${language === 'de' ? 'Zeichen' : 'Sign'} ${card.id}` : t('Supplementary plate')}</span></div>
          <button className={card.kind === 'rule' ? 'card-image rule-image' : 'card-image'} onClick={() => setRevealed(value => !value)} aria-label={revealed ? t('Hide the meaning') : t('Reveal the meaning')} aria-expanded={revealed}>
            {card.kind === 'rule' ? <span className="rule-prompt"><Icon name="cards" width="28" height="28"/><strong>{card.prompt}</strong></span> : imageError ? <span>{t("Image unavailable. Reload the page to try again.")}</span> : <img src={card.image} alt={revealed ? card.name : `${config.country}: ${language === 'de' ? 'Verkehrszeichen' : 'road sign'} ${card.signNumber || card.id}`} onError={() => setImageError(true)} draggable="false"/>}
          </button>
          {revealed ? <div className="answer" key={card.id}><h2>{card.name}</h2><p>{card.description}</p>{card.difference ? <div className="country-difference"><strong>{t("What changes in Germany")}</strong><p>{card.difference}</p></div> : null}<details><summary>{card.kind === 'rule' ? t('Official sources') : `${config.nativeLabel}${language === 'de' ? 'er Name & Quelle' : ' name & source'}`}</summary>{card.kind !== 'rule' ? <p lang={config.nativeLanguage}>{card.nativeName}</p> : null}<a href={card.source || SOURCE} target="_blank" rel="noreferrer">{language === 'de' ? t('Read the official regulations') : card.sourceLabel || t('Read the official regulations')} ↗</a>{card.extraSource ? <a href={card.extraSource} target="_blank" rel="noreferrer">{t('Additional official rule')} ↗</a> : null}{card.difference ? <a href={decks.latvia.source} target="_blank" rel="noreferrer">{t('Latvian comparison source')} ↗</a> : null}</details></div> : <div className="question"><h2>{card.kind === 'rule' ? t('What would you do?') : t('What does this sign mean?')}</h2><p>{t("Take a moment to recall before revealing.")}</p></div>}
          <div className="card-bottom"><span>{progress[card.id] === 'known' ? t('✓ Marked known') : progress[card.id] === 'review' ? t('↻ Practice again') : t('Not rated yet')}</span><button className="reveal-link" onClick={() => setRevealed(value => !value)}>{revealed ? t('Hide answer') : t('Reveal answer')}<span>↗</span></button></div>
        </section>
        <div className="practice-actions">{revealed ? <button className="secondary" onClick={() => rate('review')}><Icon name="repeat"/>{t("Practice again")}<kbd>1</kbd></button> : <button className="secondary" onClick={() => setRevealed(true)}>{t("Reveal meaning")}<kbd>{t("Space")}</kbd></button>}<button className="primary" onClick={() => rate('known')}><Icon name="check"/>{t("I know this")}<kbd>2</kbd></button></div>
        <div className="pagination"><button aria-label={t("Previous sign")} onClick={() => move(-1)} disabled={deck.length < 2}><Icon name="arrow" className="previous"/></button><span>{t("Card")}<strong>{currentIndex + 1}</strong> {t('of')} {deck.length}</span><button aria-label={t("Next sign")} onClick={() => move(1)} disabled={deck.length < 2}><Icon name="arrow"/></button></div>
        <p className="keyboard-hint"><kbd>←</kbd><kbd>→</kbd>{t("browse")}<span>·</span> <kbd>{t("Space")}</kbd>{t("reveal")}<span>·</span>{t("Rate honestly. Repetition makes it stick.")}</p>
      </> : <div className="sign-library">{deck.map((sign, i) => <button key={sign.id} className="library-sign" onClick={() => { setIndex(i); setRevealed(false); setImageError(false); setView('practice'); }}><div className={sign.kind === 'rule' ? 'library-image library-rule' : 'library-image'}>{sign.kind === 'rule' ? <><Icon name="cards"/><span>{t("Driving scenario")}</span></> : <img src={sign.image} alt={sign.name} loading="lazy"/>}</div><span className="library-number">{sign.signNumber || (sign.kind === 'rule' ? t('Rule') : config.id === 'germany' ? t('Plate') : sign.id)}<span>{progress[sign.id] === 'known' ? t('✓ Known') : progress[sign.id] === 'review' ? t('↻ Review') : ''}</span></span><strong>{sign.name}</strong></button>)}</div>}
      <footer>{config.footer}</footer>
      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);

